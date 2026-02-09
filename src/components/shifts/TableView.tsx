"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IShiftData } from "@/types/shifts";
import isArrayHasData from "@/lib/isArrayHasData";
import { format } from "date-fns";
import { UserData } from "@/types/users";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteShift } from "@/services/shift";
import AddOrEditShift from "./AddOrEditShift";
import { useTranslations } from "next-intl";

interface TableViewProps {
    shifts: IShiftData[];
    users: UserData[];
}

const TableView = ({ shifts, users }: TableViewProps) => {
    const t = useTranslations("Shift");
    const tPOS = useTranslations("POS");

    return (
        <div className="rounded-xl border p-3 bg-card shadow-sm overflow-hidden overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("staff")}</TableHead>
                        <TableHead>{t("startTime")}</TableHead>
                        <TableHead>{t("endTime")}</TableHead>
                        <TableHead>{t("openingBalance")}</TableHead>
                        <TableHead>{t("totalSales")}</TableHead>
                        <TableHead>{t("actualCash")}</TableHead>
                        <TableHead>{t("status")}</TableHead>
                        <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isArrayHasData(shifts) ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">{t("noShifts")}</TableCell>
                        </TableRow>
                    ) : (
                        shifts.map((shift) => (
                            <TableRow key={shift._id}>
                                <TableCell className="font-medium">
                                    {(shift.staffId as UserData).fullName}
                                </TableCell>
                                <TableCell>
                                    {shift.startTime ? format(new Date(shift.startTime), "PPp") : "-"}
                                </TableCell>
                                <TableCell>
                                    {shift.endTime ? format(new Date(shift.endTime), "PPp") : "-"}
                                </TableCell>
                                <TableCell>{shift.openingBalance.toFixed(2)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-xs">
                                        <span>{tPOS("cash")}: {shift.totalCashSales.toFixed(2)}</span>
                                        <span>{tPOS("visa")}: {shift.totalCardSales.toFixed(2)}</span>
                                        <span>{tPOS("digital")}: {shift.totalDigitalSales.toFixed(2)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {shift.actualCashAtClose !== undefined ? shift.actualCashAtClose.toFixed(2) : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={shift.status === "Open" ? "default" : "secondary"} className="capitalize">
                                        {shift.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddOrEditShift currentShift={shift} users={users} />
                                        <DeleteDialog id={shift?._id || ""} deleteAction={deleteShift} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableView;
