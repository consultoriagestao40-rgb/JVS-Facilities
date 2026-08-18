"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import * as gtag from "@/lib/gtag";
import BrandSeal from "@/components/v2/BrandSeal";

export default function HeroV2() {
    return (
        <section className="relative w-full min-h-[88vh] bg-gradient-hero text-white flex items-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-jvs-gold/10 blur-[130px]" />
                <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-jvs-gold/5 blur-[110px]" />
            </div>

            <div className="container mx-auto px-4 z-10 py-20 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="mb-8 flex justify-center md:justify-start">
                            <BrandSeal variant="white" />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] mb-6 tracking-tight">
                            Facilities B2B com padrão de entrega.{" "}
                            <span className="text-jvs-gold">Para quem não pode parar.</span>
                        </h1>

                        <p className="text-lg text-slate-300 max-w-2xl mx-auto md:mx-0 leading-relaxed mb-6">
                            Terceirização de limpeza, recepção, portaria e manutenção predial para
                            indústrias, hospitais e grandes varejos em Curitiba e Região Metropolitana.
                        </p>

                        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
                            {["Retorno em até 1h útil", "Reposição de posto em até 2h", "Checklist ≥ 85%", "SLA ≥ 80%"].map(
                                (badge) => (
                                    <div
                                        key={badge}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-jvs-gold/20 text-xs font-semibold text-jvs-gold-light"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span>{badge}</span>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link
                                href="/simulador"
                                className="group relative px-8 py-4 bg-gradient-gold text-jvs-navy font-bold rounded-full shadow-xl shadow-jvs-navy/40 transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-3 text-lg"
                            >
                                Simular proposta em 5 minutos
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="https://wa.me/5541992252968?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20de%20facilities."
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => gtag.reportConversion()}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/15 transition-all flex items-center justify-center gap-2"
                            >
                                Agendar diagnóstico no WhatsApp
                            </a>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="flex-1 w-full max-w-[480px] relative hidden md:block"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                >
                    <div className="relative z-10 rounded-2xl border border-white/10 p-2 shadow-2xl backdrop-blur-sm bg-jvs-navy-light/60">
                        <div className="rounded-xl overflow-hidden aspect-[3/4] relative">
                            <img
                                src="/images/home/hero.jpg"
                                alt="Operação JVS Facilities em ambiente corporativo"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-jvs-navy/70 via-jvs-navy/0 to-transparent" />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -left-6 z-20 bg-white text-jvs-navy p-4 rounded-xl shadow-xl flex items-center gap-3">
                        <div className="bg-jvs-gold/10 p-2 rounded-full">
                            <CheckCircle className="w-6 h-6 text-jvs-gold" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-jvs-muted">Foco B2B</div>
                            <div className="text-sm font-bold">Indústria · Hospital · Varejo</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
