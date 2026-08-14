"use client";

import { motion } from "framer-motion";
import {
    Factory,
    Hospital,
    Store,
    Building2,
} from "lucide-react";

const segments = [
    { icon: Factory, title: "Indústrias" },
    { icon: Hospital, title: "Hospitais" },
    { icon: Store, title: "Shoppings e varejo" },
    { icon: Building2, title: "Condomínios e corporativo" },
];

export default function SegmentsAltura() {
    return (
        <section className="py-14 md:py-16 bg-white border-b border-jvs-border">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-2 block">
                        Onde atuamos
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-jvs-navy tracking-tight">
                        Especialistas em altura onde a homologação importa
                    </h2>
                    <p className="text-jvs-muted mt-3 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Documentação em dia para operar dentro de grandes clientes — indústria, hospital,
                        shopping e condomínio.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {segments.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                className="flex flex-col items-center gap-3 rounded-2xl border border-jvs-border bg-jvs-bg-alt px-4 py-6 text-center"
                            >
                                <div className="w-11 h-11 rounded-xl bg-jvs-navy/5 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-jvs-navy" />
                                </div>
                                <span className="text-sm font-bold text-jvs-navy">{item.title}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
