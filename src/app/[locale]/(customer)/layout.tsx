"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const tLanding = useTranslations("Landing")
    const commonT = useTranslations("Common")

    return (
        <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-500 delay-100 ease-in-out">
            {/* Navbar moved from page.tsx */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
                <div className="container mx-auto px-4 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
                            <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex flex-col text-foreground">
                            <span className="text-xl font-black tracking-tight leading-none">{commonT("title")}</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Gourmet Diner & Cafe</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <ModeToggle />
                        <Button asChild size="sm" className="hidden md:flex rounded-full px-6 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-none transition-all">
                            <Link href="/reserve">{tLanding("reserveTable")}</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            {/* Footer moved from page.tsx */}
            <footer className="py-10 border-t bg-accent/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-10 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-primary rounded-lg">
                                    <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <span className="text-lg font-black tracking-tight text-foreground">{commonT("title")}</span>
                            </div>
                            <p className="text-muted-foreground max-w-sm mb-4 text-sm leading-relaxed">
                                A premier culinary destination dedicated to artisanal coffee and fine dining.
                                Join us for an unforgettable experience where quality meets passion.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-foreground">Explore</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                                <li><Link href="/menu" className="hover:text-primary transition-colors text-xs uppercase tracking-tight font-bold">Full Menu</Link></li>
                                <li><Link href="/reserve" className="hover:text-primary transition-colors text-xs uppercase tracking-tight font-bold">Reservations</Link></li>
                                <li><Link href="/about" className="hover:text-primary transition-colors text-xs uppercase tracking-tight font-bold">Our Story</Link></li>
                                <li><Link href="/events" className="hover:text-primary transition-colors text-xs uppercase tracking-tight font-bold">Private Events</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-foreground">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                                <li><Link href="/contact" className="hover:text-primary transition-colors text-xs uppercase tracking-tight font-bold">Contact Us</Link></li>
                                <li><Link href="/faq" className="hover:text-primary transition-colors text-xs uppercase tracking-tight font-bold">FAQ</Link></li>
                                <li><Link href="/careers" className="hover:text-primary transition-colors text-xs uppercase tracking-tight font-bold">Careers</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-border/40 text-center text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">
                        <p>© 2026 SmartDine POS. Excellence in Dining.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
