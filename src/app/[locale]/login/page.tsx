"use client"

import { useTransition } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, ArrowLeft } from "lucide-react"
import { Link, useRouter } from "@/i18n/routing"
import { motion } from "framer-motion"
import Image from "next/image"

import { login } from "@/services/user"
import { toast } from "sonner"
import { useFormManager } from "@/hooks"
import { loginSchema } from "@/validations/login"

export default function LoginPage() {
    const t = useTranslations("Auth")
    const commonT = useTranslations("Common")
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const { formData, handleChange, validate, errors } = useFormManager({
        initialData: {
            username: "",
            password: "",
        },
        schema: loginSchema,
    })

    const handleLogin = async () => {
        if (!validate()) return
        startTransition(async () => {
            try {
                const result = await login(formData)
                if (result.success) {
                    toast.success(commonT("success"))
                    const target = "/management"
                    router.push(target)
                } else {
                    toast.error(result.error)
                }
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Login failed"
                toast.error(`${commonT("error")}: ${message}`)
            }
        })
    }


    return (
        <div className="min-h-screen bg-accent/20 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 mx-auto w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    {commonT("backToHome")}
                </Link>

                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="text-center pt-10">
                        <div className="rounded-3xl mx-auto mb-6 relative w-40 h-40 overflow-hidden flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="Smart Dine Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">{t("login")}</CardTitle>
                        <CardDescription>Access the SmartDine Management Suite</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col gap-5">
                        <Input
                            name="username"
                            type="text"
                            placeholder="admin"
                            value={formData.username}
                            onChange={handleChange}
                            className="h-12 rounded-xl"
                            required
                            label={t("userName")}
                            error={errors.username}
                        />
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="h-12 rounded-xl"
                            required
                            error={errors.password}
                            label={t("password")}
                        />
                        <Button
                            className="w-full h-14 rounded-2xl text-lg group mt-8"
                            disabled={isPending}
                            onClick={handleLogin}
                            isLoading={isPending}
                        >
                            {t("signIn")}
                            <Lock className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    © 2026 SmartDine POS. Professional Dining Solutions.
                </p>
            </motion.div>
        </div>
    )
}
