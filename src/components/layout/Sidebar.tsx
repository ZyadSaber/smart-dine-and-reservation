"use client"

import { Link, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
    Home,
    LayoutDashboard,
    Utensils,
    Package,
    CalendarDays,
    BarChart3,
    Settings,
    Users,
    LogOut
} from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { logout } from "@/services/user"

const menuItems = [
    { icon: Home, label: "home", href: "/management" },
    { icon: LayoutDashboard, label: "dashboard", href: "/management/dashboard" },
    { icon: Utensils, label: "pos", href: "/management/pos" },
    { icon: Package, label: "inventory", href: "/management/inventory" },
    { icon: CalendarDays, label: "reservations", href: "/management/reservations" },
    { icon: Users, label: "users", href: "/management/users" },
    { icon: BarChart3, label: "reports", href: "/management/reports" },
    { icon: Settings, label: "settings", href: "/management/settings" },
]

export function Sidebar({ allowedPages }: { allowedPages?: string[] }) {
    const t = useTranslations("Common")
    const pathname = usePathname()
    const router = useRouter()

    const filteredItems = allowedPages
        ? menuItems.filter(item => allowedPages.includes(item.href))
        : menuItems

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    return (
        <aside className="hidden lg:flex h-screen w-64 flex-col bg-card border-e fixed start-0 top-0">
            <div className="p-6 flex justify-center">
                <div className="relative w-48 h-32 overflow-hidden flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="Smart Dine Logo"
                        fill
                        className="object-contain scale-150"
                        priority
                    />
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {filteredItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{t(item.label)}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">{t("logout")}</span>
                </button>
            </div>
        </aside>
    )
}
