"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

const features = [
    "Contact and company management",
    "Deal pipeline and activity tracking",
    "Invoices, billing, and payment workflow readiness",
    "AI-assisted sales insights",
    "Team dashboards and reporting",
    "MylesCorp implementation support",
    "Security-first deployment review",
];

const Pricing = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    return (
        <motion.div
            style={{
                backgroundImage: isMobile
                    ? "url('/images/templates/axis/pricing-mobile.svg')"
                    : "url('/images/templates/axis/pricing.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="rounded-[2rem] px-6 pt-16 pb-8 md:px-12 md:py-20 max-w-7xl mx-auto w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div className="mx-auto max-w-4xl">
                <div className="mb-12 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
                        Launch MylesCRM with the right rollout plan
                    </h2>
                    <p className="mt-4 text-sm text-white/70 sm:text-base">
                        Pricing depends on tenant setup, team size, integrations, and deployment scope.
                    </p>
                </div>

                <Card className="overflow-hidden rounded-2xl border-0 bg-background/85 p-0 shadow-xl">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-col border-b border-border/30 p-8 md:basis-2/5 md:border-b-0 md:border-r md:p-10">
                            <h3 className="text-center text-4xl font-medium text-foreground">
                                MylesCRM
                            </h3>
                            <p className="mt-1 text-center text-lg text-muted-foreground">
                                For ambitious sales teams
                                <br />
                                and growing operators
                            </p>

                            <p className="mt-8 text-center text-xl font-medium text-foreground">
                                Custom rollout pricing
                            </p>

                            <div className="mt-8 flex flex-col gap-3">
                                <Button render={<Link href="/contact" />} className="w-full rounded-full">
                                    Start implementation
                                </Button>
                                <Button
                                    render={<Link href="/pricing" />}
                                    variant="outline"
                                    className="w-full rounded-full border-foreground/20 bg-transparent"
                                >
                                    Book a pricing call
                                </Button>
                            </div>

                            <p className="mt-8 text-center text-sm text-muted-foreground font-light">
                                Includes implementation planning, product configuration, and future
                                <br />
                                improvements.
                            </p>
                        </div>

                        <div className="flex flex-col justify-between p-8 md:basis-3/5 md:p-10">
                            <ul className="flex flex-col gap-3">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className="h-4 w-4 text-foreground" strokeWidth={2} />
                                        <span className="text-sm text-foreground font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 border-t border-border/30 pt-6">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    MylesCRM is designed for relationship-driven work. Manage customers,
                                    track deals, and stay on top of follow-ups without the
                                    complexity of traditional CRMs.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export default Pricing;
