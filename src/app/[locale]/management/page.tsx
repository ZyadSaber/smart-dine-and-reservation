import { getAuthSession } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";
import WelcomeClient from "./WelcomeClient";
import { menuItems } from "@/global/links";

export default async function ManagementPage() {
    const session = await getAuthSession() as { username?: string, allowedPages?: string[], role?: string } | null;
    const t = await getTranslations("Common");

    const allowedPages = session?.allowedPages || [];
    const filteredItems = menuItems.filter(item => {
        // POS is only for staff and cashier
        if (item.href === "/management/pos" && !["staff", "cashier"].includes(session?.role || "")) return false;
        return allowedPages.includes(item.href);
    });
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
