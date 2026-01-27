"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Star, Leaf, Heart, Users } from "lucide-react"

export default function AboutPage() {
    const t = useTranslations("About")

    return (
        <div className="pt-32 pb-20">
            {/* Hero Header */}
            <section className="container mx-auto px-4 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">{t("title")}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t("subtitle")}
                    </p>
                </motion.div>
            </section>

            {/* Story Section */}
            <section className="container mx-auto px-4 mb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <Image src="/about_chef.png" alt="Our Chef" fill className="object-cover" />
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black/80 to-transparent">
                            <div className="flex gap-2 mb-2">
                                {[1, 2, 5].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                            </div>
                            <p className="text-white italic">&quot;Cooking is an act of love. Every ingredient should feel respected.&quot;</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-black leading-tight">{t("ourJournalTitle")}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t("ourJournalDesc")}
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-6">
                            <div className="space-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold">Community-First</h4>
                                <p className="text-sm text-muted-foreground">Creating a home away from home for every guest.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold">Made with Love</h4>
                                <p className="text-sm text-muted-foreground">Every dish is prepared from scratch daily.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="bg-accent/30 py-32 mb-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8 order-2 lg:order-1"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-sm">
                                <Leaf className="w-4 h-4" />
                                Our Commitment
                            </div>
                            <h2 className="text-4xl font-black leading-tight">{t("commitmentTitle")}</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t("commitmentDesc")}
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "100% Organic locally sourced produce",
                                    "Ethically traded single-origin coffee beans",
                                    "Zero plastic high-sustainability packaging",
                                    "Support for local artisanal smaller families"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl order-1 lg:order-2"
                        >
                            <Image src="/about_sourcing.png" alt="Sustainable Sourcing" fill className="object-cover" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-primary p-12 lg:p-24 rounded-[4rem] text-primary-foreground space-y-8"
                >
                    <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">{t("visitUs")}</h2>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        We can&apos;t wait to share our story with you in person. Join us for a meal you won&apos;t forget.
                    </p>
                    <Button asChild size="lg" variant="secondary" className="h-20 px-12 text-2xl rounded-2xl shadow-2xl hover:scale-105 transition-all">
                        <Link href="/reserve">{t("reserveCTA")}</Link>
                    </Button>
                </motion.div>
            </section>
        </div>
    )
}
