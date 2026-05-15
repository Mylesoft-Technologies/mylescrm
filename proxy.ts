import { authkitProxy } from "@workos-inc/authkit-nextjs";

export default authkitProxy({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      "/",
      "/features",
      "/industries",
      "/implementation",
      "/security",
      "/resources",
      "/pricing",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/auth/login",
      "/auth/signup",
      "/api/auth/login",
      "/api/auth/callback",
      "/api/webhooks/(.*)",
    ],
  },
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
