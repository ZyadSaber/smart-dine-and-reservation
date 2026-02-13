"use client"

import { useEffect, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import {
    User,
    Phone,
    Users,
    Calendar as CalendarIcon,
    CheckCircle2,
    UtensilsCrossed,
    ArrowRight,
    Loader2,
    Plus,
    Minus,
    Clock,
} from "lucide-react"
import { createReservation } from "@/services/reservation"
import { getItems } from "@/services/menu"
import { QRCodeSVG } from "qrcode.react"
import { Link } from "@/i18n/routing"
import { useFormManager } from "@/hooks"
import { reservationSchema } from "@/validations/reservation"
import { MenuManagementItem } from "@/types/menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import getCurrentDate from "@/lib/getCurrentDate"
import isObjectHasData from "@/lib/isObjectHasData"

export default function ReservePage() {
    const t = useTranslations("Reservation")
    const [loading, startTransition] = useTransition();

    const [menuItems, setMenuItems] = useState<MenuManagementItem[]>([])

    const {
        formData,
        handleChange,
        handleFieldChange,
        errors,
        validate,
        handleChangeMultiInputs
    } = useFormManager({
        initialData: {
            customerName: "",
            customerPhone: "",
            partySize: 2,
            date: getCurrentDate(),
            startTime: "19:00",
            endTime: "21:00",
            status: "Pending" as const,
            reservedBy: "Website" as const,
            menuItems: [] as { itemId: string; quantity: number }[],
            step: 1,
            successData: null,
        },
        schema: reservationSchema
    })

    useEffect(() => {
        startTransition(async () => {
            try {
                const itemsRes = await getItems()
                if (itemsRes) setMenuItems(itemsRes)
            } catch (error) {
                console.error("Failed to fetch data", error)
            }
        })
    }, [])

    const handleMenuItemChange = (itemId: string, delta: number) => {
        const currentItems = [...(formData.menuItems || [])]
        const existingIndex = currentItems.findIndex(item => item.itemId === itemId)

        if (existingIndex > -1) {
            const newQuantity = currentItems[existingIndex].quantity + delta
            if (newQuantity > 0) {
                currentItems[existingIndex].quantity = newQuantity
            } else {
                currentItems.splice(existingIndex, 1)
            }
        } else if (delta > 0) {
            currentItems.push({ itemId, quantity: 1 })
        }

        handleFieldChange({ name: "menuItems", value: currentItems })
    }

    const getItemQuantity = (itemId: string) => {
        return formData.menuItems?.find(item => item.itemId === itemId)?.quantity || 0
    }

    const handleSubmit = () => {
        if (!validate()) {
            // If validation fails on the first step, go back to step 1
            if (isObjectHasData(errors)) {
                handleFieldChange({ name: "step", value: 1 })
            }
            return
        }

        startTransition(async () => {
            try {
                const reservationDate = new Date(formData.date)
                const result = await createReservation({
                    customerName: formData.customerName,
                    customerPhone: formData.customerPhone,
                    partySize: Number(formData.partySize),
                    date: reservationDate,
                    startTime: formData.startTime,
                    menuItems: formData.menuItems
                })
                handleChangeMultiInputs({
                    successData: result,
                    step: 3
                })
                toast.success("Reservation created successfully")
            } catch (error: unknown) {
                toast.error("Something went wrong")
                console.error(error)
            }
        })
    }

    return (
        <div className="bg-accent/20 pt-28 pb-12 md:pt-40 md:pb-32 px-4 min-h-screen">
            <div className="max-w-xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black tracking-tight">{t("title")}</h1>
                    <p className="text-muted-foreground mt-2">Book your table in seconds.</p>
                </div>

                <AnimatePresence mode="wait">
                    {formData.step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden glassmorphism">
                                <div className="bg-primary h-2" />
                                <CardHeader>
                                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                                    <CardDescription>Enter your details and schedule your visit.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-1">
                                                <User className="w-4 h-4" /> {t("customerName")}
                                            </label>
                                            <Input
                                                name="customerName"
                                                placeholder="John Doe"
                                                value={formData.customerName}
                                                onChange={handleChange}
                                                className="rounded-xl h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all"
                                                error={errors.customerName}
                                                containerClassName="px-0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-1">
                                                <Phone className="w-4 h-4" /> {t("customerPhone")}
                                            </label>
                                            <Input
                                                name="customerPhone"
                                                placeholder="+20 123 456 789"
                                                value={formData.customerPhone}
                                                onChange={handleChange}
                                                className="rounded-xl h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all"
                                                error={errors.customerPhone}
                                                containerClassName="px-0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-1">
                                                <Users className="w-4 h-4" /> {t("partySize")}
                                            </label>
                                            <Input
                                                name="partySize"
                                                type="number"
                                                min={1}
                                                value={formData.partySize}
                                                onChange={handleChange}
                                                className="rounded-xl h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all"
                                                error={errors.partySize}
                                                containerClassName="px-0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-1">
                                                <CalendarIcon className="w-4 h-4" /> {t("date")}
                                            </label>
                                            <Input
                                                name="date"
                                                type="date"
                                                value={formData.date as string}
                                                onChange={handleChange}
                                                className="rounded-xl h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all"
                                                error={errors.date}
                                                containerClassName="px-0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-1">
                                                <Clock className="w-4 h-4" /> {t("time")}
                                            </label>
                                            <Input
                                                name="startTime"
                                                type="time"
                                                value={formData.startTime}
                                                onChange={handleChange}
                                                className="rounded-xl h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all"
                                                error={errors.startTime}
                                                containerClassName="px-0"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 rounded-2xl text-lg mt-4 group bg-linear-to-r from-primary to-primary/80 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                                        onClick={() => handleFieldChange({ name: "step", value: 2 })}
                                        disabled={!formData.customerName || !formData.customerPhone}
                                    >
                                        Choose Table & Menu
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {formData.step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden glassmorphism">
                                <div className="bg-primary h-2" />
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl">Refine Your Visit</CardTitle>
                                            <CardDescription>Pick a specific table or pre-order from our menu.</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="px-3 py-1 bg-primary/5 border-primary/20 text-primary">
                                            Optional
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                                            <UtensilsCrossed className="w-4 h-4" /> Pre-order Menu
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                            {menuItems.filter(item => item.isAvailable).length > 0 ? (
                                                menuItems.filter(item => item.isAvailable).map((item) => (
                                                    <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl bg-accent/30 border border-white/5 hover:bg-accent/40 transition-colors">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-sm tracking-tight">{item.name.en}</h4>
                                                            <p className="text-[10px] uppercase font-bold text-primary/70">{item.category?.name?.en}</p>
                                                            <span className="text-xs font-black mt-1 block">${item.price.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 ml-4 bg-background/50 p-1.5 rounded-xl border border-white/10 shadow-sm">
                                                            <button
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent transition-colors disabled:opacity-30"
                                                                onClick={() => handleMenuItemChange(item._id, -1)}
                                                                disabled={getItemQuantity(item._id) === 0}
                                                            >
                                                                <Minus className="w-3 h-3 text-muted-foreground" />
                                                            </button>
                                                            <span className="w-4 text-center text-sm font-bold">{getItemQuantity(item._id)}</span>
                                                            <button
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                                                                onClick={() => handleMenuItemChange(item._id, 1)}
                                                            >
                                                                <Plus className="w-3 h-3 text-primary" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-10 text-center text-muted-foreground italic text-sm">
                                                    No menu items available for pre-order at the moment.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-3 pt-2">
                                        <Button
                                            variant="ghost"
                                            className="flex-1 h-12 rounded-2xl text-muted-foreground border border-muted-foreground/10 hover:bg-accent/50"
                                            onClick={() => handleFieldChange({ name: "step", value: 1 })}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            className="flex-2 h-12 rounded-2xl bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("confirm")}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {formData.step === 3 && formData.successData && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <Card className="border-none shadow-3xl rounded-3xl overflow-hidden p-8 glassmorphism">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h2 className="text-3xl font-black mb-2 antialiased">{t("success")}</h2>
                                <p className="text-muted-foreground mb-8 text-balance">{t("barcodeInstruction")}</p>

                                <div className="bg-white p-4 rounded-[2rem] inline-block shadow-inner mb-8 border-4 border-accent/20">
                                    <QRCodeSVG
                                        value={formData.successData?.qrData || ""}
                                        size={220}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>

                                <div className="text-left bg-accent/40 p-6 rounded-3xl mb-8 space-y-3 border border-white/5">
                                    <p className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80 mb-2">{t("bookingSummary")}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{t("customerName")}</span>
                                        <span className="font-black">{formData.successData?.customerName}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{t("partySize")}</span>
                                        <span className="font-black">{formData.partySize} {t("guests") || "Guests"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{t("date")}</span>
                                        <span className="font-black">{formData.date as string}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{t("time")}</span>
                                        <span className="font-black">{formData.startTime}</span>
                                    </div>
                                    {formData.menuItems && formData.menuItems.length > 0 && (
                                        <div className="pt-2 border-t border-white/5">
                                            <span className="text-xs font-bold text-muted-foreground">Pre-ordered Items:</span>
                                            <div className="mt-1 space-y-1">
                                                {formData.menuItems.map(mi => {
                                                    const item = menuItems.find(it => it._id === mi.itemId)
                                                    return (
                                                        <div key={mi.itemId} className="flex justify-between text-[11px]">
                                                            <span>{item?.name?.en} x{mi.quantity}</span>
                                                            <span className="font-bold">${((item?.price || 0) * mi.quantity).toFixed(2)}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-primary/20 hover:bg-primary/5 transition-colors">
                                    <Link href="/">{t("backToHome")}</Link>
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <style jsx global>{`
                .glassmorphism {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                }
                .dark .glassmorphism {
                    background: rgba(15, 15, 15, 0.8);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(var(--primary), 0.2);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}
