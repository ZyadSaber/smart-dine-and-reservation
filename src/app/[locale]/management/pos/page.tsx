import { TableGrid } from "@/components/pos/TableGrid";
import { getTranslations } from "next-intl/server";
import { getRunningTables } from "@/services/order"
import { getAuthSession } from "@/lib/auth-utils"

export default async function POSPage() {
    const t = await getTranslations("POS");
    const tables = await getRunningTables()
    const currentSession = await getAuthSession()

    if (!currentSession?.shiftId) {
        throw new Error(t("openShiftFirst"))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {t("tables")}
                </h2>
            </div>

            <TableGrid tables={tables || []} />
        </div>
    );
}
