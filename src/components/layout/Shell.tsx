"use client"

import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="lg:ms-64 min-h-screen pb-20 lg:pb-0">
                <header className="h-16 border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-background/80 backdrop-blur-md z-10">
                    <div className="lg:hidden font-bold text-primary text-xl">
                        SmartDine
                    </div>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ModeToggle />
                    </div>
                </header>
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    )
}
