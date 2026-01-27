"use client"

import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Utensils,
    Package,
    CalendarDays,
    Menu
} from "lucide-react"
import { useTranslations } from "next-intl"

const navItems = [
    { icon: LayoutDashboard, label: "dashboard", href: "/management/dashboard" },
    { icon: Utensils, label: "pos", href: "/management/pos" },
    { icon: Package, label: "inventory", href: "/management/inventory" },
    { icon: CalendarDays, label: "reservations", href: "/management/reservations" },
]

export function BottomNav() {
    const t = useTranslations("Common")
    const pathname = usePathname()

    return (
        <nav className="lg:hidden fixed bottom-0 start-0 end-0 bg-background/80 backdrop-blur-lg border-t px-2 py-2 safe-area-pb">
            <div className="flex justify-around items-center">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                                isActive
                                    ? "text-primary scale-110"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium leading-none">{t(item.label)}</span>
                            {isActive && (
                                <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                            )}
                        </Link>
                    )
                })}
                <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
                    <Menu className="w-6 h-6" />
                    <span className="text-[10px] font-medium leading-none">{t("settings")}</span>
                </button>
            </div>
        </nav>
    )
}
