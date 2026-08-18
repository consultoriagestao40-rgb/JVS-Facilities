"use client";

import { motion } from "framer-motion";
import { Building2, Clock, ShieldCheck, HardHat } from "lucide-react";

/**
 * Benefits da Home v2 — tom de “carteirada” (reunião 04/08).
 * Sem pitch de plataforma/simulador. A Home original mantém Benefits.tsx.
 */
const benefits = [
    {
        icon: Clock,
        title: "32 anos de operação",
        description:
            "Tempo de mercado que sustenta entrega em operações contínuas — não experimento de fornecedor novo.",
    },
    {
        icon: Building2,
        title: "Foco B2B",
        description:
            "Indústrias, hospitais e grandes varejos. É o público que melhor atendemos e para quem estruturamos a operação.",
    },
    {
        icon: HardHat,
        title: "Quatro pilares de facilities",
        description:
            "Limpeza e conservação, recepção, portaria e manutenção predial — o que mais entregamos no dia a dia.",
    },
    {
        icon: ShieldCheck,
        title: "Resposta em campo",
        description:
            "Retorno em até 1h útil e reposição de posto em até 2h. Indicadores de operação, não discurso de método.",
    },
];

export default function BenefitsV2() {
    return (
        <section className="py-24 bg-white" id="beneficios">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">
                        Por que a JVS
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-text mb-4 tracking-tight">
                        Porte e especialização para quem não pode parar
                    </h2>
                    <p className="text-lg text-jvs-muted leading-relaxed">
                        Quem busca facilities na internet quer saber para quem fazemos, o que fazemos e há
                        quanto tempo. É isso que colocamos em evidência.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <motion.div
                                key={benefit.title}
                                className="group relative bg-white p-8 rounded-2xl border border-jvs-border overflow-hidden hover:border-jvs-gold/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                            >
                                <span className="pointer-events-none select-none absolute -top-3 -right-1 text-7xl font-black text-jvs-navy/[0.04] group-hover:text-jvs-gold/10 transition-colors">
                                    0{index + 1}
                                </span>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-jvs-navy/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-jvs-navy transition-colors">
                                        <Icon className="w-6 h-6 text-jvs-navy group-hover:text-jvs-gold transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-jvs-text mb-3">{benefit.title}</h3>
                                    <p className="text-jvs-muted leading-relaxed text-sm">{benefit.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
