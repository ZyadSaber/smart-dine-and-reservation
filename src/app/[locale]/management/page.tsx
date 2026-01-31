import { getAuthSession } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";
import WelcomeClient from "./WelcomeClient";
import {
    LayoutDashboard,
    Utensils,
    Package,
    CalendarDays,
    Users,
    BarChart3,
    Settings
} from "lucide-react";

export default async function ManagementPage() {
    const session = await getAuthSession() as { username?: string, allowedPages?: string[] } | null;
    const t = await getTranslations("Common");

    const menuItems = [
        { icon: LayoutDashboard, label: "dashboard", href: "/management/dashboard", description: "Monitor your restaurant's performance and key metrics." },
        { icon: Utensils, label: "pos", href: "/management/pos", description: "Take orders, manage tables, and process payments." },
        { icon: Package, label: "inventory", href: "/management/inventory", description: "Manage your menu, categories, and stock levels." },
        { icon: CalendarDays, label: "reservations", href: "/management/reservations", description: "View and organize upcoming guest bookings." },
        { icon: Users, label: "users", href: "/management/users", description: "Manage staff accounts, roles, and system access." },
        { icon: BarChart3, label: "reports", href: "/management/reports", description: "Analyze sales data and generate business insights." },
        { icon: Settings, label: "settings", href: "/management/settings", description: "Configure your restaurant's profile and preferences." },
    ];

    const allowedPages = session?.allowedPages || [];
    const filteredItems = menuItems.filter(item => allowedPages.includes(item.href));
    const username = session?.username || "User";

    return (
        <WelcomeClient
            username={username}
            items={filteredItems.map(item => ({
                label: item.label,
                href: item.href,
                description: item.description,
                iconName: item.label,
                translatedLabel: t(item.label)
            }))}
        />
    );
}
