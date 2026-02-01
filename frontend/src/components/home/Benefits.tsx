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
        <section className="py-20 bg-white" id="beneficios">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                        Por que escolher a JVS Facilities?
                    </h2>
                    <p className="text-lg text-gray-600">
                        Entendemos os desafios da gestão de facilities. Nossa plataforma foi desenhada para resolver seus principais problemas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <benefit.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
