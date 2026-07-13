"use client";

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const stats = [
    { value: "+15", label: "Anos de Experiência" },
    { value: "+500", label: "Colaboradores" },
    { value: "+200", label: "Clientes Ativos" },
    { value: "98%", label: "Taxa de Retenção" },
];

export default function SocialProof() {
    return (
        <section className="py-24 bg-gradient-hero text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] left-[8%] w-[40vw] h-[40vw] rounded-full bg-jvs-gold/10 blur-[110px]" />
                <div className="absolute bottom-[5%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-jvs-gold/5 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">Prova Social</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 tracking-tight leading-tight">
                            Confiança construída com <span className="text-jvs-gold">resultados</span>
                        </h2>
                        <p className="text-slate-300 text-lg mb-10 max-w-lg leading-relaxed">
                            Nosso compromisso com a excelência nos tornou parceiros estratégicos das principais empresas da região.
                        </p>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="border-l-2 border-jvs-gold/40 pl-4">
                                    <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-lg font-bold mb-6 text-center text-slate-300">Empresas que confiam na JVS Facilities</h3>
                        {/* Actual Client Logos */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[
                                "/logos/cliente-1.png",
                                "/logos/cliente-2.png",
                                "/logos/cliente-3.png",
                                "/logos/cliente-4.png",
                                "/logos/cliente-5.png",
                                "/logos/cliente-6.png"
                            ].map((logoUrl, i) => (
                                <div key={i} className="h-16 md:h-20 bg-white rounded-xl flex items-center justify-center p-3 shadow-sm grayscale hover:grayscale-0 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300">
                                    <img
                                        src={logoUrl}
                                        alt={`Cliente ${i + 1}`}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-white/10">
                            <Quote className="w-6 h-6 text-jvs-gold/50 mb-3 mx-auto" />
                            <p className="text-slate-300 italic text-center leading-relaxed">
                                "A JVSServ transformou a gestão do nosso condomínio. Profissionalismo impecável."
                            </p>
                            <div className="mt-5 flex items-center justify-center gap-3">
                                <div className="w-10 h-10 bg-jvs-navy-light border border-jvs-gold/30 rounded-full flex items-center justify-center text-jvs-gold text-xs font-bold">CM</div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">Carlos Mendes</div>
                                    <div className="text-xs text-slate-400">Síndico Profissional</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
