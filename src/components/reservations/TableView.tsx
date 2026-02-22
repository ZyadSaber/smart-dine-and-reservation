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
import isArrayHasData from "@/lib/isArrayHasData";
import AddOrEditReservation from "./AddOrEditReservation";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteReservation } from "@/services/reservation";
import { formatTableDate } from "@/lib/formatTableDate";
import { ReservationData } from "@/types/reservation";
import { useTranslations } from "next-intl";

interface TableViewProps {
    reservations: ReservationData[];
}

const TableView = ({ reservations }: TableViewProps) => {
    const tReservation = useTranslations("Reservation");
    const tCommon = useTranslations("Common");



    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'default';
            case 'Completed': return 'secondary';
            case 'Cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="rounded-xl border p-3 bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-start" >{tReservation("customerName")}</TableHead>
                        <TableHead className="text-start" >{tReservation("customerPhone")}</TableHead>
                        <TableHead className="text-start" >{tReservation("partySize")}</TableHead>
                        <TableHead className="text-start" >{tReservation("date")}</TableHead>
                        <TableHead className="text-start" >{tReservation("timeRange")}</TableHead>
                        <TableHead className="text-start" >{tCommon("status")}</TableHead>
                        <TableHead className="text-start" >{tReservation("source")}</TableHead>
                        <TableHead className="text-end">{tCommon("action")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isArrayHasData(reservations) ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">{tCommon("noData")}</TableCell>
                        </TableRow>
                    ) : (
                        reservations.map((res) => (
                            <TableRow key={res._id}>
                                <TableCell className="font-medium">
                                    {res.customerName}
                                </TableCell>
                                <TableCell>{res.customerPhone}</TableCell>
                                <TableCell>{res.partySize}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{formatTableDate(res.date)}</div>
                                </TableCell>
                                <TableCell className="text-xs">
                                    <div className="flex items-center gap-1">
                                        <Badge variant="secondary" className="font-normal text-[10px]">
                                            {res.startTime} - {res.endTime}
                                        </Badge>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant={getStatusVariant(res.status)}
                                    >
                                        {tReservation(res.status as 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {res.reservedBy}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddOrEditReservation currentReservation={res} />
                                        <DeleteDialog id={res._id || ""} deleteAction={deleteReservation} />
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
