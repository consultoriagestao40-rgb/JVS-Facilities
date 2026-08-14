"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, UserCheck, Shield, HardHat } from "lucide-react";

/** Quatro pilares combinados na reunião com o Ádamo */
const services = [
    {
        icon: Sparkles,
        title: "Limpeza e Conservação",
        description: "Equipes treinadas para limpeza técnica, hospitalar, industrial e comercial.",
        image: "/images/home/servico-limpeza.jpg",
    },
    {
        icon: UserCheck,
        title: "Recepção",
        description: "Profissionais qualificados para o primeiro contato com o público da sua operação.",
        image: "/images/home/servico-recepcao.jpg",
    },
    {
        icon: Shield,
        title: "Portaria e Controle de Acesso",
        description: "Controle de acesso e vigilância patrimonial preventiva para ambientes corporativos.",
        image: "/images/home/servico-seguranca.jpg",
    },
    {
        icon: HardHat,
        title: "Manutenção Predial",
        description: "Elétrica, hidráulica, automação e pequenas obras — o suporte técnico do seu prédio.",
        image: "/images/home/servico-manutencao.jpg",
    },
];

export default function ServicesFourPillars() {
    return (
        <section className="py-20 md:py-24 bg-jvs-bg-alt" id="servicos">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-14"
                >
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">
                        O que fazemos
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-navy tracking-tight mb-4">
                        Quatro pilares de facilities B2B
                    </h2>
                    <p className="text-jvs-muted leading-relaxed text-lg">
                        Serviços que mais atendemos hoje em indústrias, hospitais e grandes varejos.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={service.title}
                                className="group relative bg-white rounded-2xl overflow-hidden border border-jvs-border hover:border-jvs-gold/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-jvs-navy/80 via-jvs-navy/10 to-transparent" />
                                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <Icon className="w-6 h-6 text-jvs-navy" />
                                    </div>
                                </div>
                                <div className="relative z-10 p-6">
                                    <h3 className="text-lg font-bold text-jvs-text mb-2">{service.title}</h3>
                                    <p className="text-jvs-muted text-sm leading-relaxed mb-4">{service.description}</p>
                                    <Link
                                        href="/simulador"
                                        className="inline-flex items-center text-sm font-bold text-jvs-navy hover:text-jvs-gold transition-colors"
                                    >
                                        Simular custo{" "}
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
