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

    const { userId, productId } = body;

    if (
      !userId ||
      !productId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return NextResponse.json(
        { message: "Invalid userId or productId" },
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

    // ⚠️ ASSUMPTION: user.cart is an array of { product, quantity }
    user.cart = user.cart.filter(
      (i: any) => i.product.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(userId).populate(
      "cart.product"
    );

    return NextResponse.json(updatedUser.cart);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}