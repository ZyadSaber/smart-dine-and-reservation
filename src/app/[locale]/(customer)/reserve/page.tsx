"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import {
    User,
    Phone,
    Users,
    Calendar,
    CheckCircle2,
    UtensilsCrossed,
    ArrowRight,
    Loader2
} from "lucide-react"
import { createReservation } from "@/services/reservation"
import { QRCodeSVG } from "qrcode.react"
import { Link } from "@/i18n/routing"

export default function ReservePage() {
    const t = useTranslations("Reservation")
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [successData, setSuccessData] = useState<any>(null)

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        guests: "2",
        date: new Date().toISOString().split('T')[0],
        time: "19:00"
    })

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const startTime = new Date(`${formData.date}T${formData.time}`)
            const result = await createReservation({
                customerName: formData.name,
                customerPhone: formData.phone,
                partySize: parseInt(formData.guests),
                startTime: startTime
            })
            setSuccessData(result)
            setStep(3)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-accent/20 py-12 px-4 md:py-32">
            <div className="max-w-xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black">{t("title")}</h1>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                                <div className="bg-primary h-2" />
                                <CardHeader>
                                    <CardTitle>{t("title")}</CardTitle>
                                    <CardDescription>Tell us who you are and when you&apos;re coming.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> {t("customerName")}</label>
                                            <Input
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="rounded-xl h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2"><Phone className="w-4 h-4" /> {t("customerPhone")}</label>
                                            <Input
                                                placeholder="+20 123 456 789"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="rounded-xl h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2"><Users className="w-4 h-4" /> {t("partySize")}</label>
                                            <Input
                                                type="number"
                                                value={formData.guests}
                                                onChange={e => setFormData({ ...formData, guests: e.target.value })}
                                                className="rounded-xl h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> {t("date")}</label>
                                            <Input
                                                type="date"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                className="rounded-xl h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2"><Loader2 className="w-4 h-4" /> {t("time")}</label>
                                            <Input
                                                type="time"
                                                value={formData.time}
                                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                className="rounded-xl h-12"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 rounded-2xl text-lg mt-4 group"
                                        onClick={() => setStep(2)}
                                        disabled={!formData.name || !formData.phone}
                                    >
                                        Continue to selection
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                                <div className="bg-primary h-2" />
                                <CardHeader>
                                    <CardTitle>Advance Selection (Optional)</CardTitle>
                                    <CardDescription>Browse our menu and choose what you&apos;d like to enjoy.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="p-8 border-2 border-dashed rounded-2xl text-center">
                                        <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground italic">Integration with menu selection coming soon...</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => setStep(1)}>
                                            Back
                                        </Button>
                                        <Button
                                            className="flex-3 h-12 rounded-xl"
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

                    {step === 3 && successData && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden p-8">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h2 className="text-3xl font-black mb-2">{t("success")}</h2>
                                <p className="text-muted-foreground mb-8">{t("barcodeInstruction")}</p>

                                <div className="bg-white p-6 rounded-3xl inline-block shadow-inner mb-8">
                                    <QRCodeSVG
                                        value={successData.qrData}
                                        size={200}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>

                                <div className="text-left bg-accent/50 p-6 rounded-2xl mb-8 space-y-2">
                                    <p className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{t("bookingSummary")}</p>
                                    <div className="flex justify-between">
                                        <span className="font-medium">{t("customerName")}:</span>
                                        <span>{successData.customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">{t("partySize")}:</span>
                                        <span>{formData.guests} people</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">{t("date")} & {t("time")}:</span>
                                        <span>{formData.date} at {formData.time}</span>
                                    </div>
                                </div>

                                <Button asChild variant="outline" className="w-full h-12 rounded-xl">
                                    <Link href="/">{t("backToHome")}</Link>
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
