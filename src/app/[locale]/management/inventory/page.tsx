import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import connectDB from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MenuManagementItem {
    _id: string;
    name: {
        en: string;
        ar: string;
    };
    category: string;
    costPrice: number;
    salePrice: number;
    isAvailable: boolean;
}

export default async function InventoryPage() {
    const t = await getTranslations("Common");
    const tInv = await getTranslations("Inventory");

    await connectDB();
    const items = (await MenuItem.find().lean()) as unknown as MenuManagementItem[];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{tInv("menuItems")}</h2>
                    <p className="text-muted-foreground">Manage your boutique menu and presentation.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    {t("add")}
                </Button>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{tInv("itemName")}</TableHead>
                            <TableHead>{tInv("category")}</TableHead>
                            <TableHead className="text-right">{tInv("costPrice")}</TableHead>
                            <TableHead className="text-right">{tInv("salePrice")}</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No items found. Add your first menu item!
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item: MenuManagementItem) => (
                                <TableRow key={item._id.toString()}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{item.name.en}</span>
                                            <span className="text-xs text-muted-foreground">{item.name.ar}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="rounded-full">{item.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">EGP {item.costPrice}</TableCell>
                                    <TableCell className="text-right font-black text-primary">EGP {item.salePrice}</TableCell>
                                    <TableCell className="text-center">
                                        {item.isAvailable ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
                                        ) : (
                                            <Badge variant="outline">Hidden</Badge>
                                        )}
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
