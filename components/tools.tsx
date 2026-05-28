"use client";

import { motion } from "motion/react";
import { Bot, CreditCard, Database, Mail, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

type Tool = {
    name: string;
    icon: ComponentType<{ className?: string }>;
};

export default function ToolFeature() {
    const tools: Tool[] = [
        {
            name: "Convex",
            icon: Database,
        },
        {
            name: "WorkOS",
            icon: ShieldCheck,
        },
        {
            name: "Resend",
            icon: Mail,
        },
        {
            name: "Stripe",
            icon: CreditCard,
        },
        {
            name: "OpenAI",
            icon: Bot,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex w-full flex-col items-center justify-center lg:my-6"
        >
            <div className="mb-12 flex flex-col items-center gap-3 px-4 text-center">
                <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                    Built on the tools MylesCorp already trusts
                </h2>
                <p className="max-w-md text-sm text-muted-foreground sm:text-base">
                    MylesCRM combines product-grade infrastructure with integrations ready for sales operations.
                </p>
            </div>

            <div className="flex items-center justify-center -space-x-3">
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            ease: "easeOut",
                        }}
                        className="relative flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background shadow-sm"
                    >
                        <tool.icon className="h-6 w-6 text-primary" />
                        <span className="sr-only">{tool.name}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
