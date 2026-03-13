"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, Building2, Globe, Clock } from "lucide-react";
import { CURRENCIES } from "@/types";

const TIMEZONES = [
  "Africa/Nairobi", "Africa/Lagos", "Africa/Johannesburg", "Africa/Cairo",
  "Europe/London", "Europe/Paris", "America/New_York", "America/Chicago",
  "America/Los_Angeles", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    orgName: "", industry: "", timezone: "Africa/Nairobi", currency: "KES",
  });

  const industries = ["Technology / SaaS", "Real Estate", "E-commerce & Retail", "Finance", "Education", "Healthcare", "Consulting", "Manufacturing", "Other"];

  const handleSubmit = async () => {
    setLoading(true);
    // In production: create org via Convex, then redirect to WorkOS auth
    setTimeout(() => {
      router.push("/api/auth/login?returnTo=/dashboard/dashboard");
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(222,47%,6%)]">
      <div className="w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Set up your CRM</h1>
          <p className="mt-1 text-sm text-white/50">14-day free trial — no card required</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {/* Progress */}
          <div className="mb-6 flex gap-2">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-white/10"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">Company name</label>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-primary/60 transition-colors">
                  <Building2 className="h-4 w-4 text-white/30" />
                  <input
                    value={form.orgName}
                    onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                    placeholder="Acme Corp"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">Industry</label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/60"
                >
                  <option value="" className="bg-gray-900">Select industry…</option>
                  {industries.map((i) => <option key={i} value={i} className="bg-gray-900">{i}</option>)}
                </select>
              </div>
              <button
                onClick={() => form.orgName && setStep(2)}
                disabled={!form.orgName}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50 hover:bg-primary/90 transition-all"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">Primary currency</label>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-primary/60">
                  <Globe className="h-4 w-4 text-white/30" />
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="flex-1 bg-transparent text-sm text-white outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-gray-900">
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">Timezone</label>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-primary/60">
                  <Clock className="h-4 w-4 text-white/30" />
                  <select
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    className="flex-1 bg-transparent text-sm text-white outline-none"
                  >
                    {TIMEZONES.map((t) => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/70 hover:bg-white/5 transition-colors">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white disabled:opacity-70 hover:bg-primary/90 transition-all"
                >
                  {loading ? "Creating…" : <>Launch CRM <ArrowRight className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
