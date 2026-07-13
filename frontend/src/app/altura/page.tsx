"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ArrowUpRight,
    ChevronDown,
    CheckCircle2,
    Shield,
    ShieldCheck,
    Clock,
    FileCheck,
    Star,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';
import * as gtag from '@/lib/gtag';
import PortfolioCarousel from '@/components/altura/PortfolioCarousel';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' as const },
};

export default function AlturaPage() {
    return (
        <main className="min-h-screen bg-jvs-bg-alt font-sans">

            {/* Hero Section */}
            <section className="relative bg-gradient-hero text-white overflow-hidden py-28 md:py-36">
                <div className="absolute inset-0 bg-[url('/bg-altura.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-jvs-navy via-jvs-navy/40 to-transparent"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-jvs-gold/10 rounded-full blur-[110px] pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-jvs-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-jvs-gold/15 text-jvs-gold-light text-sm font-semibold mb-8 border border-jvs-gold/30">
                            <Shield className="w-3.5 h-3.5" />
                            Especialistas em NR-35
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.08] tracking-tight">
                            Limpeza em Altura com <br className="hidden sm:block" />
                            <span className="text-jvs-gold">Excelência e Segurança</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Transforme suas fachadas com os serviços profissionais da JVS Facilities.
                            Equipe certificada com mais de 20 anos de experiência em acesso por corda.
                        </p>
                        <a
                            href="https://wa.me/5541991443657"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-gold text-jvs-navy px-9 py-4 rounded-full font-bold text-lg hover:scale-[1.03] transition-all shadow-xl shadow-jvs-navy/40"
                            onClick={() => gtag.reportConversion()}
                        >
                            <WhatsAppIcon className="w-5 h-5" />
                            Solicitar Orçamento Agora
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </motion.div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block text-slate-400/60 animate-bounce">
                    <ChevronDown className="w-6 h-6" />
                </div>
            </section>

            {/* Stats Bar (floating) */}
            <section className="relative z-20 -mt-16 md:-mt-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        {...fadeUp}
                        className="bg-white rounded-2xl shadow-2xl shadow-jvs-navy/10 border border-jvs-border grid grid-cols-2 md:grid-cols-4 divide-y divide-jvs-border md:divide-y-0 md:divide-x overflow-hidden"
                    >
                        {[
                            { value: '20+', label: 'Anos de Experiência', icon: Clock },
                            { value: '5.000+', label: 'Projetos Realizados', icon: CheckCircle2 },
                            { value: '98%', label: 'Taxa de Satisfação', icon: Star },
                            { value: '0', label: 'Acidentes Relatados', icon: ShieldCheck },
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="flex flex-col items-center justify-center text-center gap-2 py-8 px-4">
                                    <div className="w-10 h-10 rounded-full bg-jvs-gold/10 flex items-center justify-center mb-1">
                                        <Icon className="w-5 h-5 text-jvs-gold" />
                                    </div>
                                    <span className="text-3xl md:text-4xl font-extrabold text-jvs-navy">{stat.value}</span>
                                    <span className="text-xs font-bold text-jvs-muted uppercase tracking-wider">{stat.label}</span>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Soluções Section */}
            <section className="pt-24 pb-20 md:pt-28 md:pb-28 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div {...fadeUp} className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-jvs-navy mb-4 tracking-tight">Nossas Soluções em Altura</h2>
                        <div className="w-16 h-1 bg-jvs-gold mx-auto mb-5 rounded-full"></div>
                        <p className="text-jvs-muted max-w-2xl mx-auto leading-relaxed text-lg">
                            Técnicas especializadas para cada tipo de estrutura, garantindo limpeza profunda sem danificar superfícies.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { n: '01', icon: Shield, title: 'Limpeza de Fachadas', desc: 'Limpeza profissional com técnicas de acesso por corda. Utilizamos produtos que preservam a integridade dos materiais.', image: '/images/altura/solucao-limpeza-fachadas.jpg' },
                            { n: '02', icon: FileCheck, title: 'Lavação de Vidros', desc: 'Resultado cristalino garantido em fachadas de vidro e áreas de difícil acesso com sistemas de segurança rigorosos.', image: '/images/altura/solucao-lavacao-vidros.jpg' },
                            { n: '03', icon: Shield, title: 'Acesso por Corda', desc: 'Técnica especializada com duplo talabarte. Ideal para estruturas de alto risco e áreas de acesso limitado.', image: '/images/altura/solucao-acesso-corda.jpg' },
                            { n: '04', icon: Clock, title: 'Parada de Fábrica', desc: 'Limpeza profunda durante paradas industriais. Equipe treinada para ambientes complexos e confinados.', image: '/images/altura/solucao-parada-fabrica.jpg' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                                    className="group relative bg-white rounded-2xl border border-jvs-border overflow-hidden hover:border-jvs-gold/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-jvs-navy/80 via-jvs-navy/10 to-transparent" />
                                        <span className="absolute top-3 right-3 text-white/70 text-xs font-black tracking-wider">
                                            {item.n}
                                        </span>
                                        <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                            <Icon className="w-6 h-6 text-jvs-navy" />
                                        </div>
                                    </div>
                                    <div className="relative z-10 p-8">
                                        <h3 className="text-xl font-bold text-jvs-navy mb-3">{item.title}</h3>
                                        <p className="text-jvs-muted text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Diferenciais Section */}
            <section className="py-20 md:py-28 bg-jvs-bg-alt">
                <div className="container mx-auto px-4">
                    <motion.div
                        {...fadeUp}
                        className="relative bg-gradient-hero text-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-jvs-gold/10 rounded-full blur-[90px] pointer-events-none"></div>

                        <div className="relative flex flex-col lg:flex-row">
                            {/* Foto de apoio */}
                            <div className="relative lg:w-[38%] h-64 lg:h-auto shrink-0">
                                <img
                                    src="/images/altura/diferenciais.jpg"
                                    alt="Equipe JVS com equipamentos de segurança certificados NR-35"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-jvs-navy via-jvs-navy/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-jvs-navy/20 lg:to-jvs-navy" />
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* Intro */}
                                <div className="relative p-8 md:p-14 md:pb-10">
                                    <span className="text-jvs-gold font-bold tracking-wider uppercase text-sm mb-3 flex items-center gap-1.5">
                                        Por que escolher a JVS?
                                        <ArrowUpRight className="w-4 h-4" />
                                    </span>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 max-w-2xl leading-tight tracking-tight">
                                        Segurança Rigorosa e<br />Qualidade Garantida
                                    </h2>
                                    <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                                        Não arrisque sua responsabilidade civil. Contrate uma empresa que segue 100% das normas de segurança do trabalho.
                                    </p>
                                </div>

                                {/* Lista dividida */}
                                <div className="relative px-8 md:px-14 border-t border-white/10 divide-y divide-white/10">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-7 -mx-4 px-4 rounded-lg hover:bg-white/[0.03] transition-colors">
                                        <div className="flex items-center gap-4 sm:w-1/3 shrink-0">
                                            <div className="w-11 h-11 rounded-full bg-jvs-gold/10 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="text-jvs-gold w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-lg">Certificação NR-35</h4>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed sm:w-2/3">Equipe 100% certificada e atualizada com treinamentos contínuos.</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-7 -mx-4 px-4 rounded-lg hover:bg-white/[0.03] transition-colors">
                                        <div className="flex items-center gap-4 sm:w-1/3 shrink-0">
                                            <div className="w-11 h-11 rounded-full bg-jvs-gold/10 flex items-center justify-center shrink-0">
                                                <Shield className="text-jvs-gold w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-lg">Seguro de Responsabilidade</h4>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <p className="text-slate-300 text-sm leading-relaxed mb-2">Cobertura completa contra acidentes e danos durante toda a operação.</p>
                                            <a
                                                href="https://wa.me/5541991443657"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-jvs-gold text-sm font-bold hover:gap-2.5 transition-all"
                                                onClick={() => gtag.reportConversion()}
                                            >
                                                <WhatsAppIcon className="w-4 h-4" />
                                                Solicitar Orçamento
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-7 -mx-4 px-4 rounded-lg hover:bg-white/[0.03] transition-colors">
                                        <div className="flex items-center gap-4 sm:w-1/3 shrink-0">
                                            <div className="w-11 h-11 rounded-full bg-jvs-gold/10 flex items-center justify-center shrink-0">
                                                <FileCheck className="text-jvs-gold w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-lg">Transparência Total</h4>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed sm:w-2/3">Orçamento detalhado sem custos ocultos. Documentação técnica completa.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Faixa de contato/CTA */}
                        <div className="relative bg-gradient-gold px-8 md:px-14 py-8 flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
                            <div>
                                <h3 className="text-jvs-navy font-black text-lg mb-2">Fale com um Especialista</h3>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-jvs-navy/80 text-sm font-semibold">
                                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />(41) 9 9225-2968</span>
                                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />comercial@grupojvsserv.com.br</span>
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />Curitiba, PR e Região</span>
                                </div>
                            </div>
                            <a
                                href="https://wa.me/5541992252968?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20um%20or%C3%A7amento%20de%20altura."
                                target="_blank"
                                onClick={() => gtag.reportConversion()}
                                className="inline-flex items-center justify-center gap-2 bg-jvs-navy text-white px-8 py-4 rounded-full font-bold hover:scale-[1.02] transition-all shrink-0 shadow-lg shadow-jvs-navy/30"
                            >
                                <WhatsAppIcon className="w-5 h-5" />
                                Conversar no WhatsApp
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Galeria de Trabalhos */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <span className="text-jvs-gold font-bold tracking-wider uppercase text-sm mb-3 flex items-center justify-center gap-1.5">
                            Portfólio
                            <ArrowUpRight className="w-4 h-4" />
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-jvs-navy tracking-tight">Nossos Trabalhos</h2>
                        <div className="w-16 h-1 bg-jvs-gold mx-auto mt-5 rounded-full"></div>
                    </motion.div>

                    <PortfolioCarousel
                        images={[
                            "/images/portfolio/trabalho-1.jpg",
                            "/images/portfolio/trabalho-2.jpg",
                            "/images/portfolio/trabalho-3.jpg",
                            "/images/portfolio/trabalho-4.jpg",
                            "/images/portfolio/trabalho-5.jpg",
                            "/images/portfolio/trabalho-6.jpg",
                            "/images/portfolio/trabalho-7.jpg",
                            "/images/portfolio/trabalho-8.jpg"
                        ]}
                    />
                </div>
            </section>

            {/* Clientes */}
            <section className="py-16 md:py-20 bg-jvs-bg-alt border-y border-jvs-border">
                <div className="container mx-auto px-4 text-center">
                    <motion.div {...fadeUp}>
                        <h2 className="text-2xl font-bold text-jvs-navy mb-2">Nossos Clientes Confiam em Nós</h2>
                        <div className="w-14 h-1 bg-jvs-gold mx-auto mb-10 rounded-full"></div>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            {[
                                "/logos/cliente-1.png",
                                "/logos/cliente-2.png",
                                "/logos/cliente-3.png",
                                "/logos/cliente-4.png",
                                "/logos/cliente-5.png",
                                "/logos/cliente-6.png",
                                "/logos/cliente-7.png"
                            ].map((logo, i) => (
                                <div key={i} className="w-24 md:w-32 h-20 flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-jvs-border grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-500">
                                    <img
                                        src={logo}
                                        alt={`Cliente ${i + 1}`}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 md:py-28 bg-jvs-bg-alt">
                <div className="container mx-auto px-4">
                    <motion.div
                        {...fadeUp}
                        className="relative overflow-hidden rounded-3xl text-white px-8 py-16 md:py-20 text-center shadow-2xl"
                    >
                        <img
                            src="/images/altura/cta-bg.jpg"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-jvs-gold/10 rounded-full blur-[90px] pointer-events-none"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                                Pronto para Transformar{' '}
                                <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.7)]">
                                    suas Fachadas?
                                </span>
                            </h2>
                            <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                                Entre em contato agora e receba uma análise técnica prévia sem compromisso.
                            </p>
                            <a
                                href="https://wa.me/5541992252968"
                                target="_blank"
                                onClick={() => gtag.reportConversion()}
                                className="inline-flex items-center justify-center gap-2.5 bg-gradient-gold text-jvs-navy font-bold text-lg md:text-xl px-10 py-5 rounded-full shadow-2xl hover:scale-105 transform transition-all"
                            >
                                <WhatsAppIcon className="w-6 h-6" />
                                FALAR COM CONSULTOR
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}
