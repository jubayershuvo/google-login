// app/api/emails/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readEmails } from "@/lib/readEmails";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Missing email parameter" },
        { status: 400 }
      );
    }

    const emails = await readEmails(email);

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
