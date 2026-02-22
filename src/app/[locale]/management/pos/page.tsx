import { TableGrid, Reservations } from "@/components/pos";
import { getTranslations } from "next-intl/server";
import { getRunningTables } from "@/services/order"
import { getAuthSession } from "@/lib/auth-utils"
import { getOpenShifts } from "@/services/shift";
import CloseTable from "@/components/pos/CloseTableView";
import { getReservations } from "@/services/reservation";

export default async function POSPage() {
    const t = await getTranslations("POS");
    const {
        allTables,
        occupiedTables
    } = await getRunningTables()
    const currentSession = await getAuthSession()

    const openShifts = await getOpenShifts();
    const hasActiveShift = currentSession?.shiftId || openShifts.length > 0;

    if (!hasActiveShift) {
        throw new Error(t("openShiftFirst"))
    }

    const confirmedReservations = await getReservations({ status: 'Confirmed' });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {t("tables")}
                </h2>
                <div className="flex flex-wrap gap-2">
                    {currentSession?.role === "cashier" && (
                        <CloseTable tables={occupiedTables || []} />
                    )}
                    <Reservations
                        confirmedReservations={confirmedReservations}
                        tables={allTables || []}
                    />
                </div>
            </div>

            <TableGrid tables={allTables || []} />
        </div>
    );
}
