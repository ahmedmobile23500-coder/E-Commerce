import connectDB from "@/lib/db";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;
  const { productId } = await req.json();

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const itemIndex = user.cart.findIndex(
    (item: any) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    user.cart[itemIndex].quantity += 1;
  } else {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();

  return Response.json(user.cart);
}

export async function DELETE(req: Request) {
  await connectDB();

  const { userId, productId } = await req.json();

  const user = await User.findById(userId);

  user.cart = user.cart.filter(
    (item: any) => item.product.toString() !== productId
  );

  await user.save();

  return Response.json(user.cart);
}