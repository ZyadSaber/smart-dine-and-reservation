import { TableGrid, Reservations } from "@/components/pos";
import { getTranslations } from "next-intl/server";
import { getRunningTables } from "@/services/order"
import { getAuthSession } from "@/lib/auth-utils"
import { getOpenShifts } from "@/services/shift";

export default async function POSPage() {
    const t = await getTranslations("POS");
    const {
        allTables,
    } = await getRunningTables()
    const currentSession = await getAuthSession()

    if (currentSession?.role === "admin") {
        return <div className="p-10 text-center font-bold text-rose-500">Access Restricted: POS is only available for Staff and Cashier users.</div>
    }

    const openShifts = await getOpenShifts();
    const hasActiveShift = currentSession?.shiftId || openShifts.length > 0;

    if (!hasActiveShift) {
        throw new Error(t("openShiftFirst"))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {t("tables")}
                </h2>
                <div className="flex flex-wrap gap-2">
                    <Reservations />
                </div>
            </div>

            <TableGrid tables={allTables || []} />
        </div>
    );
}
