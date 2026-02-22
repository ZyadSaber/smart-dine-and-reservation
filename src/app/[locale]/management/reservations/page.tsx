import { getReservations } from "@/services/reservation";
import { AddOrEditReservation, TableView } from "@/components/reservations";
import { getTranslations } from "next-intl/server";

export default async function ReservationsPage() {
    const reservations = await getReservations();
    const tReservation = await getTranslations("Reservation");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{tReservation("reservations")}</h1>
                    <p className="text-muted-foreground">{tReservation("subtitle")}</p>
                </div>
                <AddOrEditReservation />
            </div>
            <TableView reservations={reservations} />
        </div>
    );
}
