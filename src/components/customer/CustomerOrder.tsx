"use client";

import { useState, useMemo, useTransition } from "react";
import { MenuManagementItem } from "@/types/menu";
import { TableData } from "@/types/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    UtensilsCrossed,
    Search,
    Plus,
    Minus,
    ShoppingCart,
    Trash2,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedValue } from "@/lib/localize";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { submitCustomerOrder } from "@/services/order";
import { OrderResponse } from "@/types/pos";
import { useRouter } from "@/i18n/routing";

interface CustomerOrderProps {
    table: TableData;
    menuItems: MenuManagementItem[];
    initialOrder?: OrderResponse | null;
}

interface CartItem extends MenuManagementItem {
    quantity: number;
}

const CustomerOrder = ({ table, menuItems, initialOrder }: CustomerOrderProps) => {
    const locale = useLocale();
    const t = useTranslations("CustomerOrder");
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isOrdered, setIsOrdered] = useState(false);

    const categories = useMemo(() => {
        const cats = new Set(menuItems.map(item => item.category._id));
        const uniqueCats = Array.from(cats).map(id => {
            const item = menuItems.find(i => i.category._id === id);
            return item?.category;
        }).filter(Boolean);
        return uniqueCats as { _id: string; name: { en: string; ar: string } }[];
    }, [menuItems]);

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesSearch = getLocalizedValue(item.name, locale)
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || item.category._id === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [menuItems, searchQuery, selectedCategory, locale]);

    const addToCart = (item: MenuManagementItem) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) {
                return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map(i => i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
            }
            return prev.filter(i => i._id !== itemId);
        });
    };

    const confirmedTotal = initialOrder?.totalAmount || 0;
    const confirmedCount = initialOrder?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const grandTotal = confirmedTotal + cartTotal;

    const handleSubmitOrder = () => {
        if (cart.length === 0) return;

        startTransition(async () => {
            const orderData = {
                tableId: table._id || "",
                items: cart.map(item => ({
                    itemId: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.price * item.quantity
                })),
                totalAmount: cartTotal,
            };

            const res = await submitCustomerOrder(orderData);
            if (res.success) {
                toast.success(t("orderSuccess"));
                setCart([]);
                setIsCartOpen(false);
                setIsOrdered(true);
                router.refresh();
            } else {
                toast.error(res.error || t("orderError"));
            }
        });
    };

    if (isOrdered) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto text-center py-20 px-6 bg-card rounded-3xl border shadow-xl"
            >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-black mb-4">{t("orderReceived")}</h1>
                <p className="text-muted-foreground mb-8">
                    {t("orderReceivedDesc", { tableNumber: table.number })}
                </p>
                <Button onClick={() => setIsOrdered(false)} className="w-full h-12 rounded-2xl text-lg font-bold">
                    {t("orderMore")}
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-24">
            {/* Header */}
            <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <Badge variant="outline" className="mb-2 px-4 py-1 rounded-full border-primary/20 text-primary uppercase tracking-widest text-[10px] font-black">
                        {t("table")} {table.number}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{t("welcomeTable")}</h1>
                    <p className="text-muted-foreground text-lg">{t("browseMenu")}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                            placeholder={t("searchDishes")}
                            className="pl-12 h-12 rounded-2xl border-none bg-accent/30 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-6 px-2 no-scrollbar">
                <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className="rounded-2xl px-8 h-12 text-sm font-bold whitespace-nowrap transition-all"
                    onClick={() => setSelectedCategory("all")}
                >
                    {t("allItems")}
                </Button>
                {categories.map((cat) => (
                    <Button
                        key={cat._id}
                        variant={selectedCategory === cat._id ? "default" : "outline"}
                        className="rounded-2xl px-8 h-12 text-sm font-bold whitespace-nowrap transition-all"
                        onClick={() => setSelectedCategory(cat._id)}
                    >
                        {getLocalizedValue(cat.name, locale)}
                    </Button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 mt-4">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => {
                        const inCart = cart.find(i => i._id === item._id);
                        return (
                            <motion.div
                                layout
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="group overflow-hidden border-none shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col p-2">
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center mb-3">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold px-3">
                                                {getLocalizedValue(item.category.name, locale)}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold line-clamp-1">{getLocalizedValue(item.name, locale)}</h3>
                                            <span className="text-xl font-black text-primary">{t("currency")} {item.price}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                                            {item.description?.[locale as "en" | "ar"] || t("noDescription")}
                                        </p>

                                        <div className="mt-auto pt-4 flex items-center justify-between gap-4 border-t border-accent/20">
                                            {inCart ? (
                                                <div className="flex items-center bg-accent/50 rounded-2xl p-1 w-full justify-between">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-10 w-10 rounded-xl hover:bg-background shadow-sm"
                                                        onClick={() => removeFromCart(item._id)}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="font-bold text-lg">{inCart.quantity}</span>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-10 w-10 rounded-xl hover:bg-background shadow-sm"
                                                        onClick={() => addToCart(item)}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={() => addToCart(item)}
                                                    className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
                                                >
                                                    <Plus className="w-5 h-5 mr-2" />
                                                    {t("addToOrder")}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="text-center py-32 bg-accent/20 rounded-[40px] border-4 border-dashed border-accent mx-2 mt-8">
                    <UtensilsCrossed className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
                    <h3 className="text-2xl font-bold mb-2">{t("noItemsFound")}</h3>
                    <p className="text-muted-foreground">{t("noItemsDesc")}</p>
                </div>
            )}

            {/* Floating Cart Button */}
            {(cartCount > 0 || confirmedCount > 0) && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                >
                    <Button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full h-16 rounded-[2rem] shadow-2xl shadow-primary/40 text-lg font-black flex items-center justify-between px-8 hover:scale-[1.02] transition-transform"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <ShoppingCart className="w-7 h-7" />
                                <Badge className="absolute -top-2 -right-2 bg-white text-primary w-5 h-5 flex items-center justify-center p-0 rounded-full text-[10px] font-black">
                                    {cartCount + confirmedCount}
                                </Badge>
                            </div>
                            <span>{cartCount > 0 ? t("reviewOrder") : t("viewOrder")}</span>
                        </div>
                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-base">
                            {t("currency")} {grandTotal.toFixed(2)}
                        </span>
                    </Button>
                </motion.div>
            )}

            {/* Cart Sheet / Dialog (using full screen for mobile feel) */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[60]"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[70] w-full max-w-2xl bg-card border-t rounded-t-[3rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto flex flex-col"
                        >
                            <div className="w-16 h-1.5 bg-accent/50 rounded-full mx-auto mb-8 cursor-pointer" onClick={() => setIsCartOpen(false)} />

                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black tracking-tight">{t("yourOrder")}</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full">
                                    <Trash2 className="w-6 h-6 text-muted-foreground" />
                                </Button>
                            </div>

                            <div className="flex-1 space-y-8 mb-8 overflow-y-auto pr-2 custom-scrollbar">
                                {initialOrder && initialOrder.items.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="h-px flex-1 bg-emerald-100" />
                                            <span className="text-[10px] uppercase tracking-widest font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{t("confirmedOrder")}</span>
                                            <div className="h-px flex-1 bg-emerald-100" />
                                        </div>
                                        {initialOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">{getLocalizedValue(item.name, locale)}</h4>
                                                    <p className="text-emerald-600 font-black">{t("currency")} {item.price}</p>
                                                </div>
                                                <Badge variant="outline" className="h-10 px-4 rounded-xl border-emerald-200 text-emerald-700 font-black text-base">
                                                    × {item.quantity}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {cart.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="h-px flex-1 bg-primary/10" />
                                            <span className="text-[10px] uppercase tracking-widest font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{t("newAdditions")}</span>
                                            <div className="h-px flex-1 bg-primary/10" />
                                        </div>
                                        {cart.map((item) => (
                                            <div key={item._id} className="flex items-center gap-4 p-5 bg-accent/20 rounded-3xl border border-accent/20">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">{getLocalizedValue(item.name, locale)}</h4>
                                                    <p className="text-primary font-black">{t("currency")} {item.price}</p>
                                                </div>
                                                <div className="flex items-center gap-4 bg-background rounded-2xl p-1 shadow-sm border">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 rounded-xl"
                                                        onClick={() => removeFromCart(item._id)}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="font-black text-base">{item.quantity}</span>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 rounded-xl"
                                                        onClick={() => addToCart(item)}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto space-y-6 bg-accent/10 p-6 rounded-[2rem]">
                                {initialOrder && (
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                        <span className="text-muted-foreground font-medium">{t("previousBalance")}</span>
                                        <span className="font-bold text-emerald-600">{t("currency")} {confirmedTotal.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground font-medium">{t("newItems")}</span>
                                    <span className="font-bold">{t("currency")} {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 pt-4 border-t border-accent/20">
                                    <span className="text-2xl font-black">{t("grandTotal")}</span>
                                    <span className="text-2xl font-black text-primary">{t("currency")} {grandTotal.toFixed(2)}</span>
                                </div>
                                {cart.length > 0 ? (
                                    <Button
                                        className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20"
                                        onClick={handleSubmitOrder}
                                        isLoading={isPending}
                                    >
                                        {isPending ? (
                                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                        ) : (
                                            t("confirmNewItems")
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full h-16 rounded-2xl text-lg font-bold border-2"
                                        onClick={() => setIsCartOpen(false)}
                                    >
                                        {t("addMoreItems")}
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerOrder;
