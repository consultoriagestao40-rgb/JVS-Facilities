"use client";

import { motion } from "framer-motion";
import { Factory, Hospital, Store } from "lucide-react";

const segments = [
    {
        icon: Factory,
        title: "Indústrias",
        description: "Operações contínuas com exigência de cobertura, manutenção e conformidade.",
    },
    {
        icon: Hospital,
        title: "Hospitais",
        description: "Ambientes críticos com padrão técnico, rastreabilidade e resposta rápida.",
    },
    {
        icon: Store,
        title: "Grandes varejos",
        description: "Alto fluxo, padronização de marca e continuidade operacional em rede.",
    },
];

export default function SegmentsB2B() {
    return (
        <section className="py-16 md:py-20 bg-jvs-bg-alt" id="segmentos">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">
                        Quem atendemos
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-navy tracking-tight mb-4">
                        Especialistas em facilities para indústrias, hospitais e grandes varejos
                    </h2>
                    <p className="text-jvs-muted leading-relaxed text-lg">
                        É nesse público que a JVS entrega mais valor — e é nele que focamos a operação.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {segments.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="bg-white rounded-2xl border border-jvs-border p-8 text-center hover:border-jvs-gold/40 hover:shadow-lg transition-all"
                            >
                                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-jvs-navy/5 flex items-center justify-center">
                                    <Icon className="w-7 h-7 text-jvs-navy" />
                                </div>
                                <h3 className="text-xl font-bold text-jvs-navy mb-2">{item.title}</h3>
                                <p className="text-sm text-jvs-muted leading-relaxed">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
