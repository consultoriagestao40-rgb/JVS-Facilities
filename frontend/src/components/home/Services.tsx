"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Building2, UserCheck, Shield, Shovel, HardHat } from 'lucide-react';

const services = [
    {
        icon: Sparkles,
        title: "Limpeza e Conservação",
        description: "Equipes treinadas para limpeza técnica, hospitalar e comercial.",
        slug: "limpeza",
        image: "/images/home/servico-limpeza.jpg"
    },
    {
        icon: UserCheck,
        title: "Recepção e Portaria",
        description: "Profissionais qualificados para o primeiro contato com seu público.",
        slug: "recepcao",
        image: "/images/home/servico-recepcao.jpg"
    },
    {
        icon: Shield,
        title: "Segurança Desarmada",
        description: "Controle de acesso e vigilância patrimonial preventiva.",
        slug: "seguranca",
        image: "/images/home/servico-seguranca.jpg"
    },
    {
        icon: Shovel,
        title: "Jardinagem",
        description: "Manutenção de áreas verdes, poda e paisagismo corporativo.",
        slug: "jardinagem",
        image: "/images/home/servico-jardinagem.jpg"
    },
    {
        icon: HardHat,
        title: "Manutenção Predial",
        description: "Gestão preventiva e corretiva de instalações elétricas e hidráulicas.",
        slug: "manutencao",
        image: "/images/home/servico-manutencao.jpg"
    },
    {
        icon: Building2,
        title: "Facilities Management",
        description: "Gestão integrada de todos os serviços do seu condomínio ou empresa.",
        slug: "facilities",
        image: "/images/home/servico-facilities.jpg"
    }
];

export default function Services() {
    return (
        <section className="py-24 bg-jvs-bg-alt" id="servicos">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-12"
                >
                    <div className="max-w-2xl">
                        <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-2 block">Nossos Serviços</span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-text tracking-tight">
                            Soluções completas para sua empresa
                        </h2>
                    </div>
                    <Link
                        href="/simulador"
                        className="hidden md:flex items-center gap-2 text-jvs-navy font-bold hover:text-jvs-gold transition-colors mt-4 md:mt-0"
                    >
                        Ver todos os serviços <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={index}
                                className="group relative bg-white rounded-2xl overflow-hidden border border-jvs-border hover:border-jvs-gold/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: 'easeOut' }}
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

                                <div className="relative z-10 p-8">
                                    <h3 className="text-xl font-bold text-jvs-text mb-3">{service.title}</h3>
                                    <p className="text-jvs-muted mb-6 min-h-[48px] text-sm leading-relaxed">
                                        {service.description}
                                    </p>

                                    <Link
                                        href="/simulador"
                                        className="inline-flex items-center text-sm font-bold text-jvs-navy hover:text-jvs-gold transition-colors"
                                    >
                                        Simular custo agora <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/simulador"
                        className="inline-flex items-center gap-2 text-jvs-navy font-bold hover:text-jvs-gold transition-colors"
                    >
                        Ver todos os serviços <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
