import { getTranslations } from "next-intl/server";
import { TableView, AddOrEditMenuItem, CategoryDialog } from "@/components/menu";
import { getItems, getCategories } from "@/services/menu"

export default async function InventoryPage() {
    const tInv = await getTranslations("Menu");
    const items = await getItems();
    const { categories, categoriesList } = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{tInv("menuItems")}</h2>
                    <p className="text-muted-foreground">Manage your boutique menu and presentation.</p>
                </div>
                <div className="flex gap-2">
                    <AddOrEditMenuItem categoriesList={categoriesList || []} />
                    <CategoryDialog categories={categories || []} />
                </div>
            </div>

            <TableView items={items || []} categoriesList={categoriesList || []} />
        </div>
    );
}
