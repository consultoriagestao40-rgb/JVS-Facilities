"use client";

import { motion } from 'framer-motion';

const stats = [
    { value: "+15", label: "Anos de Experiência" },
    { value: "+500", label: "Colaboradores" },
    { value: "+200", label: "Clientes Ativos" },
    { value: "98%", label: "Taxa de Retenção" },
];

export default function SocialProof() {
    return (
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/40 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                            Confiança construída com <span className="text-primary">resultados</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg">
                            Nosso compromisso com a excelência nos tornou parceiros estratégicos das principais empresas da região.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            {stats.map((stat, idx) => (
                                <div key={idx}>
                                    <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-slate-800 rounded-2xl p-8 border border-slate-700"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-bold mb-6 text-center text-gray-300">Empresas que confiam na JVS Facilities</h3>
                        {/* Placeholder Grid for Logos */}
                        <div className="grid grid-cols-3 gap-6 opacity-60">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-16 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600 hover:border-primary/50 hover:bg-slate-600 transition-all cursor-default">
                                    <span className="text-xs font-mono text-gray-500">LOGO {i}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                            <p className="text-gray-400 italic">
                                "A JVSServ transformou a gestão do nosso condomínio. Profissionalismo impecável."
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-3">
                                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">Carlos Mendes</div>
                                    <div className="text-xs text-gray-500">Síndico Profissional</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
