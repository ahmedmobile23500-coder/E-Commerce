import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;

  const isDashboard = pathname.startsWith("/dashboard");
  const isCart = pathname.startsWith("/cart");
  const isFavourites = pathname.startsWith("/favourites");
  const isAuthPage = pathname === "/login";

  const isProtectedRoute = isDashboard || isCart || isFavourites;

  // 🔒 Block protected routes if NOT logged in
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 Prevent logged-in users from seeing login page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cart/:path*", "/favourites/:path*", "/login"],
};