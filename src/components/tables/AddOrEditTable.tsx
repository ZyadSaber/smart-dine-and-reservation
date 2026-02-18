"use client"

import { useTransition } from "react";
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
import { Plus, Edit, Hash, Users } from "lucide-react";
import { tableSchema } from "@/validations/table";
import { SelectField } from "@/components/ui/select";
import { toast } from "sonner";
import { createTable, updateTable } from "@/services/table";
import { useRouter } from "next/navigation";
import { TableData } from "@/types/table";
import { useTranslations } from "next-intl";

interface AddOrEditTableProps {
    currentTable?: TableData;
}

const AddOrEditTable = ({ currentTable }: AddOrEditTableProps) => {
    const t = useTranslations("POS");
    const tCommon = useTranslations("Common");

    const { visible, handleStateChange, handleClose } = useVisibility();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const editingTable = !!currentTable;

    const { formData, handleChange, handleFieldChange, resetForm, errors } = useFormManager({
        initialData: {
            number: "",
            capacity: 2,
            status: "Available",
            ...currentTable
        },
        schema: tableSchema
    })

    const handleSubmit = () => {
        startTransition(async () => {
            const _fn = editingTable ? updateTable : createTable;
            const result = await _fn(formData as TableData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(editingTable ? "Table updated successfully" : "Table created successfully");
                router.refresh();
                handleClose();
                resetForm();
            }
        });
    };

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                {editingTable ? (
                    <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button className="gap-2 m-2">
                        <Plus className="w-4 h-4" /> {t("addTable")}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{editingTable ? t("editTable") : t("addTable")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("tableNumber")}</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="(e.g. T1)"
                                value={formData.number}
                                onChange={handleChange}
                                name="number"
                                required
                                error={errors.number}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("capacity")}</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                type="number"
                                placeholder="Enter capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                error={errors.capacity}
                            />
                        </div>
                    </div>

                    <SelectField
                        label={tCommon("status")}
                        name="status"
                        value={formData.status as string}
                        onValueChange={(value) => handleFieldChange({ name: "status", value })}
                        options={[
                            { key: "Available", label: "Available" },
                            { key: "Occupied", label: "Occupied" },
                            { key: "Reserved", label: "Reserved" },
                        ]}
                        error={errors.status}
                        disabled
                    />
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full" isLoading={isPending}>
                        {editingTable ? t("editTable") : t("addTable")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddOrEditTable;
