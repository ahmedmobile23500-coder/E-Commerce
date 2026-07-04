import dbConnect from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  const { userId, productId } = await req.json();

  const user = await User.findById(userId);

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const alreadyFav = user.favorites.includes(productId);

  if (alreadyFav) {
    user.favorites = user.favorites.filter(
      (id: any) => id.toString() !== productId
    );
  } else {
    user.favorites.push(productId);
  }

  await user.save();

  return Response.json(user.favorites);
}