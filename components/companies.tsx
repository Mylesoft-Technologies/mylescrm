import { BarChart3, Building2, FileText, Mail, Receipt, ShieldCheck, Sparkles, Users } from "lucide-react";

const modules = [
    { name: "Contacts", icon: Users },
    { name: "Companies", icon: Building2 },
    { name: "Deals", icon: BarChart3 },
    { name: "Invoices", icon: Receipt },
    { name: "Emails", icon: Mail },
    { name: "Reports", icon: FileText },
    { name: "AI insights", icon: Sparkles },
    { name: "Security", icon: ShieldCheck },
];

const Companies = () => {
    return (
        <section className="flex flex-col gap-8 w-full">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                    One workspace for the full sales journey
                </h2>
                <p className="mt-4 text-muted-foreground text-base">
                    MylesCRM connects the practical work sales teams repeat every day,
                    from relationship memory to billing readiness.
                </p>
            </div>

            <div className="mx-auto max-w-6xl px-4 w-full">
                <div className="grid grid-cols-2 border-l border-t border-border md:grid-cols-4">
                    {modules.map((module) => (
                        <div
                            key={module.name}
                            className="flex h-24 flex-col items-center justify-center gap-3 border-b border-r border-border transition-all duration-300 hover:bg-muted/50 lg:h-32"
                        >
                            <module.icon className="h-6 w-6 text-primary" />
                            <span className="text-sm font-medium text-foreground">{module.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Companies;
