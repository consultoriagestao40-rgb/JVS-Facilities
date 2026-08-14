"use client";

import { twMerge } from "tailwind-merge";

/**
 * Selo "JVS Facilities · 32 Anos".
 * Arte: /images/brand/selo-32-anos-branco.png (hero navy)
 *       /images/brand/selo-32-anos-cor.png (fundos claros)
 */
const SEAL_WHITE = "/images/brand/selo-32-anos-branco.png";
const SEAL_COLOR = "/images/brand/selo-32-anos-cor.png";

type BrandSealProps = {
    variant?: "white" | "color";
    className?: string;
};

export default function BrandSeal({ variant = "white", className = "" }: BrandSealProps) {
    const src = variant === "white" ? SEAL_WHITE : SEAL_COLOR;
    return (
        <img
            src={src}
            alt="JVS Facilities — 32 anos"
            className={twMerge("h-16 sm:h-20 md:h-24 w-auto object-contain", className)}
        />
    );
}
