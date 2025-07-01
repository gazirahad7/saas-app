//export { auth as middleware } from "@/lib/auth";

import { auth } from "@/lib/auth";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware checks if the user is authenticated before allowing access to protected routes.
const protectedRoutes = ["/middleware"];

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
