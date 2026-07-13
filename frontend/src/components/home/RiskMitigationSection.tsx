"use client";

import { motion } from 'framer-motion';
import { FileCheck, ShieldPlus, MonitorCheck, Leaf } from 'lucide-react';

const items = [
    {
        icon: FileCheck,
        title: 'Transparência Documental',
        description: 'Blindagem jurídica com o envio mensal e proativo de todos os impostos, encargos sociais e notas fiscais.',
    },
    {
        icon: ShieldPlus,
        title: 'Continuidade Operacional',
        description: 'Plantão, supervisão e reserva 24h. Plano estruturado e imediato para cobertura de faltas, férias e greves.',
    },
    {
        icon: MonitorCheck,
        title: 'Controle Online',
        description: 'Monitoramento contínuo de turnover e absenteísmo via dashboards integrados.',
    },
    {
        icon: Leaf,
        title: 'Padronização Técnica',
        description: 'Treinamento rigoroso para manuseio e descarte ecológico de insumos químicos.',
    },
];

export default function RiskMitigationSection() {
    return (
        <section className="py-24 bg-jvs-bg-alt">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">Compliance & Mitigação de Riscos</span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-text mb-4 tracking-tight">
                        Menos risco jurídico, mais continuidade
                    </h2>
                    <p className="text-lg text-jvs-muted leading-relaxed">
                        Governança que protege o seu contrato: documentação em dia, cobertura garantida e controle contínuo da operação.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                                className="group relative bg-white p-8 rounded-2xl border border-jvs-border overflow-hidden hover:border-jvs-gold/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-jvs-navy/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-jvs-navy transition-colors">
                                    <Icon className="w-6 h-6 text-jvs-navy group-hover:text-jvs-gold transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-jvs-text mb-3 leading-snug">{item.title}</h3>
                                <p className="text-jvs-muted leading-relaxed text-sm">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
