"use client"

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVisibility } from "@/hooks";
import { useTranslations } from "next-intl";
import { ReservationData } from "@/types/reservation";
import { TableData } from "@/types/table";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { formatTableDate } from "@/lib/formatTableDate";
import { Badge } from "@/components/ui/badge";
import isArrayHasData from "@/lib/isArrayHasData";
import { ArrowLeft, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateTable } from "@/services/table";
import { toast } from "sonner";
import { useTransition } from "react";

interface ReservationsProps {
    confirmedReservations: ReservationData[];
    tables: TableData[];
}

const Reservations = ({
    confirmedReservations,
    tables
}: ReservationsProps) => {
    const { visible, handleStateChange, handleClose } = useVisibility();
    const tCommon = useTranslations("Common");
    const tReservation = useTranslations("Reservation");
    const tPos = useTranslations("POS");

    const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSelectTable = (table: TableData) => {
        if (table.status !== 'Available') return;

        startTransition(async () => {
            if (!selectedReservation) return;

            const currentTable = table;
            const res = await updateTable({
                ...currentTable,
                status: "Reserved",
                reservationId: selectedReservation._id
            });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(tReservation("tableReservedSuccess").replace("{tableNumber}", table.number.toString()));
                setTimeout(() => setSelectedReservation(null), 300);
                handleClose();
            }
        });
    }

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500/10 border-blue-500 text-blue-600 hover:bg-blue-500/20 hover:text-blue-800">
                    {tReservation("reservations")}
                </Button>
            </DialogTrigger>
            <DialogContent className={selectedReservation ? "sm:max-w-175" : "sm:max-w-225"}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {selectedReservation && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground mr-1" onClick={() => setSelectedReservation(null)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        {!selectedReservation ? tReservation("currentConfirmed") : `${tReservation("chooseTableFor")} ${selectedReservation.customerName}`}
                    </DialogTitle>
                </DialogHeader>

                {!selectedReservation ? (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden mt-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-start">{tReservation("customerName")}</TableHead>
                                    <TableHead className="text-start">{tReservation("customerPhone")}</TableHead>
                                    <TableHead className="text-start">{tReservation("partySize")}</TableHead>
                                    <TableHead className="text-start">{tReservation("date")}</TableHead>
                                    <TableHead className="text-start whitespace-nowrap">{tReservation("timeRange")}</TableHead>
                                    <TableHead className="text-end">{tCommon("action")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!isArrayHasData(confirmedReservations) ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">{tCommon("noData")}</TableCell>
                                    </TableRow>
                                ) : (
                                    confirmedReservations.map((res) => (
                                        <TableRow key={res._id}>
                                            <TableCell className="font-medium">{res.customerName}</TableCell>
                                            <TableCell>{res.customerPhone}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-3 h-3 text-muted-foreground" />
                                                    {res.partySize}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium whitespace-nowrap">{formatTableDate(res.date)}</div>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <Badge variant="secondary" className="font-normal text-[10px] whitespace-nowrap">
                                                    {res.startTime} - {res.endTime}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => setSelectedReservation(res)}>
                                                    {tReservation("select")}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {tables.map(table => (
                            <button
                                key={table._id}
                                disabled={table.status !== 'Available' || isPending}
                                onClick={() => handleSelectTable(table)}
                                className={cn(
                                    "relative p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center min-h-25 gap-2 overflow-hidden",
                                    table.status === 'Available' ? "border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 cursor-pointer" : "border-muted bg-muted/20 opacity-60 cursor-not-allowed"
                                )}
                            >
                                <div className="text-2xl font-black text-foreground/80">
                                    {table.number}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                    <Users className="w-3 h-3" />
                                    <span>{table.capacity}</span>
                                </div>
                                <div className={cn(
                                    "absolute bottom-0 start-0 end-0 h-1",
                                    table.status === 'Available' && "bg-emerald-500",
                                    table.status === 'Occupied' && "bg-orange-500",
                                    table.status === 'Reserved' && "bg-blue-500"
                                )} />
                                {table.status !== 'Available' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                                        <span className="text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md">
                                            {tPos(table.status.toLowerCase())}
                                        </span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog >
    )
}

export default Reservations