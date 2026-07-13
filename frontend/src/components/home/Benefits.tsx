"use client";

import { motion } from 'framer-motion';
import { DollarSign, ShieldCheck, Clock, Award } from 'lucide-react';

const benefits = [
    {
        icon: DollarSign,
        title: "Economia Real",
        description: "Reduza até 30% dos seus custos operacionais com uma gestão eficiente e transparente."
    },
    {
        icon: Clock,
        title: "Agilidade",
        description: "Receba propostas detalhadas em menos de 5 minutos, sem burocracia ou espera."
    },
    {
        icon: ShieldCheck,
        title: "Segurança Jurídica",
        description: "Todos os cálculos seguem rigorosamente a legislação trabalhista e convenções coletivas."
    },
    {
        icon: Award,
        title: "Qualidade Garantida",
        description: "Profissionais treinados e monitorados constantemente para garantir a excelência."
    }
];

export default function Benefits() {
    return (
        <section className="py-24 bg-white" id="beneficios">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">Vantagens</span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-text mb-4 tracking-tight">
                        Por que escolher a JVS Facilities?
                    </h2>
                    <p className="text-lg text-jvs-muted leading-relaxed">
                        Entendemos os desafios da gestão de facilities. Nossa plataforma foi desenhada para resolver seus principais problemas.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <motion.div
                                key={index}
                                className="group relative bg-white p-8 rounded-2xl border border-jvs-border overflow-hidden hover:border-jvs-gold/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                            >
                                <span className="pointer-events-none select-none absolute -top-3 -right-1 text-7xl font-black text-jvs-navy/[0.04] group-hover:text-jvs-gold/10 transition-colors">
                                    0{index + 1}
                                </span>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-jvs-navy/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-jvs-navy transition-colors">
                                        <Icon className="w-6 h-6 text-jvs-navy group-hover:text-jvs-gold transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-jvs-text mb-3">{benefit.title}</h3>
                                    <p className="text-jvs-muted leading-relaxed text-sm">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
