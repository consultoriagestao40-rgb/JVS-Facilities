import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ["latin"], variable: '--font-poppins' });

export const metadata: Metadata = {
    title: "JVS Facilities",
    description: "Website de alta conversão para JVS Facilities",
};

import { SimuladorProvider } from '@/context/SimuladorContext';
import Footer from "@/components/common/Footer";

import Script from 'next/script';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head>
                {/* Google Tag Manager */}
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N2CQJ98Z');`}
                </Script>
            </head>
            <body className={`${inter.variable} ${poppins.variable} font-sans`}>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-N2CQJ98Z"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>

                <SimuladorProvider>
                    <div className="flex flex-col min-h-screen">
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </SimuladorProvider>

                {/* Google Tag (gtag.js) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=AW-10778063853"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'AW-10778063853');
                    `}
                </Script>

                {/* Meta Pixel Code */}
                <Script id="meta-pixel" strategy="afterInteractive">
                    {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '1382593483557930');
                        fbq('track', 'PageView');
                    `}
                </Script>
                <noscript>
                    <img height="1" width="1" style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=1382593483557930&ev=PageView&noscript=1"
                    />
                </noscript>
            </body>
        </html>
    );
}
