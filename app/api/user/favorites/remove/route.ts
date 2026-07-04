import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(userId, {
      $pull: {
        favorites: productId,
      },
    });

    return NextResponse.json({
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}