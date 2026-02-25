import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Clock, FileCheck, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import * as gtag from '@/lib/gtag';

export default function AlturaPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            {/* Header removido conforme solicitacao */}


            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/bg-altura.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6 border border-emerald-500/30">
                        Especialistas em NR-35
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Limpeza em Altura com <br />
                        <span className="text-emerald-400">Excelência e Segurança</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Transforme suas fachadas com os serviços profissionais da JVS Facilities.
                        Equipe certificada com mais de 20 anos de experiência em acesso por corda.
                    </p>
                    <a
                        href="https://wa.me/5541992252968?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20para%20limpeza%20em%20altura."
                        target="_blank"
                        onClick={() => gtag.reportConversion()}
                        className="inline-flex items-center bg-emerald-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                    >
                        Solicitar Orçamento
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white relative z-20 -mt-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { value: "20+", label: "Anos de Experiência" },
                            { value: "5.000+", label: "Projetos Realizados" },
                            { value: "98%", label: "Taxa de Satisfação" },
                            { value: "0", label: "Acidentes Relatados" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-xl border-l-4 border-emerald-500 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform duration-300">
                                <span className="text-4xl md:text-5xl font-bold text-slate-700 mb-2">{stat.value}</span>
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Soluções Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Nossas Soluções em Altura</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Técnicas especializadas para cada tipo de estrutura, garantindo limpeza profunda sem danificar superfícies.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Card 1 */}
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                                <Shield className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Limpeza de Fachadas</h3>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                Limpeza profissional com técnicas de acesso por corda. Utilizamos produtos que preservam a integridade dos materiais.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                                <FileCheck className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Lavação de Vidros</h3>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                Resultado cristalino garantido em fachadas de vidro e áreas de difícil acesso com sistemas de segurança rigorosos.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
                                <Shield className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Acesso por Corda</h3>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                Técnica especializada com duplo talabarte. Ideal para estruturas de alto risco e áreas de acesso limitado.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                                <Clock className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Parada de Fábrica</h3>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                Limpeza profunda durante paradas industriais. Equipe treinada para ambientes complexos e confinados.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Diferenciais Section */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm mb-2 block">Por que escolher a JVS?</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Segurança Rigorosa e<br />Qualidade Garantida</h2>
                            <p className="text-slate-400 text-lg mb-8">
                                Não arrisque sua responsabilidade civil. Contrate uma empresa que segue 100% das normas de segurança do trabalho.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="text-emerald-400 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Certificação NR-35</h4>
                                        <p className="text-slate-400 text-sm">Equipe 100% certificada e atualizada com treinamentos contínuos.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <Shield className="text-emerald-400 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Seguro de Responsabilidade</h4>
                                        <p className="text-slate-400 text-sm">Cobertura completa contra acidentes e danos durante toda a operação.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <FileCheck className="text-emerald-400 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Transparência Total</h4>
                                        <p className="text-slate-400 text-sm">Orçamento detalhado sem custos ocultos. Documentação técnica completa.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-slate-800 p-8 rounded-2xl border border-slate-700">
                            <h3 className="text-2xl font-bold mb-6">Fale com um Especialista</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Phone className="w-5 h-5 text-emerald-400" />
                                    <span>(41) 9 9225-2968</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Mail className="w-5 h-5 text-emerald-400" />
                                    <span>comercial@grupojvsserv.com.br</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <MapPin className="w-5 h-5 text-emerald-400" />
                                    <span>Curitiba, PR e Região</span>
                                </div>
                            </div>
                            <a
                                href="https://wa.me/5541992252968?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20um%20or%C3%A7amento%20de%20altura."
                                target="_blank"
                                onClick={() => gtag.reportConversion()}
                                className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-colors"
                            >
                                Conversar no WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Galeria de Trabalhos */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-emerald-500 font-bold tracking-wider uppercase text-sm mb-2 block">Portfólio</span>
                        <h2 className="text-3xl font-bold text-slate-900">Nossos Trabalhos</h2>
                        <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "/images/portfolio/trabalho-1.jpg",
                            "/images/portfolio/trabalho-2.jpg",
                            "/images/portfolio/trabalho-3.jpg",
                            "/images/portfolio/trabalho-4.jpg",
                            "/images/portfolio/trabalho-5.jpg",
                            "/images/portfolio/trabalho-6.jpg",
                            "/images/portfolio/trabalho-7.jpg",
                            "/images/portfolio/trabalho-8.jpg"
                        ].map((img, i) => (
                            <div key={i} className="aspect-square overflow-hidden rounded-xl border border-slate-100 hover:shadow-lg transition-all group">
                                <img
                                    src={img}
                                    alt={`Trabalho Realizado ${i + 1}`}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clientes */}
            <section className="py-16 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-10">Nossos Clientes Confiam em Nós</h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">

                        {[
                            "/logos/cliente-1.png",
                            "/logos/cliente-2.png",
                            "/logos/cliente-3.png",
                            "/logos/cliente-4.png",
                            "/logos/cliente-5.png",
                            "/logos/cliente-6.png",
                            "/logos/cliente-7.png"
                        ].map((logo, i) => (
                            <div key={i} className="w-24 md:w-32 h-20 flex items-center justify-center p-2 bg-white rounded-lg shadow-sm">
                                <img
                                    src={logo}
                                    alt={`Cliente ${i + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-emerald-600 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Transformar suas Fachadas?</h2>
                    <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
                        Entre em contato agora e receba uma análise técnica prévia sem compromisso.
                    </p>
                    <a
                        href="https://wa.me/5541992252968"
                        target="_blank"
                        onClick={() => gtag.reportConversion()}
                        className="inline-block bg-white text-emerald-700 font-bold text-xl px-10 py-5 rounded-full shadow-2xl hover:bg-emerald-50 transform hover:scale-105 transition-all"
                    >
                        FALAR COM CONSULTOR
                    </a>
                </div>
            </section>


        </main>
    );
}
