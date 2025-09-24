// lib/readEmails.ts
import { google, gmail_v1 } from "googleapis";
import User from "@/models/User";
import { connectDB } from "./mongodb";

// 1. OAuth2 Client with better error handling
function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing Google OAuth credentials in environment variables"
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// 2. Decode Base64 (Gmail encodes bodies this way)
function decodeBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf-8");
}

// 3. Extract Body from Gmail Message
function extractBody(payload?: gmail_v1.Schema$MessagePart): string {
  if (!payload) return "";

  // Case: direct body
  if (payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  // Case: multipart
  if (payload.parts && payload.parts.length) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
      // Recursive check (nested multipart/alternative)
      if (part.parts) {
        const nested = extractBody(part);
        if (nested) return nested;
      }
    }
  }

  return "";
}

// 4. Extract Attachments
async function extractAttachments(
  gmail: gmail_v1.Gmail,
  userId: string,
  msgId: string,
  payload?: gmail_v1.Schema$MessagePart
) {
  const attachments: {
    filename?: string | null;
    mimeType?: string | null;
    data?: string | null | undefined;
  }[] = [];

  if (!payload?.parts) return attachments;

  for (const part of payload.parts) {
    if (part.filename && part.body?.attachmentId) {
      const attachment = await gmail.users.messages.attachments.get({
        userId,
        messageId: msgId,
        id: part.body.attachmentId,
      });

      attachments.push({
        filename: part.filename,
        mimeType: part.mimeType,
        data: attachment.data.data, // Base64 string
      });
    }

    // recursive check for nested parts
    if (part.parts) {
      const nested = await extractAttachments(gmail, userId, msgId, part);
      attachments.push(...nested);
    }
  }

  return attachments;
}

// 5. Read Emails for a User
export async function readEmails(userEmail: string) {
  try {
    await connectDB();

    // Check if user exists and has refresh token
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error(`User not found for email: ${userEmail}`);
    }

    if (!user.refreshToken) {
      throw new Error(`No refresh token found for user: ${userEmail}`);
    }

    console.log("Found user with refresh token");

    const oauth2Client = getOAuthClient();

    // Set credentials and handle token refresh
    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    });

    // Force token refresh to ensure we have valid access token
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      console.log("Successfully refreshed access token");
    } catch (refreshError) {
      console.error("Failed to refresh access token:", refreshError);
      throw new Error(
        "Failed to refresh Google access token. User may need to re-authenticate."
      );
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Test API access first
    try {
      const profile = await gmail.users.getProfile({ userId: "me" });
      console.log("Gmail profile:", profile.data.emailAddress);
    } catch (profileError) {
      console.error("Failed to get Gmail profile:", profileError);
      throw new Error("Unable to access Gmail API. Check permissions.");
    }

    // Fetch emails with better error handling
    console.log("Fetching emails...");
    const res = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"], // fetch both inbox + spam
      maxResults: 1000,
    });

    console.log("Gmail API response:", {
      resultSizeEstimate: res.data.resultSizeEstimate,
      messagesCount: res.data.messages?.length || 0,
    });

    const messages = res.data.messages || [];

    if (messages.length === 0) {
      console.log("No messages found in the inbox");
      return [];
    }

    // Process emails
    const emails = await Promise.all(
      messages.map(async (msg) => {
        try {
          const fullMsg = await gmail.users.messages.get({
            userId: "me",
            id: msg.id!,
            format: "full", // Explicitly request full format
          });

          const payload = fullMsg.data.payload;
          const headers = payload?.headers || [];

          const subject =
            headers.find((h) => h.name === "Subject")?.value || "No Subject";
          const from =
            headers.find((h) => h.name === "From")?.value || "Unknown Sender";
          const to = headers.find((h) => h.name === "To")?.value || "";
          const date = headers.find((h) => h.name === "Date")?.value || "";

          const body = extractBody(payload);
          const attachments = await extractAttachments(
            gmail,
            "me",
            msg.id!,
            payload
          );

          return {
            id: msg.id,
            threadId: msg.threadId,
            snippet: fullMsg.data.snippet || "",
            subject,
            from,
            to,
            date,
            body,
            attachments,
            labelIds: fullMsg.data.labelIds || [],
          };
        } catch (msgError) {
          console.error(`Error processing message ${msg.id}:`, msgError);
          return null;
        }
      })
    );

    // Filter out any failed message processing
    return emails.filter((email) => email !== null);
  } catch (error) {
    console.error("Error in readEmails:", error);
    throw error;
  }
}
