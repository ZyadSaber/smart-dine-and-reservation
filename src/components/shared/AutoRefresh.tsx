"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ interval = 15000 }: { interval?: number }) {
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            router.refresh(); // Fetches fresh data from the server components
        }, interval);

        return () => clearInterval(timer);
    }, [router, interval]);

    return null; // This component is invisible
}
