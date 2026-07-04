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

    const { userId, productId, quantity } = body;

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

    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be a number >= 1" },
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
    const item = user.cart.find(
      (i: any) => i.product.toString() === productId
    );

    if (!item) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    item.quantity = quantity;
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