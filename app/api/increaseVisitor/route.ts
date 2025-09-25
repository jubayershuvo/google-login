// app/api/increaseVisitor/route.ts
import { NextResponse } from "next/server";
import Data from "@/models/Data";
import { connectDB } from "@/lib/mongodb";

export async function POST() {
  try {
    await connectDB();

    // Find the existing visitors doc
    let visitors = await Data.findOne();

    if (!visitors) {
      // If it doesn't exist, create one with count = 1
      visitors = await Data.create({ count: 1 });
    } else {
      // Otherwise, increment count
      visitors.count += 1;
      await visitors.save();
    }

    return NextResponse.json({ visitors }, { status: 200 });
  } catch (error) {
    console.error("Error increasing visitor:", error);
    return NextResponse.json(
      { error: "Failed to increase visitor" },
      { status: 500 }
    );
  }
}
