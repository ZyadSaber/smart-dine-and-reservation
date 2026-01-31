import ErrorLayout from "@/components/ErrorLayout";
import { SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
    const t = await getTranslations("Errors.notFound");

    return (
        <ErrorLayout
            code="404"
            icon={<SearchX size={120} strokeWidth={1.5} />}
            title={t("title")}
            description={t("description")}
            backText={t("backToHome")}
        />
    );
}
