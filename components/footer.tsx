"use client"

import Link from "next/link";
import { motion } from "motion/react";

const Footer = () => {
    const links = [
        { name: "Features", href: "/features" },
        { name: "Industries", href: "/industries" },
        { name: "Implementation", href: "/implementation" },
        { name: "Pricing", href: "/pricing" },
        { name: "Security", href: "/security" },
        { name: "Resources", href: "/resources" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];
    return (
        <motion.div
            className="flex flex-col gap-8 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
                MylesCRM
            </Link>
            <ul className="flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
                {links.map((link) => (
                    <li key={link.name} className="flex flex-row items-center gap-1 hover:text-primary transition-all duration-300 text-muted-foreground">
                        <Link href={link.href}>{link.name}</Link>
                    </li>
                ))}
            </ul>
            <p className="text-muted-foreground">&copy; {new Date().getFullYear()} MylesCorp Technologies Ltd. All rights reserved.</p>
        </motion.div>
    )
}

export default Footer
