import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/model/User";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Missing request body" },
        { status: 400 }
      );
    }

    const { userId } = body;

    console.log("userId:", userId);
    console.log("type:", typeof userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid userId" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.favorites);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}