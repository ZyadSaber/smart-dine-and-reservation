import { getTranslations } from "next-intl/server";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, User, Users } from "lucide-react";

interface ReservationItem {
    _id: any;
    customerName: string;
    customerPhone: string;
    partySize: number;
    startTime: Date;
    status: string;
    tableId?: {
        number: string;
    };
}

export default async function AdminReservationsPage() {
    const t = await getTranslations("Common");

    await connectDB();
    const reservations = (await Reservation.find().sort({ startTime: -1 }).populate('tableId').lean()) as unknown as ReservationItem[];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t("reservations")}</h2>
                <p className="text-muted-foreground">Monitor and manage customer bookings.</p>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead className="text-center">Guests</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Table</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No reservations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reservations.map((res: ReservationItem) => (
                                <TableRow key={res._id.toString()}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            {res.customerName}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            {res.customerPhone}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Users className="w-4 h-4 text-muted-foreground" />
                                            {res.partySize}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{new Date(res.startTime).toLocaleDateString()}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(res.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {res.tableId ? (
                                            <Badge variant="outline">Table {res.tableId.number}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={res.status === 'Confirmed' ? 'default' : 'secondary'}
                                            className={res.status === 'Confirmed' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                                        >
                                            {res.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
