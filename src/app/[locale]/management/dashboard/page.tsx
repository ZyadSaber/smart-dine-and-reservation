import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import {
    TrendingUp,
    Users,
    ShoppingBag,
    CalendarClock
} from "lucide-react";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

interface DashboardReservation {
    _id: string;
    customerName: string;
    partySize: number;
    startTime: Date;
    status: string;
}

export default async function DashboardPage() {
    const t = await getTranslations("Common");

    await connectDB();
    const recentReservations = (await Reservation.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()) as unknown as DashboardReservation[];

    const stats = [
        {
            title: "Total Revenue",
            value: "EGP 12,450",
            icon: TrendingUp,
            趋势: "+12.5%",
            color: "text-emerald-500"
        },
        {
            title: "Active Orders",
            value: "8",
            icon: ShoppingBag,
            趋势: "Live",
            color: "text-blue-500"
        },
        {
            title: "Guests Today",
            value: "42",
            icon: Users,
            趋势: "+5",
            color: "text-orange-500"
        },
        {
            title: "Upcoming Bookings",
            value: "14",
            icon: CalendarClock,
            趋势: "Next 24h",
            color: "text-purple-500"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h2>
                <p className="text-muted-foreground">
                    Welcome back to your restaurant overview.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="overflow-hidden border-none shadow-lg bg-linear-to-br from-card to-accent/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg bg-background shadow-sm ${stat.color}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.趋势}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-lg">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            [Sales Chart Visualization]
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 border-none shadow-lg">
                    <CardHeader>
                        <CardTitle>Recent Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentReservations.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No recent reservations.</p>
                            ) : (
                                recentReservations.map((res: DashboardReservation) => (
                                    <div key={res._id.toString()} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold leading-none">{res.customerName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {res.partySize} guests • {new Date(res.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-black uppercase px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                            {res.status}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
