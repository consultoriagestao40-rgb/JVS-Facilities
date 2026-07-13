"use client";

import * as gtag from '@/lib/gtag';
import WhatsAppIcon from './WhatsAppIcon';

const WHATSAPP_URL =
    "https://wa.me/5541992252968?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

export default function WhatsAppFloat() {
    return (
        <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gtag.reportConversion()}
            aria-label="Fale conosco no WhatsApp"
            className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
            <span className="hidden md:block bg-white text-jvs-navy text-sm font-bold px-4 py-2 rounded-full shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                Fale conosco
            </span>
            <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 hover:scale-110 transition-transform">
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40"></span>
                <WhatsAppIcon className="relative w-7 h-7" />
            </span>
        </a>
    );
}
