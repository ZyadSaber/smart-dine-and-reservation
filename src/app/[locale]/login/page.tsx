"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UtensilsCrossed, Lock, Mail, Loader2, ArrowLeft } from "lucide-react"
import { Link, useRouter } from "@/i18n/routing"
import { motion } from "framer-motion"

import { login } from "@/actions/user"
import { toast } from "sonner"

export default function LoginPage() {
    const t = useTranslations("Auth")
    const commonT = useTranslations("Common")
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await login({ username, password })
            if (result.success) {
                toast.success("Login successful")
                // Redirect to the first allowed page or dashboard
                const target = result.allowedPages?.[0] || "/management/dashboard"
                router.push(target)
            }
        } catch (error: any) {
            toast.error(error.message || "Login failed")
        } finally {
            setLoading(false)
        }
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
                    <div className="bg-primary h-2" />
                    <CardHeader className="text-center pt-10">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
                            <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">{t("login")}</CardTitle>
                        <CardDescription>Access the SmartDine Management Suite</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Username
                                </label>
                                <Input
                                    type="text"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="h-12 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                    {t("password")}
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 rounded-xl"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full h-14 rounded-2xl text-lg group" disabled={loading}>
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        {t("signIn")}
                                        <Lock className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    © 2026 SmartDine POS. Professional Dining Solutions.
                </p>
            </motion.div>
        </div>
    )
}
