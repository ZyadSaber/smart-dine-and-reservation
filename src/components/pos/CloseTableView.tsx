"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedValue } from "@/lib/localize";
import { useFormManager, useVisibility } from "@/hooks";
import { useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { TableData } from "@/types/table";
import { closeTable, getRunningOrders } from "@/services/order";
import { cn } from "@/lib/utils";
import { POSFormData } from "@/types/pos";
import { toast } from "sonner";
import isArrayHasData from "@/lib/isArrayHasData";

interface CloseTableProps {
    tables: TableData[];
}

interface CloseTableFormData extends POSFormData {
    step: number;
    tableId: string;
}

const CloseTable = ({ tables }: CloseTableProps) => {
    const locale = useLocale();
    const t = useTranslations("Common");
    const tPos = useTranslations("POS");
    const { visible, handleStateChange, handleClose } = useVisibility();
    const [isPending, startTransition] = useTransition();

    const {
        formData,
        handleChange,
        handleFieldChange,
        handleToggle,
        handleChangeMultiInputs,
        resetForm
    } = useFormManager<CloseTableFormData>({
        initialData: {
            step: 1,
            tableId: "",
            items: [],
            paymentMethod: "",
            totalAmount: 0,
            discount: 0,
            notes: ""
        }
    })

    const {
        step,
        items,
        paymentMethod,
        totalAmount,
        discount,
        notes
    } = formData

    useEffect(() => {
        const itemsTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const finalTotal = Math.max(0, itemsTotal - (discount || 0));
        handleFieldChange({ name: "totalAmount", value: finalTotal });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, discount]);

    const handleTableSelect = (tableId: string) => () => {
        startTransition(async () => {
            const order = await getRunningOrders(tableId);
            if (order) {
                handleChangeMultiInputs({
                    ...order,
                    tableId,
                    step: 2
                })
            }
        });
    }

    const handleCloseTable = () => {
        startTransition(async () => {
            const res = await closeTable(formData);
            if (res.success) {
                handleClose();
                resetForm();
                toast.success("Table closed successfully");
            } else {
                toast.error("Failed to close table");
            }
        });
    }

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    {tPos("closeTable")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="w-full flex justify-between items-center pr-5">
                            Close Table
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {step === 1 && <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <LoadingOverlay loading={isPending}>
                            {isArrayHasData(tables) ?
                                <div className="grid grid-cols-4 gap-3 mt-4">
                                    {tables.map((table) => {
                                        return (
                                            <motion.button
                                                key={table._id}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleTableSelect(table._id || "")}
                                                className={cn(
                                                    "relative h-16 w-full rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300 shadow-sm",
                                                    "border-2",
                                                    "bg-orange-50/50 dark:bg-orange-950/10 text-orange-600 border-orange-100 dark:border-orange-900/20 hover:border-orange-400 hover:bg-orange-100/50 dark:hover:bg-orange-900/20"
                                                )}
                                            >
                                                <span className="relative z-10">{table.number}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                : <div className="w-full text-center text-red-500">No tables found</div>}
                        </LoadingOverlay>
                    </motion.div>}
                    {step === 2 && <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <LoadingOverlay loading={isPending}>
                            <div className="w-full flex flex-wrap gap-5" >
                                <div className="w-full">
                                    {
                                        items.map((item) => (
                                            <div key={item.itemId} className="flex items-center justify-between p-3 rounded-2xl bg-accent/30 border border-white/5 hover:bg-accent/40 transition-colors">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-sm tracking-tight">{getLocalizedValue(item.name, locale)}</h4>
                                                    <span className="text-xs font-black mt-1 block">{item.quantity} x {item.price.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center gap-3 ml-4 bg-background/50 p-1.5 rounded-xl border border-white/10 shadow-sm">
                                                    <span className="w-auto text-center text-sm font-bold">${item.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <Input
                                    label={t("notes")}
                                    name="notes"
                                    value={notes}
                                    onChange={handleChange}
                                    containerClassName="w-full"
                                />
                                <Input
                                    label={tPos("discount")}
                                    name="discount"
                                    type="number"
                                    value={discount}
                                    onChange={handleChange}
                                    containerClassName="w-[47.5%]"
                                />
                                <Input
                                    label={tPos("totalAmount")}
                                    name="totalAmount"
                                    value={totalAmount.toFixed(2)}
                                    disabled
                                    containerClassName="w-[47.5%]"
                                />
                                <SelectField
                                    label={tPos("paymentMethod")}
                                    name="paymentMethod"
                                    value={paymentMethod}
                                    onValueChange={handleToggle("paymentMethod")}
                                    containerClassName="w-[47.5%]"
                                    options={[
                                        { label: tPos("cash"), key: "Cash" },
                                        { label: tPos("card"), key: "Card" },
                                        { label: tPos("instapay"), key: "InstaPay" },
                                        { label: tPos("e-wallet"), key: "E-wallet" },
                                    ]}
                                />
                                <Button disabled={!paymentMethod} className="w-full" variant="destructive" onClick={handleCloseTable}>
                                    {tPos("closeTable")}
                                </Button>
                                <Button className="w-full" variant="secondary" onClick={resetForm}>
                                    {t("back")}
                                </Button>
                            </div>
                        </LoadingOverlay>
                    </motion.div>}
                </AnimatePresence>
            </DialogContent>
        </Dialog >
    )
}

export default CloseTable