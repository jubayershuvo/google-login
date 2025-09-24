import nodemailer from "nodemailer";
import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

/**
 * Sends an email using Gmail via OAuth2 access token.
 * @param userEmail The Gmail address of the sender.
 * @param refreshToken The OAuth2 refresh token associated with the user.
 * @param to Recipient email address.
 * @param subject Email subject.
 * @param text Email plain text content.
 * @param senderName Optional display name for sender.
 */
export async function sendGmailMail({
  userEmail,
  refreshToken,
  to,
  subject,
  text,
  senderName,
}: {
  userEmail: string;
  refreshToken: string;
  to: string;
  subject: string;
  text: string;
  senderName?: string;
}) {
  try {
    // Set up OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    // Get access token
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    if (!accessToken) {
      throw new Error("Failed to get access token for Gmail");
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: userEmail,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken,
        accessToken,
      },
    });

    // Verify connection
    await transporter.verify();

    // Send email
    const result = await transporter.sendMail({
      from: `${senderName || userEmail} <${userEmail}>`,
      to,
      subject,
      text,
    });

    console.log("Gmail mail sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending Gmail mail:", error);
    throw error;
  }
}
