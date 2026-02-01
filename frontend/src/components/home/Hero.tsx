"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-300">Simulador Online v1.0</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-4">
                            Automatize Propostas e <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                                Otimize Custos de Facilities
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                            Gere orçamentos precisos em minutos com nosso simulador inteligente de serviços terceirizados.
                            Reduza custos operacionais com transparência total.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link
                            href="/simulador"
                            className="group relative px-8 py-4 bg-primary hover:bg-green-500 text-white font-bold rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                        >
                            SIMULE AGORA SUA PROPOSTA
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="#como-funciona"
                            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-all flex items-center justify-center"
                        >
                            Como Funciona
                        </Link>
                    </motion.div>

                    <motion.div
                        className="pt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span>Orçamento em 5 min</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span>Sem compromisso</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span>Dados 100% Seguros</span>
                        </div>
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
