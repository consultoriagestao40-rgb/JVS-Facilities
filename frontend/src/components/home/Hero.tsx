"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import * as gtag from '@/lib/gtag';

export default function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/30 blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-secondary/20 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center gap-12">

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                            Você não contrata mão de obra. <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Você contrata método e padrão de entrega.
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 max-w-2xl mx-auto md:mx-0 leading-relaxed mb-8">
                            Facilities B2B com governança por criticidade, rastreabilidade digital e gestão preditiva — para reduzir risco operacional e garantir execução do programado ao realizado.
                        </p>

                        {/* Prova / Badges */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
                            {[
                                "Retorno em até 1h útil",
                                "Reposição de posto em até 2h",
                                "Checklist ≥ 85%",
                                "SLA ≥ 80%"
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>{badge}</span>
                                </div>
                            ))}
                        </div>

                        {/* Segmentos */}
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-8">
                            Atendemos Curitiba e Região Metropolitana • Hospitais • Indústrias • Varejo • Condomínios corporativos
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link
                                href="/simulador"
                                className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                            >
                                Simular proposta em 5 minutos
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <a
                                href="https://wa.me/5541992252968?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20de%20facilities."
                                target="_blank"
                                onClick={() => gtag.reportConversion()}
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                            >
                                Agendar diagnóstico no WhatsApp
                            </a>
                        </div>

                        {/* Microcopy */}
                        <p className="text-xs text-slate-500 mt-4 flex items-center gap-2 justify-center md:justify-start">
                            <span>Sem compromisso</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                            <span>Diagnóstico rápido</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                            <span>Evidências e relatórios mensais</span>
                        </p>
                    </motion.div>
                </div>

                {/* Hero Visual / Illustration */}
                <motion.div
                    className="flex-1 w-full max-w-[600px] relative hidden md:block"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative z-10 bg-slate-800 rounded-2xl border border-slate-700 p-2 shadow-2xl skew-y-[-2deg] hover:skew-y-0 transition-transform duration-500">
                        <div className="rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                            {/* Abstract UI Representation of the Simulator */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="h-4 w-1/3 bg-slate-600 rounded"></div>
                                    <div className="h-8 w-24 bg-primary/20 rounded-lg border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">R$ 12.500/mês</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                                        <div className="h-8 w-8 bg-blue-500/20 rounded mb-2"></div>
                                        <div className="h-3 w-2/3 bg-slate-600 rounded mb-1"></div>
                                        <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                                    </div>
                                    <div className="h-24 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                                        <div className="h-8 w-8 bg-purple-500/20 rounded mb-2"></div>
                                        <div className="h-3 w-2/3 bg-slate-600 rounded mb-1"></div>
                                        <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                                    </div>
                                    <div className="h-24 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                                        <div className="h-8 w-8 bg-green-500/20 rounded mb-2"></div>
                                        <div className="h-3 w-2/3 bg-slate-600 rounded mb-1"></div>
                                        <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                                    </div>
                                    <div className="h-24 bg-slate-700/50 rounded-lg p-3 border border-slate-600 flex items-center justify-center">
                                        <div className="text-slate-500 text-xs">+ Adicionar</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -bottom-10 -left-10 bg-white text-slate-900 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                        <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-500">Economia estimada</div>
                            <div className="text-lg font-bold">15% a 30%</div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
