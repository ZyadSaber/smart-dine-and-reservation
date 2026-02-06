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

interface TableViewProps {
    tables: TableData[];
}

const TableView = ({ tables }: TableViewProps) => {
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
                        <TableHead>Table Number</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
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
