import { getShifts, getStaffUsers, getOpenShifts } from "@/services/shift";
import { AddOrEditShift, TableView, CloseShift } from "@/components/shifts"
import { getTranslations } from "next-intl/server";

export default async function ShiftsPage() {
    const shifts = await getShifts();
    const openShifts = await getOpenShifts();
    const users = await getStaffUsers();
    const t = await getTranslations("Shift");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                    <p className="text-muted-foreground">{t("description")}</p>
                </div>
                <div className="flex gap-2">
                    <CloseShift openShifts={openShifts} />
                    <AddOrEditShift users={users || []} />
                </div>
            </div>
            <TableView shifts={shifts} users={users || []} />
        </div>
    );
}
