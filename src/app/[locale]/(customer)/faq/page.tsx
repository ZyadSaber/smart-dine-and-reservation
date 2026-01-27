"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FAQPage() {
    const t = useTranslations("FAQ")

    const faqs = [
        { q: t("q1"), a: t("a1") },
        { q: t("q2"), a: t("a2") },
        { q: t("q3"), a: t("a3") },
        { q: t("q4"), a: t("a4") },
        { q: t("q5"), a: t("a5") },
        { q: t("q6"), a: t("a6") },
    ]

    return (
        <div className="pt-32 pb-20">
            {/* Header Section */}
            <section className="container mx-auto px-4 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6"
                >
                    <HelpCircle className="w-4 h-4" />
                    Got Questions?
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">{t("title")}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
                    {t("subtitle")}
                </p>
            </section>

            {/* FAQ Accordion Section */}
            <section className="container mx-auto px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                className="border-none bg-card px-6 py-2 rounded-[2rem] shadow-lg shadow-black/5 hover:shadow-primary/5 transition-all"
                            >
                                <AccordionTrigger className="text-lg font-bold hover:no-underline text-left">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </section>

            {/* Support Section */}
            <section className="container mx-auto px-4 mt-32">
                <div className="relative bg-primary rounded-[4rem] p-12 lg:p-20 text-center text-primary-foreground shadow-2xl shadow-primary/20 overflow-hidden">
                    {/* Background Accents - Subtle light glow instead of dots */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-primary-foreground/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-primary-foreground/20">
                            <MessageCircle className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 italic tracking-tight text-primary-foreground">{t("supportTitle")}</h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10 text-primary-foreground/90">
                            {t("supportDesc")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="h-16 px-10 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl">
                                Contact Support
                            </Button>
                            <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 font-bold text-lg backdrop-blur-sm hover:bg-primary-foreground/20 transition-all">
                                Email Our Team
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
