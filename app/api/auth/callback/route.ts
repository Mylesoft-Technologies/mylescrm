import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=${error}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=no_code`
    );
  }

  try {
    const { user, organizationId } =
      await workos.userManagement.authenticateWithCode({
        code,
        clientId: process.env.WORKOS_CLIENT_ID!,
      });

    // Find or create user in Convex
    let dbUser = await convex.query(api.organizations.getUser, {
      workosUserId: user.id,
    });

    if (!dbUser) {
      // New user — create personal org
      const slug = user.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 30) + `-${Date.now().toString(36)}`;

      const orgId = await convex.mutation(api.organizations.create, {
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email,
        slug,
        timezone: "Africa/Nairobi",
        currency: "USD",
        locale: "en-US",
        workosOrgId: organizationId,
      });

      await convex.mutation(api.organizations.createUser, {
        orgId,
        workosUserId: user.id,
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        avatar: user.profilePictureUrl ?? undefined,
        role: "super_admin",
      });

      // Seed default pipeline
      await convex.mutation(api.pipeline.seedDefaultPipeline, {
        orgId,
        createdBy: (await convex.query(api.organizations.getUser, { workosUserId: user.id }))!._id,
        currency: "USD",
      });
    }

    // Set session cookie
    const sessionToken = Buffer.from(
      JSON.stringify({ workosUserId: user.id, email: user.email })
    ).toString("base64");

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/dashboard`
    );
    
    response.cookies.set("auth-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=server_error`
    );
  }
}