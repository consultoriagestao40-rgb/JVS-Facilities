import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ["latin"], variable: '--font-poppins' });

export const metadata: Metadata = {
    title: "JVS Facilities",
    description: "Website de alta conversão para JVS Facilities",
};

import Footer from "@/components/common/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${inter.variable} ${poppins.variable} font-sans`}>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
