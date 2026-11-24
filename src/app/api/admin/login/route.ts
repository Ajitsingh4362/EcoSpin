import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_DAYS, adminPassword, checkPassword, safeNext, sessionToken } from "@/admin/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? ""));
  const back = (error: string) =>
    NextResponse.redirect(new URL(`/admin/login?error=${error}&next=${encodeURIComponent(next)}`, request.url), 303);

  if (!adminPassword()) return back("setup");

  if (!(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return back("wrong");
  }

  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(SESSION_COOKIE, await sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}
