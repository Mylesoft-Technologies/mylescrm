import { redirect } from "next/navigation";
import { getSignInUrl, getSession } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default async function LoginPage() {
  const { user } = await getSession();
  if (user) redirect("/dashboard/dashboard");

  const signInUrl = await getSignInUrl();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(222,47%,6%)]">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to your MylesCRM account</p>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <a
            href={signInUrl}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-all hover:scale-[1.01]"
          >
            Continue with WorkOS <ArrowRight className="h-4 w-4" />
          </a>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <p className="mt-4 text-center text-xs text-white/40">
            Sign in with Google, GitHub, or email via WorkOS AuthKit
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-white/40">
          No account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Start your free trial
          </Link>
        </p>
      </div>
    </div>
  );
}
