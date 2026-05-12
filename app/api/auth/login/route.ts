import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const signInUrl = await getSignInUrl({ returnTo: "/dashboard/dashboard" });
  return NextResponse.redirect(signInUrl);
}
