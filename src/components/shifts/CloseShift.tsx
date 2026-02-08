"use client"

import { useTransition, useState } from "react";
import { useVisibility } from "@/hooks";
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
import { LogOut, Wallet, Clock } from "lucide-react";
import { SelectField } from "@/components/ui/select";
import { toast } from "sonner";
import { closeShift } from "@/services/shift";
import { useRouter } from "next/navigation";
import { IShiftData } from "@/types/shifts";
import { UserData } from "@/types/users";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface CloseShiftProps {
    openShifts: IShiftData[];
}

const CloseShift = ({ openShifts }: CloseShiftProps) => {
    const t = useTranslations("Shift");
    const tPOS = useTranslations("POS");
    const { visible, handleStateChange, handleClose } = useVisibility();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [selectedShiftId, setSelectedShiftId] = useState<string>("");
    const [actualCash, setActualCash] = useState<number>(0);

    const currentTime = format(new Date(), "PPp");

    const selectedShift = openShifts.find(s => s._id === selectedShiftId);

    const handleSubmit = () => {
        if (!selectedShiftId) {
            toast.error(t("selectShiftError") || "Please select a shift to close");
            return;
        }

        startTransition(async () => {
            try {
                const result = await closeShift(selectedShiftId, actualCash);
                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success(t("closeSuccess") || "Shift closed successfully");
                    router.refresh();
                    handleClose();
                    setSelectedShiftId("");
                    setActualCash(0);
                }
            } catch (error: unknown) {
                toast.error((error as Error).message || "Failed to close shift");
            }
        });
    };

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 m-2">
                    <LogOut className="w-4 h-4" /> {t("closeShift")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t("closeShift")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <SelectField
                        label={t("staffMember")}
                        name="shiftId"
                        value={selectedShiftId}
                        onValueChange={(value) => setSelectedShiftId(value)}
                        options={openShifts.map(s => ({
                            key: s._id!,
                            label: `${(s.staffId as UserData).fullName} - ${format(new Date(s.startTime), "p")}`
                        }))}
                    />

                    {selectedShift && (
                        <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{tPOS("cash")}:</span>
                                <span className="font-medium">{selectedShift.totalCashSales.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{tPOS("visa")}:</span>
                                <span className="font-medium">{selectedShift.totalVisaSales.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 mt-2">
                                <span className="font-semibold">{tPOS("total")}:</span>
                                <span className="font-semibold">{(selectedShift.totalCashSales + selectedShift.totalVisaSales).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("actualCash")}</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                type="number"
                                placeholder="0.00"
                                value={actualCash}
                                onChange={(e) => setActualCash(parseFloat(e.target.value) || 0)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("endTime")}</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9 bg-muted"
                                value={currentTime}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full" isLoading={isPending} disabled={!selectedShiftId}>
                        {t("closeShift")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CloseShift;
