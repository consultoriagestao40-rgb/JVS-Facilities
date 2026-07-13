"use client";

import { motion } from 'framer-motion';
import { ClipboardList, Clock, ShieldCheck, HardHat, FileText } from 'lucide-react';

const PlaybookSection = () => {
    const cards = [
        {
            icon: Clock,
            title: "PIC: Implantação Premium em 30 dias",
            bullets: [
                "Kickoff executivo e alinhamento de expectativas",
                "Auditoria intensiva na semana 1",
                "Termo de aceite e plano de melhoria contínua"
            ]
        },
        {
            icon: ClipboardList,
            title: "Checklists digitais (programado x realizado)",
            bullets: [
                "Rotinas por área, turno e criticidade",
                "Evidências: foto, horário e responsável",
                "Auditoria de conformidade e não conformidades"
            ]
        },
        {
            icon: FileText,
            title: "SLA + relatório mensal automático",
            bullets: [
                "KPIs de qualidade, pessoas e atendimento",
                "Plano de ação com prazos e responsáveis",
                "Leitura executiva: 1 minuto (visão gerencial)"
            ]
        },
        {
            icon: Clock,
            title: "Ponto online + cobertura preditiva de faltas",
            bullets: [
                "Controle de presença e escalas em tempo real",
                "Banco de cobertura e acionamento rápido",
                "Redução de riscos operacionais por absenteísmo"
            ]
        },
        {
            icon: HardHat,
            title: "Uniformes, EPIs e compliance",
            bullets: [
                "Padrão visual e postura profissional",
                "Controle de entrega e reposição de EPIs",
                "Documentação legal e rastreabilidade contratual"
            ]
        },
        {
            icon: ShieldCheck,
            title: "Governança com visitas executivas",
            bullets: [
                "Supervisor: checklist semanal ou quinzenal",
                "Gerente: visita preventiva mensal/quinzenal",
                "Diretor: relacionamento por categoria de cliente"
            ]
        }
    ];

    return (
        <section id="playbook" className="py-24 bg-jvs-bg-alt">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
                    >
                        <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">Nosso Método</span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-jvs-text mb-4 tracking-tight">
                            Como garantimos um padrão acima do mercado
                        </h2>
                        <p className="text-lg text-jvs-muted leading-relaxed">
                            Método operacional com gestão preditiva, rastreabilidade digital e governança executiva — do programado ao realizado.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border border-jvs-border">
                            <img
                                src="/images/home/playbook-audit.jpg"
                                alt="Auditoria de checklist digital em campo pela equipe JVS"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-jvs-navy/50 via-transparent to-transparent" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-jvs-border flex items-center gap-3">
                            <div className="bg-jvs-gold/10 p-2 rounded-full">
                                <ShieldCheck className="w-6 h-6 text-jvs-gold" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-jvs-muted">Conformidade média</div>
                                <div className="text-lg font-bold text-jvs-text">≥ 85%</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: 'easeOut' }}
                                className="group relative bg-white p-8 rounded-2xl border border-jvs-border overflow-hidden hover:border-jvs-gold/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                            >
                                <span className="pointer-events-none select-none absolute -top-3 -right-1 text-7xl font-black text-jvs-navy/[0.04] group-hover:text-jvs-gold/10 transition-colors">
                                    0{index + 1}
                                </span>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-14 h-14 bg-jvs-navy/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-jvs-navy transition-colors">
                                        <Icon className="w-6 h-6 text-jvs-navy group-hover:text-jvs-gold transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-jvs-text mb-4 leading-snug">
                                        {card.title}
                                    </h3>
                                    <ul className="space-y-3 flex-1">
                                        {card.bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-start gap-3 text-jvs-muted text-sm leading-relaxed">
                                                <div className="mt-1.5 min-w-[6px] min-h-[6px] rounded-full bg-jvs-gold shrink-0" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Microprova */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <p className="text-xl md:text-2xl font-medium text-jvs-text italic max-w-3xl mx-auto leading-relaxed">
                        "Facilities premium não é promessa: é método, governança e evidência de execução."
                    </p>
                </motion.div>

                {/* CTA */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <a
                        href="/simulador"
                        className="w-full md:w-auto bg-gradient-gold text-jvs-navy font-bold text-lg px-8 py-4 rounded-full shadow-xl shadow-jvs-navy/10 transition-all hover:scale-[1.02] text-center"
                    >
                        Simular minha operação agora
                    </a>
                    <a
                        href="https://wa.me/5541992252968"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto bg-white hover:bg-jvs-bg-alt text-jvs-text font-bold text-lg px-8 py-4 rounded-full border border-jvs-border transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Falar com um especialista</span>
                    </a>
                </div>
                <p className="text-center text-sm text-jvs-muted mt-4">
                    Atendemos Curitiba e Região Metropolitana.
                </p>
            </div>
        </section>
    );
};

export default PlaybookSection;
