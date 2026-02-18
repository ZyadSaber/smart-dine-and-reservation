"use client";

import { useTranslations } from "next-intl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddOrEditMenuItem from "./AddOrEditMenuItem";
import { MenuManagementItem } from "@/types/menu";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteItem } from "@/services/menu";
import isArrayHasData from "@/lib/isArrayHasData";

interface TableViewProps {
    items: MenuManagementItem[];
    categoriesList?: { key: string; label: string }[];
}

const TableView = ({ items, categoriesList }: TableViewProps) => {
    const tInv = useTranslations("Menu");
    const tCommon = useTranslations("Common");

    return (
        <div className="p-3 rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-start">{tInv("itemName")}</TableHead>
                        <TableHead className="text-start">{tInv("category")}</TableHead>
                        <TableHead className="text-right">{tInv("price")}</TableHead>
                        <TableHead className="text-center">{tCommon("status")}</TableHead>
                        <TableHead className="text-end">{tCommon("action")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isArrayHasData(items) ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No items found. Add your first menu item!
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">
                                    {`${item.name.en} / ${item.name.ar}`}
                                </TableCell>
                                <TableCell>
                                    {`${item.category.name.en} / ${item.category.name.ar}`}
                                </TableCell>
                                <TableCell className="text-right font-black text-primary">EGP {item.price}</TableCell>
                                <TableCell className="text-center">
                                    {item.isAvailable ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
                                    ) : (
                                        <Badge variant="outline">Hidden</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddOrEditMenuItem currentItem={item} categoriesList={categoriesList || []} />
                                        <DeleteDialog id={item?._id || ""} deleteAction={deleteItem} />
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