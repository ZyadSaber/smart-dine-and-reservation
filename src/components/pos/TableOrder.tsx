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
import { createOrUpdateTableOrder, getRunningOrders } from "@/services/order";
import { toast } from "sonner";
import { getLocalizedValue } from "@/lib/localize";
import AddItem from "./AddItem";
import { POSFormData, ActiveMenuItem, POSCartItem } from "@/types/pos";
import { Input } from "@/components/ui/input";
import isArrayHasData from "@/lib/isArrayHasData";

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
        handleChangeMultiInputs
    } = useFormManager<POSFormData>({
        initialData: {
            tableId: table._id,
            items: [],
            paymentMethod: "",
            totalAmount: 0,
            discount: 0,
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

    useEffect(() => {
        const itemsTotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const finalTotal = Math.max(0, itemsTotal - (formData.discount || 0));
        handleFieldChange({ name: "totalAmount", value: finalTotal });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.items, formData.discount]);

    const handleAddItemsToCart = (selectedItems: ActiveMenuItem[]) => {
        const updatedItems = selectedItems.map(item => ({
            itemId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity
        }));

        handleFieldChange({ name: "items", value: updatedItems });
    }

    const handleSubmit = () => {
        startTransition(async () => {
            const res = await createOrUpdateTableOrder(formData);
            handleClose();
            resetForm();
            if (res.success === true) {
                toast.success("Order created successfully")
            } else {
                toast.error(res.error || "Failed to save order")
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
                    <div className="w-full max-h-[300px] overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
                        {hasItmes ? (
                            formData.items.map((item: POSCartItem) => (
                                <div
                                    key={item.itemId}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-accent/30 border border-white/5 hover:bg-accent/40 transition-all duration-200"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm tracking-tight">
                                            {getLocalizedValue(item.name, locale)}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                                {item.quantity}x
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium">
                                                {(item.price || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4 bg-background/50 px-3 py-1.5 rounded-xl border border-white/10 shadow-sm">
                                        <span className="text-sm font-black text-primary">
                                            ${(item.totalPrice || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 opacity-40">
                                <p className="text-sm font-bold italic">No items added yet</p>
                            </div>
                        )}
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
                        containerClassName="w-full"
                    />
                </div>

                <DialogFooter className="gap-2">
                    <Button onClick={handleSubmit} isLoading={isPending}>
                        {t("save")}
                    </Button>
                    <Button onClick={handleClose} isLoading={isPending} variant="outline">{t("cancel")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TableOrder