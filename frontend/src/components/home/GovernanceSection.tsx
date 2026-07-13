"use client";

import { CheckCircle2, Shield, Gem, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import WhatsAppModal from './WhatsAppModal';

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' as const },
};

const GovernanceSection = () => {
    const [modalState, setModalState] = useState<{ isOpen: boolean, tier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE" | null }>({
        isOpen: false,
        tier: null
    });

    const handleOpenModal = (tier: string) => {
        setModalState({ isOpen: true, tier: tier as any });
    };

    const plans = [
        {
            tier: "BRONZE",
            icon: Award,
            badgeColor: "bg-jvs-bg-alt text-jvs-muted border-jvs-border",
            title: "Essencial controlado",
            target: "Operações simples e baixo risco.",
            bullets: [
                "Supervisor: visita quinzenal com checklist",
                "Gerente: visita mensal (preventiva)",
                "Relatório mensal: versão enxuta + plano de ação",
                "Compliance e padrão: uniforme, EPI e documentação"
            ],
            cta: "Simular meu cenário",
            href: "/simulador",
            highlight: false,
            isSimulator: true,
            ctaClass: "bg-jvs-navy/5 hover:bg-jvs-navy/10 text-jvs-navy border border-jvs-navy/10"
        },
        {
            tier: "PRATA",
            icon: Shield,
            badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
            title: "Estabilidade e performance",
            target: "Operações com fluxo moderado e risco médio.",
            bullets: [
                "Supervisor: visita semanal ou quinzenal (criticidade)",
                "Gerente: contato/visita quinzenal com pauta e ata",
                "Relatório mensal completo: KPIs + plano de ação",
                "Auditoria de conformidade e correções rápidas"
            ],
            cta: "Falar com especialista",
            highlight: false,
            isSimulator: false,
            ctaClass: "bg-jvs-bg-alt hover:bg-jvs-border/60 text-jvs-text border border-jvs-border"
        },
        {
            tier: "OURO",
            icon: Star,
            subtitle: "Mais escolhido",
            badgeColor: "bg-jvs-gold/15 text-jvs-navy border-jvs-gold/40",
            title: "Governança preditiva",
            target: "Ambientes exigentes, auditáveis ou alto fluxo.",
            bullets: [
                "Supervisor: auditoria semanal e gestão de desvios",
                "Gerente: visita mensal + contato quinzenal preditivo",
                "Relatório mensal automático: página executiva + evidências",
                "Acompanhamento antes da reclamação do cliente"
            ],
            cta: "Agendar diagnóstico",
            highlight: true,
            highlightText: "Mais escolhido",
            ringColor: "ring-2 ring-jvs-gold",
            pillClass: "bg-jvs-gold text-jvs-navy",
            isSimulator: false,
            ctaClass: "bg-gradient-gold text-jvs-navy shadow-lg shadow-jvs-navy/10 hover:scale-[1.02]"
        },
        {
            tier: "DIAMANTE",
            icon: Gem,
            subtitle: "Operação crítica",
            badgeColor: "bg-jvs-navy/10 text-jvs-navy border-jvs-navy/20",
            title: "Continuidade operacional",
            target: "Hospitais, áreas críticas e risco elevado.",
            bullets: [
                "Supervisor: semanal (ou mais, por criticidade)",
                "Gerente: visita quinzenal + canal prioritário",
                "Diretor: visita mensal (relacionamento e governança)",
                "Evidência e rastreabilidade máxima (programado x realizado)"
            ],
            cta: "Atendimento prioritário",
            highlight: true,
            highlightText: "Máxima criticidade",
            ringColor: "ring-2 ring-jvs-navy",
            pillClass: "bg-jvs-navy text-white",
            isSimulator: false,
            ctaClass: "bg-jvs-navy hover:bg-jvs-navy-light text-white shadow-lg shadow-jvs-navy/20 hover:scale-[1.02]"
        }
    ];

    const standards = [
        "Primeiro atendimento (retorno): até 1 hora útil",
        "Reposição de posto (cobertura de faltas): até 2 horas",
        "SLA de conformidade operacional: ≥ 80%",
        "Conformidade de checklist (programado x realizado): ≥ 85%",
        "Gestão com ponto focal: gerente como canal prioritário"
    ];

    return (
        <section className="py-24 bg-white" id="governanca">
            <div className="container mx-auto px-4">

                {/* Section 1: Header */}
                <motion.div {...fadeUp} className="text-center max-w-4xl mx-auto mb-16">
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">Governança por Criticidade</span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-text mb-4 tracking-tight">
                        Escolha o nível de governança ideal para sua operação
                    </h2>
                    <h3 className="text-xl text-jvs-muted mb-6 leading-relaxed">
                        Você não contrata apenas mão de obra: contrata método, rastreabilidade e gestão preditiva. <br className="hidden md:block" />
                        O nível de governança varia conforme a criticidade do ambiente.
                    </h3>
                    <p className="text-sm text-jvs-muted font-medium bg-jvs-bg-alt inline-block px-4 py-2 rounded-full border border-jvs-border">
                        Recomendado para: Hospitais, Indústrias, Varejo e Condomínios Corporativos em Curitiba e Região Metropolitana.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 items-start">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                                className={`relative bg-white rounded-2xl p-6 transition-all duration-300 flex flex-col h-full
                                    ${plan.highlight ? `shadow-xl scale-105 z-10 ${plan.ringColor}` : 'border border-jvs-border shadow-sm hover:shadow-lg hover:-translate-y-1'}
                                `}
                            >
                                {plan.highlight && (
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm ${plan.pillClass}`}>
                                        {plan.highlightText}
                                    </div>
                                )}

                                <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full w-fit mb-4 border ${plan.badgeColor}`}>
                                    <Icon className="w-3.5 h-3.5" />
                                    {plan.tier}
                                </div>

                                <h4 className="text-lg font-bold text-jvs-text mb-2 leading-tight">
                                    {plan.title}
                                </h4>

                                <p className="text-sm text-jvs-muted mb-6 min-h-[40px] leading-relaxed">
                                    <span className="font-semibold text-jvs-text">Indicado para:</span> {plan.target}
                                </p>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.bullets.map((bullet, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-jvs-muted leading-relaxed">
                                            <CheckCircle2 className="w-4 h-4 text-jvs-gold mt-0.5 shrink-0" />
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    {plan.isSimulator ? (
                                        <Link
                                            href={plan.href || "/simulador"}
                                            className={`block w-full text-center py-3 rounded-full font-bold text-sm transition-all ${plan.ctaClass}`}
                                        >
                                            {plan.cta}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => handleOpenModal(plan.tier)}
                                            className={`block w-full text-center py-3 rounded-full font-bold text-sm transition-all ${plan.ctaClass}`}
                                        >
                                            {plan.cta}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Section 2: Minimum Standards */}
                <motion.div
                    {...fadeUp}
                    className="relative bg-gradient-hero text-white rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
                >
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-jvs-gold/10 rounded-full blur-[90px] pointer-events-none"></div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3 tracking-tight">
                                Padrões mínimos garantidos (mensuráveis e reportados)
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                Tudo que prometemos é acompanhado por checklist digital, evidências e relatório mensal.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                            {standards.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                    <Shield className="w-5 h-5 text-jvs-gold shrink-0 mt-0.5" />
                                    <span className="text-slate-200 font-medium text-sm leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-xs text-slate-400 mb-8">
                            Obs.: Atendimento = retorno inicial. Resolução varia por tipo de ocorrência e escopo.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <Link
                                href="/simulador"
                                className="bg-gradient-gold text-jvs-navy font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-all hover:scale-[1.02] w-full md:w-auto text-center"
                            >
                                Simular minha operação agora
                            </Link>
                            <button
                                onClick={() => handleOpenModal("GERAL")}
                                className="bg-white/5 hover:bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-full border border-white/15 transition-colors w-full md:w-auto text-center flex items-center justify-center gap-2"
                            >
                                <span>Chamar no WhatsApp</span>
                            </button>
                        </div>
                        <p className="text-center text-sm text-slate-400 mt-4">
                            Diagnóstico rápido e proposta com governança por criticidade.
                        </p>
                    </div>
                </motion.div>

                <WhatsAppModal
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState({ ...modalState, isOpen: false })}
                    tier={modalState.tier}
                />

            </div>
        </section>
    );
};

export default GovernanceSection;
