"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVisibility } from "@/hooks";

const Reservations = () => {
    const { visible, handleStateChange, handleClose } = useVisibility();
    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500/10 border-blue-500 text-blue-600 hover:bg-blue-500/20 hover:text-blue-800">
                    Reservations
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
            </DialogContent>
        </Dialog >
    )
}

export default Reservations