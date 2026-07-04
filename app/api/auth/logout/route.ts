import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  // Clear NextAuth / JWT cookie
  response.cookies.set("next-auth.session-token", "", {
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("token", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}