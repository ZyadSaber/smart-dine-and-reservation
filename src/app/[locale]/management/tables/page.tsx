import { getTables } from "@/services/table";
import { AddOrEditTable, TableView } from "@/components/tables"
import { getTranslations } from "next-intl/server";

export default async function TablesPage() {
    const tables = await getTables();
    const t = await getTranslations("POS");
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("tables")}</h1>
                    <p className="text-muted-foreground">Manage restaurant tables, capacity and availability.</p>
                </div>
                <AddOrEditTable />
            </div>
            <TableView tables={tables || []} />
        </div>
    );
}
