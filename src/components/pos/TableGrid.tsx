"use client"

import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import TableOrder from "./TableOrder"
import { TableData } from "@/types/table"

const TableGrid = ({ tables }: { tables: TableData[] }) => {
    const t = useTranslations("POS")

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => (
                <TableOrder
                    key={table._id}
                    table={table}
                >
                    <CardContent className="p-4 flex flex-col items-center justify-center min-h-30 gap-2">
                        <div className="text-2xl font-black text-foreground/80">
                            {table.number}
                        </div>

                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Users className="w-3 h-3" />
                            <span>{table.capacity}</span>
                        </div>

                        <Badge
                            variant="outline"
                            className={cn(
                                "mt-2 font-bold",
                                table.status === 'Available' && "border-emerald-500 text-emerald-600 bg-emerald-500/10",
                                table.status === 'Occupied' && "border-orange-500 text-orange-600 bg-orange-500/10",
                                table.status === 'Reserved' && "border-blue-500 text-blue-600 bg-blue-500/10"
                            )}
                        >
                            {t(table.status.toLowerCase())}
                        </Badge>

                        {table.status === 'Reserved' && table.reservationId && (
                            <div className="flex flex-col items-center text-[10px] text-muted-foreground bg-accent/30 rounded-md p-1 w-full text-center mt-1">
                                <span className="font-semibold text-foreground/80 line-clamp-1">{table.reservationId.customerName}</span>
                                <span>{table.reservationId.customerPhone}</span>
                            </div>
                        )}
                    </CardContent>

                    {/* Visual indicator bar at the bottom */}
                    <div className={cn(
                        "absolute bottom-0 start-0 end-0 h-1",
                        table.status === 'Available' && "bg-emerald-500",
                        table.status === 'Occupied' && "bg-orange-500",
                        table.status === 'Reserved' && "bg-blue-500"
                    )} />
                </TableOrder>
            ))}
        </div>
    )
}

export default TableGrid
