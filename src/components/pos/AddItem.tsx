"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Plus,
    Minus,
} from "lucide-react"
import { useFormManager, useVisibility } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedValue } from "@/lib/localize";
import { getAvalibaleItems } from "@/services/menu";
import { useEffect, useTransition } from "react";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { POSCartItem, ActiveMenuItem } from "@/types/pos"

interface AddItemProps {
    onAdd: (items: ActiveMenuItem[]) => void,
    existingItems: POSCartItem[]
}

const AddItem = ({
    onAdd,
    existingItems
}: AddItemProps) => {
    const t = useTranslations("Common");
    const locale = useLocale();
    const { visible, handleStateChange, handleClose } = useVisibility();
    const [loading, startTransition] = useTransition();
    const {
        formData,
        handleFieldChange,
        resetForm
    } = useFormManager({
        initialData: {
            menuItems: [] as ActiveMenuItem[],
        }
    })

    useEffect(() => {
        if (visible) {
            startTransition(async () => {
                const items = await getAvalibaleItems();
                const mergedItems = items.map(item => {
                    const existing = existingItems?.find(ei => ei.itemId === item._id);
                    return {
                        ...item,
                        quantity: existing ? existing.quantity : 0
                    }
                });
                handleFieldChange({ name: "menuItems", value: mergedItems })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, existingItems])

    const getItemQuantity = (itemId: string) => {
        return formData.menuItems?.find(item => item._id === itemId)?.quantity || 0
    }

    const handleUpdateQuantity = (itemId: string, delta: number) => {
        const updatedItems = formData.menuItems.map(item => {
            if (item._id === itemId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) }
            }
            return item
        })
        handleFieldChange({ name: "menuItems", value: updatedItems })
    }

    const handleAddItem = () => {
        const selectedItems = formData.menuItems.filter(item => item.quantity > 0)
        onAdd(selectedItems)
        handleClose()
        resetForm()
    }

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                <Button variant="secondary">Add Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]" >
                <DialogHeader>
                    <DialogTitle>
                        Add Item
                    </DialogTitle>
                </DialogHeader>

                <LoadingOverlay loading={loading} message="Fetching menu items...">
                    <div className="grid gap-4 py-4 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.menuItems.filter(item => item.isAvailable).map((item) => (
                            <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl bg-accent/30 border border-white/5 hover:bg-accent/40 transition-colors">
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm tracking-tight">{getLocalizedValue(item.name, locale)}</h4>
                                    <span className="text-xs font-black mt-1 block">${item.price.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-3 ml-4 bg-background/50 p-1.5 rounded-xl border border-white/10 shadow-sm">
                                    <button
                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent transition-colors disabled:opacity-30"
                                        onClick={() => handleUpdateQuantity(item._id, -1)}
                                        disabled={getItemQuantity(item._id) === 0}
                                    >
                                        <Minus className="w-3 h-3 text-muted-foreground" />
                                    </button>
                                    <span className="w-4 text-center text-sm font-bold">{getItemQuantity(item._id)}</span>
                                    <button
                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                                        onClick={() => handleUpdateQuantity(item._id, 1)}
                                    >
                                        <Plus className="w-3 h-3 text-primary" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </LoadingOverlay>

                <DialogFooter>
                    <Button onClick={handleAddItem} isLoading={loading}>
                        {t("add")}
                    </Button>
                    <Button onClick={handleClose} isLoading={loading} variant="destructive">{t("cancel")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddItem