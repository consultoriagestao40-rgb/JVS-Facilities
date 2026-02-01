"use client";

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand & Resume */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold text-white mb-4">JVSServ</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Soluções inteligentes em terceirização de serviços e facilities.
                            Qualidade, transparência e eficiência para sua empresa.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Navegação</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
                            <li><Link href="/#servicos" className="hover:text-primary transition-colors">Nossos Serviços</Link></li>
                            <li><Link href="/#beneficios" className="hover:text-primary transition-colors">Por que JVSServ</Link></li>
                            <li><Link href="/simulador" className="hover:text-primary transition-colors">Simulador Online</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Serviços</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/simulador" className="hover:text-primary transition-colors">Limpeza e Conservação</Link></li>
                            <li><Link href="/simulador" className="hover:text-primary transition-colors">Portaria e Recepção</Link></li>
                            <li><Link href="/simulador" className="hover:text-primary transition-colors">Segurança Patrimonial</Link></li>
                            <li><Link href="/simulador" className="hover:text-primary transition-colors">Manutenção Predial</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Fale Conosco</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span>Av. Paulista, 1000 - Bela Vista<br />São Paulo - SP</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span className="break-all">contato@jvsserv.com.br</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 mt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Grupo JVSServ. Todos os direitos reservados.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Política de Privacidade</Link>
                        <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
