"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ReactNode } from "react";

interface ErrorLayoutProps {
    icon: ReactNode;
    title: string;
    description: string;
    code: string;
    backText: string;
}

export default function ErrorLayout({ icon, title, description, code, backText }: ErrorLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center space-y-8 relative"
            >
                <div className="relative inline-block">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
                        }}
                        className="text-9xl font-black text-primary/5 select-none"
                    >
                        {code}
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ rotate: -20, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="text-primary"
                        >
                            {icon}
                        </motion.div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {title}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {description}
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4"
                >
                    <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                        <Link href="/">
                            {backText}
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
