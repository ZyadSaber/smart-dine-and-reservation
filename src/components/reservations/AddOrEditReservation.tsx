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
import { Plus, Edit, User, Phone, Users, Clock, Calendar } from "lucide-react";
import { reservationSchema, createReservationSchema } from "@/validations/reservation";
import { SelectField } from "@/components/ui/select";
import { toast } from "sonner";
import { createReservationAdmin, updateReservation } from "@/services/reservation";
import { useRouter } from "next/navigation";
import { ReservationData } from "@/types/reservation";
import getCurrentDate from "@/lib/getCurrentDate";
import { useTranslations } from "next-intl";

interface AddOrEditReservationProps {
    currentReservation?: ReservationData;
}

const AddOrEditReservation = ({ currentReservation }: AddOrEditReservationProps) => {
    const { visible, handleStateChange, handleClose } = useVisibility();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const tReservation = useTranslations("Reservation");
    const tCommon = useTranslations("Common");

    const editingReservation = !!currentReservation;

    const { formData, handleChange, handleFieldChange, resetForm, validate, errors } = useFormManager({
        initialData: {
            customerName: "",
            customerPhone: "",
            partySize: 1,
            date: getCurrentDate(),
            startTime: "12:00",
            endTime: "14:00",
            status: "Pending",
            reservedBy: "WalkIn",
            ...currentReservation,
        },
        schema: !!editingReservation ? reservationSchema : createReservationSchema
    })

    const handleSubmit = () => {
        if (!validate()) return
        startTransition(async () => {
            const _fn = editingReservation ? updateReservation : createReservationAdmin;

            const payload = {
                ...formData,
                _id: currentReservation?._id,
                partySize: Number(formData.partySize),
                date: new Date(formData.date),
            };

            const result = await _fn(payload as ReservationData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(tReservation("success"));
                router.refresh();
                handleClose();
                resetForm();
            }
        });
    };

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                {editingReservation ? (
                    <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button className="gap-2 m-2">
                        <Plus className="w-4 h-4" /> {tReservation("add")}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{editingReservation ? tReservation("edit") : tReservation("add")}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{tReservation("customerName")}</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder={tReservation("customerName")}
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    name="customerName"
                                    required
                                    error={errors.customerName}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{tReservation("customerPhone")}</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder={tReservation("customerPhone")}
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    name="customerPhone"
                                    required
                                    error={errors.customerPhone}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{tReservation("date")}</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    type="date"
                                    value={formData.date as string}
                                    onChange={handleChange}
                                    name="date"
                                    required
                                    error={errors.date}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{tReservation("partySize")}</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    type="number"
                                    placeholder={tReservation("partySize")}
                                    value={formData.partySize}
                                    onChange={handleChange}
                                    name="partySize"
                                    min={1}
                                    required
                                    error={errors.partySize}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{tReservation("startTime")}</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    type="time"
                                    value={formData.startTime as string}
                                    onChange={handleChange}
                                    name="startTime"
                                    required
                                    error={errors.startTime}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{tReservation("endTime")}</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    type="time"
                                    value={formData.endTime as string}
                                    onChange={handleChange}
                                    name="endTime"
                                    required
                                    error={errors.endTime}
                                />
                            </div>
                        </div>
                    </div>



                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label={tCommon("status")}
                            name="status"
                            value={formData.status as string}
                            onValueChange={(value) => handleFieldChange({ name: "status", value })}
                            options={[
                                { key: "Pending", label: "Pending" },
                                { key: "Confirmed", label: "Confirmed" },
                                { key: "Cancelled", label: "Cancelled" },
                                { key: "Completed", label: "Completed" },
                            ]}
                            error={errors.status}
                        />
                        <SelectField
                            label={tReservation("source")}
                            name="reservedBy"
                            value={formData.reservedBy as string}
                            disabled={editingReservation}
                            onValueChange={(value) => handleFieldChange({ name: "reservedBy", value })}
                            options={[
                                { key: "WalkIn", label: tReservation("walkIn") },
                                { key: "CallCenter", label: tReservation("callCenter") }
                            ]}
                            error={errors.reservedBy}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full" isLoading={isPending}>
                        {editingReservation ? tReservation("update") : tReservation("add")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddOrEditReservation;
