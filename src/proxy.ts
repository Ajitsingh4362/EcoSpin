import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/admin/auth";
import { adminConfig } from "@/admin/config";

// Every /admin page needs the counter password, except the login page itself.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Lock switched off in src/admin/config.ts: let everyone in, and send the login page straight to the panel.
  if (!adminConfig.passwordLock) {
    if (pathname === "/admin/login") return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (pathname === "/admin/login") return NextResponse.next();

  if (await isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
