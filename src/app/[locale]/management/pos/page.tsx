import { TableGrid } from "@/components/pos/TableGrid";
import { getTranslations } from "next-intl/server";
import connectDB from "@/lib/mongodb";
import Table from "@/models/Table";

export default async function POSPage() {
    const t = await getTranslations("POS");
    await connectDB();

    // Fetch tables from DB (Mock data if none exist yet)
    let tables = await Table.find().lean();

    if (tables.length === 0) {
        // Seed some tables for demonstration if DB is empty
        tables = [
            { _id: "1", number: "T1", capacity: 2, status: "Available" },
            { _id: "2", number: "T2", capacity: 4, status: "Occupied" },
            { _id: "3", number: "T3", capacity: 2, status: "Available" },
            { _id: "4", number: "T4", capacity: 6, status: "Reserved" },
            { _id: "5", number: "T5", capacity: 4, status: "Available" },
            { _id: "6", number: "T6", capacity: 2, status: "Occupied" },
        ] as any;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">{t("tables")}</h2>
            </div>

            <TableGrid tables={JSON.parse(JSON.stringify(tables))} />
        </div>
    );
}
