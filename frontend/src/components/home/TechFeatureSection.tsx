"use client";

import { motion } from 'framer-motion';
import {
    Cpu,
    ClipboardCheck,
    MessageCircle,
    Activity,
    Camera,
    CheckCircle2,
    AlertTriangle,
    Fingerprint,
} from 'lucide-react';

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' as const },
};

/* Mockup ilustrativo do NEXUS (placeholder — substituível por screenshot real do produto) */
function NexusMockup() {
    return (
        <div className="relative rounded-2xl bg-jvs-navy-light/40 border border-white/10 p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-jvs-gold/15 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-jvs-gold" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white leading-tight">NEXUS · Mesa de Operações</div>
                        <div className="text-[11px] text-slate-400">Monitoramento por IA</div>
                    </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    AO VIVO
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                    { label: 'Postos', value: '112' },
                    { label: 'Presentes', value: '109' },
                    { label: 'Alertas', value: '03' },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                        <div className="text-xl font-bold text-white leading-none">{kpi.value}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{kpi.label}</div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl bg-[#0b3d2e]/60 border border-emerald-500/30 p-3 flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                    <div className="text-xs font-bold text-white">Notificação enviada via WhatsApp</div>
                    <div className="text-[11px] text-slate-300 leading-snug">Falta detectada · Posto 07 — reposição já acionada.</div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Fingerprint className="w-3.5 h-3.5 text-jvs-gold" />
                Integração ativa com Secullum (ponto digital)
            </div>
        </div>
    );
}

/* Mockup ilustrativo do Check-list Fácil (placeholder — substituível por screenshot real) */
function ChecklistMockup() {
    return (
        <div className="relative rounded-2xl bg-jvs-navy-light/40 border border-white/10 p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-jvs-gold/15 flex items-center justify-center">
                        <ClipboardCheck className="w-5 h-5 text-jvs-gold" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white leading-tight">Check-list Fácil</div>
                        <div className="text-[11px] text-slate-400">Auditoria in loco · Turno A</div>
                    </div>
                </div>
                <span className="text-[11px] font-bold text-jvs-gold">SLA 94%</span>
            </div>

            <div className="space-y-2.5 mb-4">
                {[
                    { label: 'Higienização de banheiros', done: true },
                    { label: 'Reposição de insumos', done: true },
                    { label: 'Tratamento de piso — Setor B', done: false },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                        {item.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-jvs-gold shrink-0" />
                        )}
                        <span className={`text-xs ${item.done ? 'text-slate-300' : 'text-white font-medium'}`}>{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="flex-1 aspect-video rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-slate-400" />
                    </div>
                ))}
            </div>

            <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Ações corretivas concluídas</span>
                    <span className="text-white font-bold">18/20</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-gold" style={{ width: '90%' }} />
                </div>
            </div>
        </div>
    );
}

const blocks = [
    {
        eyebrow: 'NEXUS',
        icon: Cpu,
        title: 'Mesa de operações monitorada por IA',
        description:
            'Integração direta com o Secullum (ponto digital) e notificações automatizadas via WhatsApp sobre faltas e não conformidades já na entrada dos turnos.',
        highlights: [
            { icon: Activity, text: 'Monitoramento inteligente em tempo real' },
            { icon: Fingerprint, text: 'Ponto digital integrado ao Secullum' },
            { icon: MessageCircle, text: 'Alertas automáticos via WhatsApp' },
        ],
        mockup: <NexusMockup />,
    },
    {
        eyebrow: 'Check-list Fácil',
        icon: ClipboardCheck,
        title: 'Auditorias in loco padronizadas e rastreáveis',
        description:
            'Registros fotográficos, monitoramento de SLA e acompanhamento de ações corretivas em tempo real — com evidência do programado ao realizado.',
        highlights: [
            { icon: Camera, text: 'Registros fotográficos por rotina' },
            { icon: Activity, text: 'Monitoramento de SLA por posto' },
            { icon: CheckCircle2, text: 'Ações corretivas acompanhadas em tempo real' },
        ],
        mockup: <ChecklistMockup />,
    },
];

export default function TechFeatureSection() {
    return (
        <section className="relative bg-gradient-hero text-white overflow-hidden py-24">
            <div className="absolute top-1/3 -left-32 w-96 h-96 bg-jvs-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">Tecnologia & Controle</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight">
                        Gestão Operacional <span className="text-jvs-gold">Data-Driven</span> e em Tempo Real
                    </h2>
                </motion.div>

                <div className="space-y-16 lg:space-y-24">
                    {blocks.map((block, index) => {
                        const Icon = block.icon;
                        const reversed = index % 2 === 1;
                        return (
                            <div
                                key={index}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: reversed ? 30 : -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className={reversed ? 'lg:order-2' : ''}
                                >
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-5">
                                        <Icon className="w-4 h-4 text-jvs-gold" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-jvs-gold">{block.eyebrow}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 tracking-tight">
                                        {block.title}
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed mb-6 max-w-xl">
                                        {block.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {block.highlights.map((h, i) => {
                                            const HIcon = h.icon;
                                            return (
                                                <li key={i} className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-jvs-gold/10 flex items-center justify-center shrink-0">
                                                        <HIcon className="w-4 h-4 text-jvs-gold" />
                                                    </div>
                                                    <span className="text-sm text-slate-200">{h.text}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                                    className={reversed ? 'lg:order-1' : ''}
                                >
                                    {block.mockup}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
