"use client";

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const rows = [
    {
        criterion: 'Gestão de Faltas',
        market: 'Descoberta manual pelo cliente no posto',
        jvs: 'Alerta instantâneo via IA no WhatsApp',
    },
    {
        criterion: 'Cobertura Operacional',
        market: 'Lenta e sem equipe de contingência',
        jvs: 'Supervisão 24h e plano ativo de reposição',
    },
    {
        criterion: 'Auditoria',
        market: 'Fichas de papel sem comprovação',
        jvs: 'Sistema Check-list Fácil com foto e SLA',
    },
    {
        criterion: 'Passivo Trabalhista',
        market: 'Risco alto por falta de envio de guias',
        jvs: 'Envio mensal e proativo de guias quitadas',
    },
];

export default function ComparisonTable() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">Comparativo</span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-text mb-4 tracking-tight">
                        Mercado Tradicional vs. Padrão JVS
                    </h2>
                    <p className="text-lg text-jvs-muted leading-relaxed">
                        A diferença entre terceirizar mão de obra e contratar método, tecnologia e governança.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Desktop / tablet */}
                    <div className="hidden md:grid grid-cols-[1.1fr_1fr_1fr] rounded-2xl border border-jvs-border overflow-hidden shadow-sm">
                        <div className="p-6 bg-jvs-bg-alt" />
                        <div className="p-6 bg-jvs-bg-alt text-center">
                            <span className="text-sm font-bold uppercase tracking-wider text-jvs-muted">Mercado Tradicional</span>
                        </div>
                        <div className="p-6 bg-jvs-navy text-center relative">
                            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-jvs-navy bg-jvs-gold px-3 py-0.5 rounded-full">
                                Recomendado
                            </span>
                            <span className="text-sm font-bold uppercase tracking-wider text-jvs-gold">Padrão JVS</span>
                        </div>

                        {rows.map((row, index) => (
                            <div key={index} className="contents">
                                <div className="p-6 border-t border-jvs-border bg-white flex items-center">
                                    <span className="font-bold text-jvs-text">{row.criterion}</span>
                                </div>
                                <div className="p-6 border-t border-jvs-border bg-white flex items-start gap-3">
                                    <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span className="text-sm text-jvs-muted leading-relaxed">{row.market}</span>
                                </div>
                                <div className="p-6 border-t border-white/10 bg-jvs-navy flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-jvs-gold flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3.5 h-3.5 text-jvs-navy" strokeWidth={3} />
                                    </div>
                                    <span className="text-sm text-white font-medium leading-relaxed">{row.jvs}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-5">
                        {rows.map((row, index) => (
                            <div key={index} className="rounded-2xl border border-jvs-border overflow-hidden shadow-sm">
                                <div className="px-5 py-3 bg-jvs-bg-alt">
                                    <span className="font-bold text-jvs-text">{row.criterion}</span>
                                </div>
                                <div className="p-5 flex items-start gap-3 bg-white border-t border-jvs-border">
                                    <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-jvs-muted mb-0.5">Mercado Tradicional</div>
                                        <span className="text-sm text-jvs-muted leading-relaxed">{row.market}</span>
                                    </div>
                                </div>
                                <div className="p-5 flex items-start gap-3 bg-jvs-navy">
                                    <div className="w-5 h-5 rounded-full bg-jvs-gold flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3.5 h-3.5 text-jvs-navy" strokeWidth={3} />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-jvs-gold mb-0.5">Padrão JVS</div>
                                        <span className="text-sm text-white font-medium leading-relaxed">{row.jvs}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="text-center mt-12">
                    <a
                        href="/simulador"
                        className="inline-block bg-gradient-gold text-jvs-navy font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-jvs-navy/10 transition-all hover:scale-[1.02]"
                    >
                        Quero o padrão JVS
                    </a>
                </div>
            </div>
        </section>
    );
}
