"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { useFormManager, useVisibility } from "@/hooks";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TableData } from "@/types/table"
import { Button } from "@/components/ui/button";
import { useEffect, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedValue } from "@/lib/localize";
import AddItem from "./AddItem";
import { POSFormData, ActiveMenuItem } from "@/types/pos";
import { getRunningOrders } from "@/services/order";
import { Input } from "@/components/ui/input";
import isArrayHasData from "@/lib/isArrayHasData";
import { createOrUpdateTableOrder } from "@/services/order";
import { toast } from "sonner";

interface TableOrderProps {
    table: TableData;
    children: React.ReactNode;
}

const TableOrder = ({ table, children }: TableOrderProps) => {
    const locale = useLocale();
    const t = useTranslations("Common");
    const tPos = useTranslations("POS");
    const { visible, handleStateChange, handleClose } = useVisibility();
    const [isPending, startTransition] = useTransition();

    const {
        formData,
        handleChange,
        handleFieldChange,
        resetForm,
        // handleToggle,
        handleChangeMultiInputs
    } = useFormManager<POSFormData>({
        initialData: {
            tableId: table._id,
            items: [],
            paymentMethod: "",
            totalAmount: 0,
            notes: ""
        }
    })

    useEffect(() => {
        if (visible) {
            startTransition(async () => {
                const order = await getRunningOrders(table._id || "");
                if (order) {
                    handleChangeMultiInputs(order)
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table._id, visible]);

    const handleAddItemsToCart = (selectedItems: ActiveMenuItem[]) => {
        const updatedItems = selectedItems.map(item => ({
            itemId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity
        }));

        const newTotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

        handleFieldChange({ name: "items", value: updatedItems });
        handleFieldChange({ name: "totalAmount", value: newTotal });
    }

    const handleSubmit = () => {
        startTransition(async () => {
            const res = await createOrUpdateTableOrder(formData);
            handleClose();
            resetForm();
            if (res.success === true) {
                toast.success("Order created successfully")
            } else {
                toast.error(res.error)
            }
        });
    }

    const hasItmes = isArrayHasData(formData.items)

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                <Card
                    className={cn(
                        "relative overflow-hidden cursor-pointer transition-all hover:scale-105 active:scale-95 border-none shadow-md",
                        table.status === 'Available' && "bg-emerald-50 dark:bg-emerald-950/20",
                        table.status === 'Occupied' && "bg-orange-50 dark:bg-orange-950/20",
                        table.status === 'Reserved' && "bg-blue-50 dark:bg-blue-950/20"
                    )}
                >
                    {children}
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="w-full flex justify-between items-center pr-5">
                            <span>Order for {table.number}</span>
                            <AddItem
                                onAdd={handleAddItemsToCart}
                                existingItems={formData.items}
                            />
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex gap-4 flex-wrap py-4">
                    <div className="w-full">
                        {hasItmes ? formData.items.map((item) => (
                            <div key={item.itemId} className="flex items-center justify-between p-3 rounded-2xl bg-accent/30 border border-white/5 hover:bg-accent/40 transition-colors">
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm tracking-tight">{getLocalizedValue(item.name, locale)}</h4>
                                    <span className="text-xs font-black mt-1 block">{item.quantity} x {item.price.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-3 ml-4 bg-background/50 p-1.5 rounded-xl border border-white/10 shadow-sm">
                                    <span className="w-auto text-center text-sm font-bold">${item.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        )) : <p>No items added</p>}
                    </div>
                    <Input
                        label={t("notes")}
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        disabled={!hasItmes}
                        containerClassName="w-full"
                    />
                    <Input
                        label={tPos("totalAmount")}
                        name="totalAmount"
                        value={formData.totalAmount.toFixed(2)}
                        disabled
                        containerClassName="w-[48%]"
                    />
                    {/* <SelectField
                        label={tPos("paymentMethod")}
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onValueChange={handleToggle("paymentMethod")}
                        disabled={!hasItmes}
                        containerClassName="w-[48%]"
                        options={[
                            { label: tPos("cash"), key: "Cash" },
                            { label: tPos("card"), key: "Card" },
                            { label: tPos("instapay"), key: "InstaPay" },
                            { label: tPos("e-wallet"), key: "E-wallet" },
                        ]}
                    /> */}
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} isLoading={isPending}>
                        {t("save")}
                    </Button>
                    <Button onClick={handleClose} isLoading={isPending} variant="destructive">{t("cancel")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TableOrder