"use client"

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useFormManager, useVisibility } from "@/hooks";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit } from "lucide-react";
import { SelectField } from "@/components/ui/select";
import { toast } from "sonner";
import { createItem, updateItem } from "@/services/menu";
import { LabeledCheckBox } from "@/components/ui/checkbox";
import { menuSchema } from "@/validations/menu";
import { MenuManagementItem } from "@/types/menu";

interface AddOrEditMenuItemProps {
    currentItem?: MenuManagementItem;
    categoriesList?: { key: string; label: string }[];
}

const AddOrEditMenuItem = ({ currentItem, categoriesList }: AddOrEditMenuItemProps) => {
    const { visible, handleStateChange, handleClose } = useVisibility();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const tMenu = useTranslations("Menu");

    const editingItem = !!currentItem;

    const { formData, handleChange, resetForm, handleToggle } = useFormManager({
        initialData: {
            name: {
                en: "",
                ar: ""
            },
            description: {
                en: "",
                ar: ""
            },
            price: 0,
            isAvailable: true,
            ...currentItem,
            category: currentItem?.category?._id || "",
        },
        schema: menuSchema
    })

    const handleSubmit = () => {
        startTransition(async () => {
            const _fn = editingItem ? updateItem : createItem;
            const result = await _fn(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(editingItem ? "Item updated successfully" : "Item created successfully");
                router.refresh();
                handleClose();
                resetForm();
            }
        });
    };

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                {editingItem ? (
                    <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="w-4 h-4" /> {tMenu("addItem")}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit User" : "Add New User"}</DialogTitle>
                </DialogHeader>
                <div className="flex w-full gap-2 flex-wrap">
                    <Input
                        containerClassName="w-[48%]"
                        placeholder="Enter full name"
                        value={formData.name.en}
                        onChange={handleChange}
                        name="name.en"
                        required
                        label={tMenu("nameEn")}
                    />
                    <Input
                        containerClassName="w-[48%]"
                        placeholder="Enter full name"
                        value={formData.name.ar}
                        onChange={handleChange}
                        name="name.ar"
                        required
                        label={tMenu("nameAr")}
                    />
                    <Input
                        containerClassName="w-[48%]"
                        placeholder="Enter description"
                        value={formData.description.en}
                        onChange={handleChange}
                        name="description.en"
                        required
                        label={tMenu("descriptionEn")}
                    />
                    <Input
                        containerClassName="w-[48%]"
                        placeholder="Enter description"
                        value={formData.description.ar}
                        onChange={handleChange}
                        name="description.ar"
                        required
                        label={tMenu("descriptionAr")}
                    />
                    <Input
                        containerClassName="w-[33%]"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={handleChange}
                        name="price"
                        required
                        label={tMenu("price")}
                        type="number"
                        min={0}
                    />
                    <SelectField
                        containerClassName="w-[33%]"
                        label={tMenu("category")}
                        value={formData.category as string}
                        onValueChange={handleToggle("category")}
                        name="category"
                        options={categoriesList || []}
                    />
                    <LabeledCheckBox
                        checked={formData.isAvailable}
                        onCheckedChange={handleToggle("isAvailable")}
                        name="isAvailable"
                        label={tMenu("isAvailable")}
                    />
                </div>


                <DialogFooter className="pt-4">
                    <Button onClick={handleSubmit} className="w-full" isLoading={isPending}>
                        {editingItem ? "Update User" : "Create User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddOrEditMenuItem;