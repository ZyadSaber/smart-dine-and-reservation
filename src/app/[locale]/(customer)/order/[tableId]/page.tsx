import { getTable } from "@/services/table";
import { getAvalibaleItems } from "@/services/menu";
import { getRunningOrders } from "@/services/order";
import CustomerOrder from "@/components/customer/CustomerOrder";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string; tableId: string }>
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "CustomerOrder" });

    return {
        title: `${t("yourOrder")} | SmartDine`,
        description: t("browseMenu")
    };
}

export default async function TableOrderPage({
    params
}: {
    params: Promise<{ tableId: string; locale: string }>
}) {
    const { tableId } = await params;
    const [table, menuItems, initialOrder] = await Promise.all([
        getTable(tableId),
        getAvalibaleItems(),
        getRunningOrders(tableId)
    ]);

    if (!table) return notFound();

    return (
        <div className="container mx-auto px-4 pt-32 pb-20 overflow-hidden">
            <CustomerOrder
                table={table}
                menuItems={menuItems}
                initialOrder={initialOrder}
            />
        </div>
    );
}
