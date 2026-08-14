"use client";

import { motion } from "framer-motion";

export type ClientLogo = {
    src: string;
    alt: string;
};

type ClientsShowcaseProps = {
    title?: string;
    subtitle?: string;
    /** Eyebrow acima do título. Passe string vazia para ocultar. */
    eyebrow?: string;
    logos: ClientLogo[];
    /** Fundo claro (padrão) ou escuro */
    tone?: "light" | "dark";
};

/**
 * Vitrine de clientes — 2ª/3ª seção das LPs v2.
 * Quando logos chegar, basta popular o array passado pela página.
 */
export default function ClientsShowcase({
    title = "Quem confia na JVS",
    subtitle = "Clientes de expressão em indústrias, hospitais e grandes varejos.",
    eyebrow = "Clientes",
    logos,
    tone = "light",
}: ClientsShowcaseProps) {
    const isDark = tone === "dark";
    const hasLogos = logos.length > 0;

    return (
        <section
            className={`py-16 md:py-20 border-y ${
                isDark
                    ? "bg-gradient-hero text-white border-white/10"
                    : "bg-white text-jvs-text border-jvs-border"
            }`}
            id="clientes"
        >
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-10"
                >
                    {eyebrow ? (
                        <span
                            className={`font-bold tracking-wider text-sm uppercase mb-3 block ${
                                isDark ? "text-jvs-gold" : "text-jvs-gold"
                            }`}
                        >
                            {eyebrow}
                        </span>
                    ) : null}
                    <h2
                        className={`text-3xl md:text-4xl font-heading font-bold tracking-tight ${
                            subtitle ? "mb-3" : ""
                        } ${isDark ? "text-white" : "text-jvs-navy"}`}
                    >
                        {title}
                    </h2>
                    {subtitle ? (
                        <p className={`leading-relaxed ${isDark ? "text-slate-300" : "text-jvs-muted"}`}>
                            {subtitle}
                        </p>
                    ) : null}
                </motion.div>

                {hasLogos ? (
                    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin justify-start md:justify-center md:flex-wrap">
                        {logos.map((logo, i) => (
                            <motion.div
                                key={`${logo.src}-${i}`}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                                className={`snap-center shrink-0 w-36 h-24 md:w-40 md:h-28 rounded-2xl flex items-center justify-center p-4 border transition-all ${
                                    isDark
                                        ? "bg-white border-white/10 hover:border-jvs-gold/40"
                                        : "bg-jvs-bg-alt border-jvs-border hover:border-jvs-gold/40 hover:shadow-md"
                                }`}
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div
                        className={`rounded-2xl border border-dashed px-6 py-12 text-center ${
                            isDark ? "border-white/20 text-slate-400" : "border-jvs-border text-jvs-muted"
                        }`}
                    >
                        <p className="font-medium mb-1">Logos dos clientes em breve</p>
                        <p className="text-sm opacity-80">
                            Estrutura pronta — basta enviar os arquivos para popular esta vitrine.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
