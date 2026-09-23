import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "resumeai_session";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/resumes",
  "/jobs",
  "/settings",
  "/matches",
  "/strategies",
  "/content-writer",
  "/quality",
];

// Routes accessible only to unauthenticated visitors
const AUTH_ROUTES = ["/login", "/register"];

/**
 * Safely inspects a JWT payload to check if it has expired.
 * Does not perform cryptographic verification (handled by backend API),
 * but checks structure and exp claim to avoid routing loops.
 */
function isTokenExpired(token: string): boolean {
  try {
    let cleanToken = token.trim();
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1);
    }
    if (cleanToken.startsWith("Bearer ")) {
      cleanToken = cleanToken.substring(7).trim();
    }
    const parts = cleanToken.split(".");
    if (parts.length !== 3) return true;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(padLength);
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);
    if (!payload || typeof payload !== "object") return true;
    if (!payload.exp) return false;
    // 5-second buffer for clock skew
    return Date.now() >= payload.exp * 1000 - 5000;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const hasValidSession = !!sessionCookie && !isTokenExpired(sessionCookie);

  // 1. Unauthenticated or expired user accessing a protected route -> Redirect to /login
  if (isProtected && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/dashboard") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    // If an invalid or expired cookie is present, clear it from browser
    if (sessionCookie) {
      response.cookies.set(AUTH_COOKIE_NAME, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
    }
    return response;
  }

  // 2. Already authenticated user accessing /login or /register -> Redirect to /dashboard
  if (isAuthRoute && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
