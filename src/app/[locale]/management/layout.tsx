import { Shell } from "@/components/layout/Shell";

export default function ManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Shell>{children}</Shell>;
}
