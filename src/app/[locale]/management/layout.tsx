import { Shell } from "@/components/layout/Shell";
import { getAuthSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { UserData } from "@/types/users";

export default async function ManagementLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const session = await getAuthSession() as UserData | null;
    const { locale } = await params;

    if (!session) {
        redirect(`/${locale}/login`);
    }

    return <Shell allowedPages={session.allowedPages}>{children}</Shell>;
}
