"use client"

import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { routing } from "@/i18n/routing"

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const toggleLocale = () => {
        const nextLocale = locale === "en" ? "ar" : "en"
        const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`)
        router.push(newPathname)
    }

    return (
        <Button variant="ghost" size="sm" onClick={toggleLocale}>
            {locale === "en" ? "العربية" : "English"}
        </Button>
    )
}
