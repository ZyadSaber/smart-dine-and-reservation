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
import { TableData } from "@/types/table";
import isArrayHasData from "@/lib/isArrayHasData";
import AddOrEditTable from "./AddOrEditTable";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteTable } from "@/services/table";
import { useTranslations } from "next-intl";

interface TableViewProps {
    tables: TableData[];
}

const TableView = ({ tables }: TableViewProps) => {
    const t = useTranslations("POS");
    const tCommon = useTranslations("Common");

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Available":
                return "default"; // Green/Primary usually
            case "Occupied":
                return "destructive";
            case "Reserved":
                return "secondary";
            default:
                return "outline";
        }
    };

    return (
        <div className="rounded-xl border p-3 bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-start">{t("tableNumber")}</TableHead>
                        <TableHead className="text-start">{t("capacity")}</TableHead>
                        <TableHead className="text-start">{tCommon("status")}</TableHead>
                        <TableHead className="text-start w-[100px]">{tCommon("action")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isArrayHasData(tables) ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No tables found.</TableCell>
                        </TableRow>
                    ) : (
                        tables.map((table) => (
                            <TableRow key={table._id}>
                                <TableCell className="font-medium">
                                    {table.number}
                                </TableCell>
                                <TableCell>{table.capacity} Persons</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(table.status)} className="capitalize">
                                        {table.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-start">
                                    <div className="flex justify-start gap-2">
                                        <AddOrEditTable currentTable={table} />
                                        <DeleteDialog id={table?._id || ""} deleteAction={deleteTable} />
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
