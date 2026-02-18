"use client";

import { useState, useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Printer, Download } from "lucide-react";
import { useLocale } from "next-intl";

interface TableQrCodeProps {
    tableId: string;
    tableNumber: string;
}

const TableQrCode = ({ tableId, tableNumber }: TableQrCodeProps) => {
    const locale = useLocale();
    const [baseUrl, setBaseUrl] = useState("");

    // Set base URL on component mount
    useState(() => {
        if (typeof window !== "undefined") {
            setBaseUrl(window.location.origin);
        }
    });

    const qrRef = useRef<HTMLCanvasElement>(null);
    const orderUrl = `${baseUrl}/${locale}/order/${tableId}`;

    const handleDownload = () => {
        if (!qrRef.current) return;

        const canvas = qrRef.current;

        // Create a temporary canvas for the final image with text
        const finalCanvas = document.createElement("canvas");
        const padding = 120;
        finalCanvas.width = canvas.width;
        finalCanvas.height = canvas.height + padding;
        const ctx = finalCanvas.getContext("2d");
        if (!ctx) return;

        // Fill background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        // Draw Table Number Text at the top
        ctx.fillStyle = "black";
        ctx.font = "bold 80px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`TABLE ${tableNumber}`, finalCanvas.width / 2, 90);

        // Draw the QR Code below the text
        ctx.drawImage(canvas, 0, padding);

        const pngUrl = finalCanvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `Table-${tableNumber}-QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const qrSvg = document.getElementById(`qr-table-${tableId}`);
        if (!qrSvg) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code - Table ${tableNumber}</title>
                    <style>
                        body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
                        .container { text-align: center; border: 2px solid #000; padding: 40px; border-radius: 20px; }
                        h1 { margin-bottom: 20px; font-size: 48px; }
                        p { margin-top: 20px; font-size: 24px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Table ${tableNumber}</h1>
                        <div style="width: 300px; height: 300px;">
                            ${qrSvg.outerHTML.replace('width="100%"', 'width="300"').replace('height="100%"', 'height="300"')}
                        </div>
                        <p>Scan to See Menu & Order</p>
                    </div>
                    <script>
                        window.onload = () => {
                            window.print();
                            window.close();
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="hover:bg-primary/5 transition-colors">
                    <QrCode className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-black">Table ${tableNumber}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 ring-4 ring-primary/5 transition-transform hover:scale-[1.02]">
                        <QRCodeSVG
                            id={`qr-table-${tableId}`}
                            value={orderUrl}
                            size={200}
                            level="H"
                            includeMargin={false}
                        />
                        {/* Hidden canvas for downloading */}
                        <div className="hidden">
                            <QRCodeCanvas
                                ref={qrRef}
                                value={orderUrl}
                                size={1024}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                    </div>

                    <div className="bg-accent/30 p-4 rounded-2xl w-full">
                        <p className="text-center text-[10px] text-muted-foreground font-mono break-all line-clamp-1 opacity-60">
                            {orderUrl}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Button className="h-12 rounded-2xl font-bold" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button className="h-12 rounded-2xl font-bold" onClick={handlePrint} variant="outline">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TableQrCode;
