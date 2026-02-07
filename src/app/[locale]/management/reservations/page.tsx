import { getReservations } from "@/services/reservation";
import { getTables } from "@/services/table";
import { AddOrEditReservation, TableView } from "@/components/reservations";

export default async function ReservationsPage() {
    const reservations = await getReservations();
    const tables = await getTables();

    console.log(tables)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reservation Management</h1>
                    <p className="text-muted-foreground">Manage bookings and table assignments.</p>
                </div>
                <AddOrEditReservation tables={tables} />
            </div>
            <TableView reservations={reservations} tables={tables} />
        </div>
    );
}
