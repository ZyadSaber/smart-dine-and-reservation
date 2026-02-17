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
import { format } from "date-fns";
import { ReservationData } from "@/types/reservation";
interface TableViewProps {
    reservations: ReservationData[];
}

const TableView = ({ reservations }: TableViewProps) => {

    const formatDate = (date: Date | string) => {
        if (!date) return "N/A";
        return format(new Date(date), "MMM dd, yyyy");
    };

    return (
        <div className="rounded-xl border p-3 bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Time Range</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isArrayHasData(reservations) ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">No reservations found.</TableCell>
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
                                    <div className="font-medium">{formatDate(res.date)}</div>
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
                                        variant={res.status === 'Confirmed' ? 'default' : res.status === 'Completed' ? 'secondary' : res.status === 'Cancelled' ? 'destructive' : 'outline'}
                                    >
                                        {res.status}
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
