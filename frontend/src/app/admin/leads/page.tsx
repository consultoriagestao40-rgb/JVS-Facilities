"use client";

import { useEffect, useState } from 'react';
import { Loader2, MessageCircle, FileText, Search, User, Filter } from 'lucide-react';

interface Lead {
    id: string;
    nome: string;
    empresa: string;
    email: string;
    whatsapp: string;
    createdAt: string;
    propostas: {
        id: string;
        custoMensal: number;
        status: string;
    }[];
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            // Fetch directly from backend port since frontend doesn't have local API proxy for it yet
            // Assuming backend is on 3001 as seen in server.ts
            // In production, this URL should be env var
            const response = await fetch('http://localhost:3001/api/simulador/leads');
            if (response.ok) {
                const data = await response.json();
                setLeads(data);
            }
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsApp = (lead: Lead) => {
        const number = lead.whatsapp.replace(/\D/g, ''); // Clean number
        const text = encodeURIComponent(`Vi que você fez uma simulação de preços na nossa página, gostaria de saber se podemos marcar uma ligação rápida para eu entender melhor sua necessidade?`);
        window.open(`https://api.whatsapp.com/send?phone=55${number}&text=${text}`, '_blank');
    };

    const filtersLeads = leads.filter(l =>
        l.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Leads e Simulações</h1>
                    <p className="text-gray-500">Gerencie contatos e visualize propostas recentes.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchLeads} className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        Atualizar
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar leads..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Lead / Empresa</th>
                                <th className="px-6 py-4">Contato</th>
                                <th className="px-6 py-4">Última Proposta</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtersLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{lead.nome}</div>
                                                <div className="text-sm text-gray-500">{lead.empresa}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700">{lead.email}</div>
                                        <div className="text-xs text-gray-400">{lead.whatsapp || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.propostas[0] ? (
                                            <div>
                                                <div className="font-mono font-bold text-green-700">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.propostas[0].custoMensal)}
                                                </div>
                                                <div className="text-xs text-gray-400 lowercase">{lead.propostas[0].status}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">Sem propostas</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {lead.whatsapp && (
                                                <button
                                                    onClick={() => handleWhatsApp(lead)}
                                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors title='Chamar no WhatsApp'"
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtersLeads.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            Nenhum lead encontrado.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
