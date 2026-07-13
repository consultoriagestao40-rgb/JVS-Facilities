"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CalendarDays, Building2, Users, ArrowUpCircle, Layers } from 'lucide-react';

const stats = [
    { icon: CalendarDays, target: 30, prefix: '+', suffix: '', unit: 'Anos', label: 'Atuação em Facilities' },
    { icon: Building2, target: 100, prefix: '+', suffix: '', unit: 'Postos', label: 'Ativos' },
    { icon: Users, target: 200, prefix: '+', suffix: '', unit: 'Clientes', label: 'Atendidos' },
    { icon: ArrowUpCircle, target: 100, prefix: '+', suffix: 'k', unit: 'm²', label: 'Limpeza em altura executada' },
    { icon: Layers, target: 500, prefix: '+', suffix: 'k', unit: 'm²', label: 'Pisos tratados' },
];

function Counter({ target, inView, duration = 1600 }: { target: number; inView: boolean; duration?: number }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, target, duration]);

    return <>{value}</>;
}

export default function StatsSection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="relative bg-gradient-hero text-white overflow-hidden py-20 md:py-24">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-jvs-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-jvs-gold/5 rounded-full blur-[90px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-14"
                >
                    <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">Números que sustentam a operação</span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
                        Escala e experiência comprovadas em campo
                    </h2>
                </motion.div>

                <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                                className="text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-jvs-gold" />
                                </div>
                                <div className="flex items-baseline justify-center gap-1 font-heading font-bold leading-none">
                                    <span className="text-4xl md:text-5xl text-white">
                                        {stat.prefix}
                                        <Counter target={stat.target} inView={inView} />
                                        {stat.suffix}
                                    </span>
                                    <span className="text-xl md:text-2xl text-jvs-gold">{stat.unit}</span>
                                </div>
                                <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-[12rem] mx-auto">
                                    {stat.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
