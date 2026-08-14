"use client";

/**
 * Slot do selo "JVS 32 anos".
 * O arquivo enviado pelo cliente era "25 Anos" — aguardando o selo correto de 32.
 * Quando chegar, colocar em /images/brand/selo-32-anos-branco.png e /images/brand/selo-32-anos-cor.png
 * e setar SEAL_READY = true.
 */
const SEAL_READY = false;
const SEAL_WHITE = "/images/brand/selo-32-anos-branco.png";
const SEAL_COLOR = "/images/brand/selo-32-anos-cor.png";

type BrandSealProps = {
    variant?: "white" | "color";
    className?: string;
};

export default function BrandSeal({ variant = "white", className = "" }: BrandSealProps) {
    if (!SEAL_READY) {
        return (
            <div
                className={`inline-flex items-center gap-2 rounded-full border border-dashed px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                    variant === "white"
                        ? "border-white/30 text-white/60"
                        : "border-jvs-border text-jvs-muted"
                } ${className}`}
                aria-label="Selo 32 anos — aguardando arte"
            >
                JVS · 32 anos
                <span className="font-normal normal-case tracking-normal opacity-70">(selo em breve)</span>
            </div>
        );
    }

    const src = variant === "white" ? SEAL_WHITE : SEAL_COLOR;
    return (
        <img
            src={src}
            alt="JVS Facilities — 32 anos"
            className={`h-10 md:h-12 w-auto object-contain ${className}`}
        />
    );
}
