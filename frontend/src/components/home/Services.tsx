"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Building2, UserCheck, Shield, Shovel, HardHat } from 'lucide-react';

const services = [
    {
        icon: Sparkles,
        title: "Limpeza e Conservação",
        description: "Equipes treinadas para limpeza técnica, hospitalar e comercial.",
        slug: "limpeza"
    },
    {
        icon: UserCheck,
        title: "Recepção e Portaria",
        description: "Profissionais qualificados para o primeiro contato com seu público.",
        slug: "recepcao"
    },
    {
        icon: Shield,
        title: "Segurança Desarmada",
        description: "Controle de acesso e vigilância patrimonial preventiva.",
        slug: "seguranca"
    },
    {
        icon: Shovel,
        title: "Jardinagem",
        description: "Manutenção de áreas verdes, poda e paisagismo corporativo.",
        slug: "jardinagem"
    },
    {
        icon: HardHat,
        title: "Manutenção Predial",
        description: "Gestão preventiva e corretiva de instalações elétricas e hidráulicas.",
        slug: "manutencao"
    },
    {
        icon: Building2,
        title: "Facilities Management",
        description: "Gestão integrada de todos os serviços do seu condomínio ou empresa.",
        slug: "facilities"
    }
];

export default function Services() {
    return (
        <section className="py-20 bg-gray-50 bg-pattern-grid" id="servicos">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Nossos Serviços</span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                            Soluções completas para sua empresa
                        </h2>
                    </div>
                    <Link
                        href="/simulador"
                        className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-green-700 transition-colors mt-4 md:mt-0"
                    >
                        Ver todos os serviços <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <service.icon className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                            <p className="text-gray-500 mb-6 min-h-[48px]">
                                {service.description}
                            </p>

                            <Link
                                href="/simulador"
                                className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-primary transition-colors"
                            >
                                Simular custo agora <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/simulador"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:text-green-700 transition-colors"
                    >
                        Ver todos os serviços <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
