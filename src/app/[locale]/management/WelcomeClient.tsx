"use client"

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowRight,
    Sparkles,
    Clock,
    Calendar,
    LayoutDashboard,
    Utensils,
    Package,
    CalendarDays,
    Users,
    BarChart3,
    Settings,
    Home
} from "lucide-react";
import { useEffect, useState } from "react";

import { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
    "dashboard": LayoutDashboard,
    "pos": Utensils,
    "inventory": Package,
    "reservations": CalendarDays,
    "users": Users,
    "reports": BarChart3,
    "settings": Settings,
    "home": Home
};

interface WelcomeItem {
    iconName: string;
    label: string;
    href: string;
    description: string;
    translatedLabel: string;
}

interface WelcomeClientProps {
    username: string;
    items: WelcomeItem[];
}

export default function WelcomeClient({ username, items }: WelcomeClientProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnim = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center mb-16"
            >
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-linear-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                        <span className="text-5xl animate-bounce-slow">👋</span>
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute -top-2 -right-2 text-primary"
                    >
                        <Sparkles className="w-6 h-6" />
                    </motion.div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-balance">
                    Welcome back, <span className="bg-linear-to-r from-primary to-rose-500 bg-clip-text text-transparent">{username}</span>!
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
                    Your management suite is ready. Let&apos;s make today exceptional for your guests.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-accent/30 rounded-2xl border border-primary/5 shadow-sm backdrop-blur-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">
                            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-accent/30 rounded-2xl border border-primary/5 shadow-sm backdrop-blur-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            >
                {items.map((item) => {
                    const Icon = ICON_MAP[item.iconName] || Package;
                    return (
                        <motion.div key={item.href} variants={itemAnim}>
                            <Link href={item.href} className="group block h-full">
                                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-linear-to-br from-card to-accent/20 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                        <Icon className="w-24 h-24" />
                                    </div>
                                    <CardHeader className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <CardTitle className="text-2xl pt-6 group-hover:text-primary transition-colors duration-300">
                                            {item.translatedLabel}
                                        </CardTitle>
                                        <CardDescription className="text-base leading-relaxed">
                                            {item.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-end pt-0 pb-6 pr-6 relative z-10">
                                        <div className="text-primary font-bold inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                            Launch <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </CardContent>
                                    {/* Abstract glow effect on hover */}
                                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                                </Card>
                            </Link>
                        </motion.div>
                    )
                })}
            </motion.div>

            {/* Bottom Warm Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="rounded-[3rem] bg-linear-to-r from-orange-500/10 via-rose-500/5 to-purple-500/10 p-10 md:p-16 text-center relative overflow-hidden border border-primary/5 shadow-xl"
            >
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-400/30 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/30 blur-[100px] rounded-full animate-pulse" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black mb-6 text-foreground/90 tracking-tight">
                        Thought for the day
                    </h2>
                    <p className="text-xl md:text-2xl text-muted-foreground/80 font-medium leading-relaxed italic">
                        &quot;Great service is not what you do, but how you make people feel. A warm smile and sincere greeting can define a guest&apos;s entire experience.&quot;
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-primary">100%</span>
                            <span className="text-xs uppercase font-black tracking-widest text-muted-foreground">Uptime</span>
                        </div>
                        <div className="w-px h-10 bg-border hidden md:block" />
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-primary">Live</span>
                            <span className="text-xs uppercase font-black tracking-widest text-muted-foreground">Sync</span>
                        </div>
                        <div className="w-px h-10 bg-border hidden md:block" />
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-primary">Active</span>
                            <span className="text-xs uppercase font-black tracking-widest text-muted-foreground">Session</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <footer className="mt-20 text-center text-sm text-muted-foreground/60">
                <p>© 2026 SmartDine POS • Crafted for Hospitality Excellence</p>
            </footer>
        </div>
    );
}
