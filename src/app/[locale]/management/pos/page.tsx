import { TableGrid, CloseTableView, Reservations } from "@/components/pos";
import { getTranslations } from "next-intl/server";
import { getRunningTables } from "@/services/order"
import { getAuthSession } from "@/lib/auth-utils"

export default async function POSPage() {
    const t = await getTranslations("POS");
    const {
        allTables,
        occupiedTables,
    } = await getRunningTables()
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
                <div className="flex flex-wrap gap-2">
                    <CloseTableView tables={occupiedTables || []} />
                    <Reservations />
                </div>
            </div>

            <TableGrid tables={allTables || []} />
        </div>
    );
}
