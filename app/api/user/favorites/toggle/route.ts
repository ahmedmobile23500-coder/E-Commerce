import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "Missing userId or productId" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 🔍 check if already in favorites
    const isFav = user.favorites.some(
      (id: any) => id.toString() === productId
    );

    if (isFav) {
      // ❌ REMOVE
      user.favorites = user.favorites.filter(
        (id: any) => id.toString() !== productId
      );
    } else {
      // ❤️ ADD
      user.favorites.push(productId);
    }

    await user.save();

    return NextResponse.json({
      message: isFav ? "Removed from favorites" : "Added to favorites",
      isFavorite: !isFav,
    });
  } catch (error: any) {
    console.error("FAVORITES TOGGLE ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}