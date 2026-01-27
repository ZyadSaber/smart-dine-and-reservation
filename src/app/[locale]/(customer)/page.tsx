"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { CalendarDays, ArrowRight, Star, Coffee, Utensils, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function LandingPage() {
  const t = useTranslations("Landing")

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 py-2 px-4 rounded-full bg-primary/10 text-primary border-primary/20 text-sm font-bold flex w-fit gap-2 items-center">
                <Star className="w-4 h-4 fill-current" />
                #1 Rated Dining Experience in Town
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight text-foreground">
                Where Every <span className="text-primary italic">Flavor</span> Tells a Story.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mb-12 leading-relaxed">
                Step into a world of culinary excellence. From artisan roasted coffee to gourmet diner classics, we redefine your dining experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Button asChild size="lg" className="h-16 px-10 text-lg rounded-2xl group shadow-2xl shadow-primary/30">
                  <Link href="/reserve" className="flex items-center gap-3">
                    <CalendarDays className="w-6 h-6" />
                    {t("reserveTable")}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl hover:bg-accent border-2">
                  <Link href="/menu">
                    {t("exploreMenu")}
                  </Link>
                </Button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-10">
                <div>
                  <p className="text-3xl font-black text-primary">4.9/5</p>
                  <p className="text-sm text-muted-foreground font-medium">Customer Review</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-primary">15k+</p>
                  <p className="text-sm text-muted-foreground font-medium">Happy Diners</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-primary">20+</p>
                  <p className="text-sm text-muted-foreground font-medium">Award Winning Dishes</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full mt-12 lg:mt-0"
            >
              <div className="absolute inset-0 bg-primary/20 rounded- [40px] blur-3xl -z-10 animate-pulse" />
              <div className="relative h-full w-full rounded-[40px] overflow-hidden border-8 border-background shadow-2xl">
                <Image
                  src="/hero.png"
                  alt="Restaurant Ambiance"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 text-white p-6 backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 max-w-sm">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <p className="font-medium italic">&quot;The ambiance is just as incredible as the food. Best diner in the city!&quot;</p>
                  <p className="text-sm mt-4 font-bold opacity-80">- Sarah Jenkins</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories / Highlights */}
      <section className="py-24 bg-accent/30 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">Featured from Our Culinary Team</h2>
              <p className="text-lg text-muted-foreground">We take pride in our diverse menu, from the perfect morning brew to the most satisfying dinner platters.</p>
            </div>
            <Button asChild variant="ghost" className="text-primary font-bold text-lg hover:bg-primary/10 group">
              <Link href="/menu" className="flex items-center gap-2">
                View Full Menu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              whileHover={{ y: -10 }}
              className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <Image src="/burger.png" alt="Signature Burger" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 p-2">
                <Badge className="bg-primary text-primary-foreground mb-4">Chef&apos;s Special</Badge>
                <h3 className="text-3xl font-black text-white mb-2">Artisan Burgers</h3>
                <p className="text-white/70 text-sm max-w-xs">Our signature wagyu beef, aged cheddar, and house-made sauces on a toasted brioche.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <Image src="/coffee.png" alt="Specialty Coffee" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 p-2">
                <Badge className="bg-amber-500 text-white mb-4">Brewed Fresh</Badge>
                <h3 className="text-3xl font-black text-white mb-2">Coffee Shop</h3>
                <p className="text-white/70 text-sm max-w-xs">Locally roasted beans meets authentic European pastry traditions for your perfect morning.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <Image src="/desserts.png" alt="Artisanal Desserts" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 p-2">
                <Badge className="bg-rose-500 text-white mb-4">Sweet Treats</Badge>
                <h3 className="text-3xl font-black text-white mb-2">Signature Desserts</h3>
                <p className="text-white/70 text-sm max-w-xs">Indulge in our decadent collection of handcrafted desserts to end your meal on a perfect note.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                icon: Utensils,
                title: "Gourmet Diner Experience",
                desc: "Classic comfort food elevated with premium ingredients and modern culinary techniques."
              },
              {
                icon: Coffee,
                title: "Third-Wave Coffee Shop",
                desc: "Expertly pulled espressos and pour-overs using beans sourced from ethical, single-estate growers."
              },
              {
                icon: MapPin,
                title: "The Heart of the City",
                desc: "Located in the historic district, providing a perfect urban escape for friends and family."
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[3rem] p-12 lg:p-24 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <h2 className="text-4xl md:text-6xl font-black text-primary-foreground mb-8 relative z-10 leading-tight">
              Ready for an Unforgettable <br /> Dining Experience?
            </h2>
            <Button asChild size="lg" variant="secondary" className="h-20 px-12 text-2xl rounded-2xl relative z-10 shadow-2xl hover:scale-105 transition-all">
              <Link href="/reserve">{t("reserveTable")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}
