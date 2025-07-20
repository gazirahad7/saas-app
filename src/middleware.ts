//export { auth as middleware } from "@/lib/auth";
/*
import { auth } from "@/lib/auth";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware checks if the user is authenticated before allowing access to protected routes.
const protectedRoutes = ["/middleware", "/dashboard"];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {
    const absoluteUrl = new URL("/", request.nextUrl.origin);

    return NextResponse.redirect(absoluteUrl.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};


*/

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define public routes
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Redirect logged-in users away from auth pages
  if (
    isLoggedIn &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect non-authenticated users to login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
