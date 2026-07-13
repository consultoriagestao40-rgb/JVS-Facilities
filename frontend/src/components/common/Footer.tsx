"use client";

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-hero text-gray-300 rounded-t-3xl pt-14 pb-10 mt-12">
            <div className="container mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

                    {/* Brand & Resume */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-6">
                            <img
                                src="https://grupojvsserv.com.br/wp-content/uploads/2023/11/logo-branco-200px.png"
                                alt="JVS Facilities"
                                className="h-10 w-auto"
                            />
                        </div>
                        <p className="text-lg text-white font-semibold leading-relaxed mb-6">
                            Soluções inteligentes em terceirização de serviços e facilities.
                            Qualidade, transparência e eficiência para sua empresa.
                        </p>
                        <div className="flex gap-3">
                            <Link href="https://www.instagram.com/grupojvsserv" target="_blank" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-jvs-gold hover:text-jvs-navy transition-colors"><Instagram className="w-5 h-5" /></Link>
                            <Link href="https://www.linkedin.com/company/grupojvsserv" target="_blank" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-jvs-gold hover:text-jvs-navy transition-colors"><Linkedin className="w-5 h-5" /></Link>
                            <Link href="https://www.facebook.com/grupojvsserv" target="_blank" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-jvs-gold hover:text-jvs-navy transition-colors"><Facebook className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-jvs-gold font-bold mb-4 uppercase text-sm tracking-wider">Navegação</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-jvs-gold transition-colors">Início</Link></li>
                            <li><Link href="/#servicos" className="hover:text-jvs-gold transition-colors">Nossos Serviços</Link></li>
                            <li><Link href="/#beneficios" className="hover:text-jvs-gold transition-colors">Por que JVS Facilities</Link></li>
                            <li><Link href="/simulador" className="hover:text-jvs-gold transition-colors">Simulador Online</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-jvs-gold font-bold mb-4 uppercase text-sm tracking-wider">Serviços</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/simulador" className="hover:text-jvs-gold transition-colors">Limpeza e Conservação</Link></li>
                            <li><Link href="/simulador" className="hover:text-jvs-gold transition-colors">Portaria e Recepção</Link></li>
                            <li><Link href="/simulador" className="hover:text-jvs-gold transition-colors">Segurança Patrimonial</Link></li>
                            <li><Link href="/simulador" className="hover:text-jvs-gold transition-colors">Manutenção Predial</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-jvs-gold font-bold mb-4 uppercase text-sm tracking-wider">Fale Conosco</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-jvs-gold shrink-0" />
                                <span>Av. Maringá, 1273 - Emiliano Perneta<br />Pinhais - PR</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-jvs-gold shrink-0" />
                                <span>(41) 99225-2968</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-jvs-gold shrink-0" />
                                <span className="break-all">comercial@grupojvsserv.com.br</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 mt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
                    <p>&copy; {new Date().getFullYear()} JVS Facilities. Todos os direitos reservados.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-jvs-gold transition-colors">Política de Privacidade</Link>
                        <Link href="#" className="hover:text-jvs-gold transition-colors">Termos de Uso</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
