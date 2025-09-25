// app/api/visitors/route.ts
import { NextResponse } from "next/server";
import Data from "@/models/Data";
import { connectDB } from "@/lib/mongodb"; // Make sure you have this

export async function GET() {
  try {
    await connectDB();

    let visitors = await Data.findOne();

    // If no document exists, create one
    if (!visitors) {
      visitors = await Data.create({ count: 0 }); // adjust fields as needed
    }

    return NextResponse.json(
      { visitors: { count: visitors.count } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitors" },
      { status: 500 }
    );
  }
}
