"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { GlassWater, Music, Utensils, CalendarCheck, ArrowRight } from "lucide-react"

export default function EventsPage() {
    const t = useTranslations("Events")

    const spaces = [
        {
            title: t("theAlcove"),
            desc: t("theAlcoveDesc"),
            image: "/desserts.png",
            capacity: "12 Guests"
        },
        {
            title: t("theGrandRoom"),
            desc: t("theGrandRoomDesc"),
            image: "/hero.png",
            capacity: "50 Guests"
        }
    ]

    const services = [
        { icon: Utensils, label: t("service1") },
        { icon: Music, label: t("service2") },
        { icon: GlassWater, label: t("service3") },
        { icon: CalendarCheck, label: t("service4") }
    ]

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
                    <p className="text-xl text-muted-foreground leading-relaxed italic">
                        {t("subtitle")}
                    </p>
                </motion.div>
            </section>

            {/* Intro Section */}
            <section className="container mx-auto px-4 mb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-black leading-tight">{t("introTitle")}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t("introDesc")}
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="text-center">
                                <p className="text-4xl font-black text-primary">250+</p>
                                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-1">Events Hosted</p>
                            </div>
                            <div className="w-px h-12 bg-border mx-4" />
                            <div className="text-center">
                                <p className="text-4xl font-black text-primary">100%</p>
                                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-1">Bespoke Setup</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl skew-y-2 lg:skew-y-0"
                    >
                        <Image
                            src="/about_chef.png"
                            alt="Event Celebration"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                    </motion.div>
                </div>
            </section>

            {/* Spaces Grid */}
            <section className="bg-accent/30 py-32 mb-32">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-black text-center mb-16">{t("spacesTitle")}</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        {spaces.map((space, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl"
                            >
                                <Image src={space.image} alt={space.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute bottom-10 left-10 p-2">
                                    <div className="bg-primary/20 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block tracking-widest uppercase">
                                        Cap: {space.capacity}
                                    </div>
                                    <h3 className="text-4xl font-black text-white mb-2">{space.title}</h3>
                                    <p className="text-white/70 max-w-md">{space.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="container mx-auto px-4 mb-32">
                <div className="bg-background border-2 border-primary/10 rounded-[4rem] p-12 lg:p-20">
                    <h2 className="text-3xl font-black text-center mb-16">{t("servicesTitle")}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {services.map((service, i) => {
                            const Icon = service.icon
                            return (
                                <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <p className="font-bold text-lg">{service.label}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Inquiry Form Call to Action */}
            <section className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-primary p-12 lg:p-24 rounded-[4rem] text-primary-foreground text-center overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                    <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">{t("inquiryCTA")}</h2>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto mb-12 relative z-10">
                        {t("contactTeam")}
                    </p>
                    <Button asChild size="lg" variant="secondary" className="h-20 px-12 text-2xl rounded-2xl relative z-10 shadow-2xl hover:scale-105 transition-all group">
                        <Link href="/contact" className="flex items-center gap-4">
                            Request a Quote
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </Button>
                </motion.div>
            </section>
        </div>
    )
}
