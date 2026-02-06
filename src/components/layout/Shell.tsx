"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useTranslations } from "next-intl"
import { Link, useRouter, usePathname } from "@/i18n/routing"
import { LogOut, Calendar, Clock } from "lucide-react"
import { logout } from "@/services/user"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks"

const PATH_MAP: Record<string, string> = {
    "/management": "home",
    "/management/dashboard": "dashboard",
    "/management/pos": "pos",
    "/management/menu": "menu",
    "/management/reservations": "reservations",
    "/management/users": "users",
    "/management/reports": "reports",
    "/management/settings": "settings",
    "/management/tables": "tables",
};

export function Shell({ children }: { children: React.ReactNode, allowedPages?: string[] }) {
    const t = useTranslations("Common")
    const router = useRouter()
    const pathname = usePathname()
    const { user } = useAuth()
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    const pageKey = PATH_MAP[pathname] || "dashboard";
    const pageName = t(pageKey);

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="h-20 border-b flex items-center justify-between px-4 sm:px-8 lg:px-12 sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-3">
                    <Link href="/management" className="text-xl font-black tracking-tighter text-primary hover:opacity-80 transition-opacity">
                        <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            {pageName}
                        </h1>
                    </Link>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="hidden xl:flex items-center gap-4 bg-accent/20 px-4 py-1.5 rounded-2xl border border-primary/5">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary/60" />
                            <span className="text-xs font-bold whitespace-nowrap">
                                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-border" />
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary/60" />
                            <span className="text-xs font-bold tabular-nums">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <span className="text-sm font-bold text-primary">{user?.username || ""}</span>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <LanguageSwitcher />
                        <ModeToggle />
                    </div>

                    <div className="h-8 w-px bg-border hidden md:block" />

                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="group rounded-2xl px-3 sm:px-6 h-10 sm:h-12 font-black uppercase tracking-tighter text-xs sm:text-sm transition-all flex items-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 shadow-lg shadow-rose-500/10"
                    >
                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                        <span className="hidden xs:inline-block sm:inline-block">{t("logout")}</span>
                    </Button>
                </div>
            </header>

            <main className="flex-1">
                <div className="container mx-auto p-4 sm:p-6 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    )
}
