import { cn } from "@/lib/utils";
import Image from "next/image"

const Logo = ({ width, height }: { width: string, height: string }) => {
    return (
        <div className={cn("rounded-3xl mx-auto mb-6 relative w-40 h-40 overflow-hidden flex items-center justify-center", width, height)}>
            <Image
                src="/logo.png"
                alt="Smart Dine Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
};

export default Logo;