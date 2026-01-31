import ErrorLayout from "@/components/ErrorLayout";
import { ShieldAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ForbiddenPage() {
    const t = await getTranslations("Errors.forbidden");

    return (
        <ErrorLayout
            code="403"
            icon={<ShieldAlert size={120} strokeWidth={1.5} />}
            title={t("title")}
            description={t("description")}
            backText={t("backToHome")}
        />
    );
}
