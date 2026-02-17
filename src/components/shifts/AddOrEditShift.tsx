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
import { Plus, Edit, Wallet } from "lucide-react";
import { shiftSchema } from "@/validations/shift";
import { SelectField } from "@/components/ui/select";
import { toast } from "sonner";
import { updateShift, openShift } from "@/services/shift";
import { useRouter } from "next/navigation";
import { IShiftData } from "@/types/shifts";
import { UserData } from "@/types/users";
import { useTranslations } from "next-intl";

interface AddOrEditShiftProps {
    currentShift?: IShiftData;
    users: UserData[];
}

const AddOrEditShift = ({ currentShift, users }: AddOrEditShiftProps) => {
    const t = useTranslations("Shift");
    const tCommon = useTranslations("Common");
    const { visible, handleStateChange, handleClose } = useVisibility();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const editingShift = !!currentShift;

    const { formData, handleFieldChange, resetForm, validate } = useFormManager({
        initialData: {
            openingBalance: 0,
            totalCashSales: 0,
            totalVisaSales: 0,
            totalCardSales: 0,
            totalDigitalSales: 0,
            status: "Open" as "Open" | "Closed",
            startTime: currentShift?.startTime || new Date(),
            ...currentShift,
            staffId: currentShift?.staffId
                ? (typeof currentShift.staffId === 'string' ? currentShift.staffId : (currentShift.staffId as UserData)._id!)
                : "",
        },
        schema: shiftSchema
    })

    const handleSubmit = () => {
        if (!validate()) return
        startTransition(async () => {
            let result;
            if (editingShift) {
                // Ensure we don't send strings as Dates
                const cleanData = {
                    ...formData,
                    _id: currentShift._id,
                    startTime: formData.startTime ? new Date(formData.startTime) : currentShift.startTime,
                    endTime: formData.endTime ? new Date(formData.endTime) : currentShift.endTime,
                } as unknown as IShiftData;

                result = await updateShift(currentShift._id!, cleanData);
            } else {
                // For opening a shift, we use the openShift service
                try {
                    await openShift(formData.staffId as string, formData.openingBalance);
                    result = { success: true };
                } catch (error: unknown) {
                    result = { error: (error as Error).message || t("openError") };
                }
            }

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(editingShift ? t("updateSuccess") : t("openSuccess"));
                router.refresh();
                handleClose();
                resetForm();
            }
        });
    };

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                {editingShift ? (
                    <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button className="gap-2 m-2">
                        <Plus className="w-4 h-4" /> {t("openShift")}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingShift ? t("editShift") : t("openNewShift")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <SelectField
                        label={t("staffMember")}
                        name="staffId"
                        value={formData.staffId as string}
                        onValueChange={(value) => handleFieldChange({ name: "staffId", value })}
                        options={users.map(u => ({ key: u._id!, label: u.fullName }))}
                        disabled={editingShift} // Usually we don't change the staff after start
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("openingBalance")}</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                type="number"
                                placeholder="0.00"
                                value={formData.openingBalance}
                                onChange={(e) => handleFieldChange({ name: "openingBalance", value: parseFloat(e.target.value) || 0 })}
                                name="openingBalance"
                                required
                            />
                        </div>
                    </div>

                    {editingShift && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("actualCashAtClose")}</label>
                                <div className="relative">
                                    <Wallet className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.actualCashAtClose || ""}
                                        onChange={(e) => handleFieldChange({ name: "actualCashAtClose", value: parseFloat(e.target.value) || 0 })}
                                        name="actualCashAtClose"
                                    />
                                </div>
                            </div>

                            <SelectField
                                disabled
                                label={t("status")}
                                name="status"
                                value={formData.status}
                                onValueChange={(value) => handleFieldChange({ name: "status", value })}
                                options={[
                                    { key: "Open", label: "Open" },
                                    { key: "Closed", label: "Closed" },
                                ]}
                            />
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full" isLoading={isPending}>
                        {editingShift ? tCommon("edit") : t("openShift")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddOrEditShift;
