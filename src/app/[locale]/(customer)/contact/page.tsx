"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter } from "lucide-react"

export default function ContactPage() {
    const t = useTranslations("Contact")

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

            <section className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-3xl font-black mb-8">{t("infoTitle")}</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t("addressTitle")}</h4>
                                        <p className="text-muted-foreground">{t("address")}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t("phone")}</h4>
                                        <p className="text-muted-foreground">Available during business hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t("emailLabel")}</h4>
                                        <p className="text-muted-foreground">hello@smartdine.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t("hoursTitle")}</h4>
                                        <p className="text-muted-foreground">{t("hoursWeek")}</p>
                                        <p className="text-muted-foreground">{t("hoursWeekend")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                {[
                                    { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                                    { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                                    { icon: Twitter, href: "#", color: "hover:bg-sky-500" }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        className={`w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-foreground transition-all duration-300 ${social.color} hover:text-white hover:scale-110`}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card border-none shadow-2xl rounded-[3rem] p-8 lg:p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                        <h2 className="text-3xl font-black mb-8">{t("formTitle")}</h2>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold tracking-wider uppercase text-muted-foreground">{t("name")}</label>
                                <Input placeholder="John Doe" className="h-14 rounded-2xl bg-accent/50 border-none px-6 focus:ring-2 focus:ring-primary" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold tracking-wider uppercase text-muted-foreground">{t("email")}</label>
                                <Input type="email" placeholder="john@example.com" className="h-14 rounded-2xl bg-accent/50 border-none px-6 focus:ring-2 focus:ring-primary" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold tracking-wider uppercase text-muted-foreground">{t("subject")}</label>
                                <Input placeholder="General Inquiry" className="h-14 rounded-2xl bg-accent/50 border-none px-6 focus:ring-2 focus:ring-primary" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold tracking-wider uppercase text-muted-foreground">{t("message")}</label>
                                <Textarea placeholder="How can we help you?" className="min-h-[150px] rounded-3xl bg-accent/50 border-none p-6 focus:ring-2 focus:ring-primary" />
                            </div>

                            <Button className="w-full h-16 rounded-2xl text-lg font-black group shadow-xl shadow-primary/20">
                                {t("send")}
                                <Send className="w-5 h-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Map Section */}
            <section className="container mx-auto px-4 mt-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative h-[500px] w-full rounded-[4rem] overflow-hidden shadow-2xl bg-accent flex items-center justify-center group"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="relative z-10 text-center p-8 backdrop-blur-md bg-background/50 rounded-3xl border border-white/20">
                        <MapPin className="w-12 h-12 mx-auto text-primary mb-4 animate-bounce" />
                        <h3 className="text-2xl font-black mb-2">Find Us</h3>
                        <p className="text-muted-foreground">{t("address")}</p>
                        <Button variant="link" className="text-primary font-bold mt-4" asChild>
                            <a href="https://maps.google.com" target="_blank">Open in Google Maps</a>
                        </Button>
                    </div>
                    {/* This would be an actual iframe or Google Maps integration in a real app */}
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
                </motion.div>
            </section>
        </div>
    )
}
