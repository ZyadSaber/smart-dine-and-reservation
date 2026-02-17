import { getReservations } from "@/services/reservation";
import { AddOrEditReservation, TableView } from "@/components/reservations";

export default async function ReservationsPage() {
    const reservations = await getReservations();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reservation Management</h1>
                    <p className="text-muted-foreground">Manage bookings.</p>
                </div>
                <AddOrEditReservation />
            </div>
            <TableView reservations={reservations} />
        </div>
    );
}
