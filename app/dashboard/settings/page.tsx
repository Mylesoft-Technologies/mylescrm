"use client";
import { useState } from "react";
import { Settings, User, Building2, Bell, Palette, Key, Users, Globe, Save } from "lucide-react";
import toast from "react-hot-toast";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "security", label: "Security", icon: Key },
];

const TEAM_MEMBERS = [
  { name: "Jonathan Ayany", email: "ayany004@gmail.com", role: "super_admin", status: "active" },
  { name: "Pauline Moraa", email: "pauline@mylesoft.com", role: "admin", status: "active" },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sales_manager: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  sales_rep: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  finance_officer: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ firstName: "Jonathan", lastName: "Ayany", email: "ayany004@gmail.com", phone: "0743993715", title: "Founder & CEO" });
  const [org, setOrg] = useState({ name: "Mylesoft Technologies", industry: "Technology / SaaS", timezone: "Africa/Nairobi", currency: "KES", website: "https://mylesoft.com" });
  const [notifications, setNotifications] = useState({ email: true, inApp: true, dealUpdates: true, taskReminders: true, leadAssigned: true, weeklyDigest: false });

  const save = () => toast.success("Settings saved!");

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Settings</h1><p className="text-sm text-muted-foreground">Manage your account and organization preferences</p></div>

      <div className="flex gap-6">
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map((t) => (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={"flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors " + (tab===t.id?"bg-primary/10 text-primary":"text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <t.icon className="h-4 w-4"/>{t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          {tab === "profile" && (
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {([["First Name","firstName"],["Last Name","lastName"],["Email","email"],["Phone","phone"],["Title","title"]] as const).map(([label, key]) => (
                  <div key={key} className={key==="email"||key==="title"?"col-span-2":""}>
                    <label className="mb-1.5 block text-sm font-medium">{label}</label>
                    <input value={(profile as any)[key]} onChange={e=>setProfile({...profile,[key]:e.target.value})} className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                ))}
              </div>
              <button onClick={save} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"><Save className="h-4 w-4"/>Save Profile</button>
            </div>
          )}

          {tab === "organization" && (
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <h3 className="font-semibold">Organization Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                {([["Organization Name","name"],["Industry","industry"],["Website","website"],["Timezone","timezone"],["Currency","currency"]] as const).map(([label,key]) => (
                  <div key={key} className={key==="name"||key==="website"?"col-span-2":""}>
                    <label className="mb-1.5 block text-sm font-medium">{label}</label>
                    <input value={(org as any)[key]} onChange={e=>setOrg({...org,[key]:e.target.value})} className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                ))}
              </div>
              <button onClick={save} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"><Save className="h-4 w-4"/>Save</button>
            </div>
          )}

          {tab === "team" && (
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">Team Members</h3>
                <button onClick={()=>toast.success("Invite sent!")} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"><Users className="h-3.5 w-3.5"/>Invite</button>
              </div>
              <div className="space-y-3">
                {TEAM_MEMBERS.map((m) => (
                  <div key={m.email} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">{m.name[0]}</div>
                      <div><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div>
                    </div>
                    <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium "+(ROLE_COLORS[m.role]??"")}>{m.role.replace("_"," ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <h3 className="font-semibold">Notification Preferences</h3>
              {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{key.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())}</p>
                  </div>
                  <button onClick={()=>setNotifications({...notifications,[key]:!val})} className={"relative inline-flex h-5 w-9 items-center rounded-full transition-colors "+(val?"bg-primary":"bg-muted")}>
                    <span className={"inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform "+(val?"translate-x-4":"translate-x-1")}/>
                  </button>
                </div>
              ))}
              <button onClick={save} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"><Save className="h-4 w-4"/>Save</button>
            </div>
          )}

          {tab === "integrations" && (
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">Integrations</h3>
              {[
                { name: "WorkOS AuthKit", desc: "Authentication & SSO", status: "connected", color: "bg-emerald-500" },
                { name: "Convex", desc: "Real-time database backend", status: "connected", color: "bg-emerald-500" },
                { name: "Resend", desc: "Transactional email", status: "connected", color: "bg-emerald-500" },
                { name: "Stripe", desc: "Card & subscription payments", status: "connected", color: "bg-emerald-500" },
                { name: "M-Pesa Daraja", desc: "Mobile money (Kenya)", status: "connected", color: "bg-emerald-500" },
                { name: "OpenRouter", desc: "AI / LLM API", status: "connected", color: "bg-emerald-500" },
                { name: "Cal.com", desc: "Meeting scheduling", status: "configure", color: "bg-amber-500" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div><p className="text-sm font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.desc}</p></div>
                  <div className="flex items-center gap-2">
                    <span className={"h-2 w-2 rounded-full "+i.color}/>
                    <span className="text-xs text-muted-foreground">{i.status}</span>
                    <button className="rounded border px-2 py-1 text-xs hover:bg-muted">Configure</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "security" && (
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">Security</h3>
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-sm font-medium mb-1">Authentication</p>
                <p className="text-xs text-muted-foreground">Managed by WorkOS AuthKit. Supports SSO, MFA, Google, GitHub, and email magic links.</p>
                <a href="https://dashboard.workos.com" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary hover:underline">Manage in WorkOS →</a>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-sm font-medium mb-1">API Keys</p>
                <p className="text-xs text-muted-foreground">API access is available on Growth and Enterprise plans.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
