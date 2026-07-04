import connectDB from "@/lib/db";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const user = await User.findOne({ email: userEmail }).populate(
      "cart.product"
    );

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(user.cart);
  } catch (error) {
    return Response.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}