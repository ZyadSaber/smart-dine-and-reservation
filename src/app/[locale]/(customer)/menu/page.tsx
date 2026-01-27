import { getTranslations } from "next-intl/server";
import { UtensilsCrossed, TriangleAlert } from "lucide-react";
import connectDB from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PublicMenuPage() {
    await connectDB();
    const items = await MenuItem.find({ isAvailable: true }).lean();

    return (
        <div className="container mx-auto px-4 pt-32 pb-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Our Exquisite Menu</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Crafted with passion using the freshest ingredients. Explore our signature dishes.
                </p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-accent/20 rounded-3xl border-2 border-dashed">
                    <TriangleAlert className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground italic">We are currently updating our menu. Please check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item: any) => (
                        <Card key={item._id.toString()} className="group overflow-hidden border-none shadow-xl rounded-3xl transition-transform hover:-translate-y-2">
                            <div className="h-48 bg-linear-to-br from-primary/20 to-primary/5 relative">
                                <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-md text-foreground border-none">
                                    {item.category}
                                </Badge>
                                <UtensilsCrossed className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/30 group-hover:scale-110 transition-transform" />
                            </div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold">{item.name.en}</h3>
                                    <span className="text-lg font-black text-primary">EGP {item.salePrice}</span>
                                </div>
                                <p className="text-muted-foreground text-sm mb-4">{item.name.ar}</p>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="rounded-full">Authentic</Badge>
                                    <Badge variant="secondary" className="rounded-full">Chef's Choice</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
