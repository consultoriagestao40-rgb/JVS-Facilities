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
        servicos: string; // JSON String
    }[];
}

export default function LeadsPage() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await fetch('/api/leads');
            if (response.ok) {
                const leads = await response.json();

                // FLATTEN: One row per Proposal
                const flattenedProposals = leads.flatMap((lead: any) => {
                    if (!lead.propostas || lead.propostas.length === 0) {
                        // Option: Show leads without proposals? For now, let's include them with null proposal
                        // But user specifically wants multiple simulations "remaining", so focus on existing proposals.
                        return [];
                    }
                    return lead.propostas.map((prop: any) => ({
                        id: prop.id,
                        lead: lead,
                        ...prop
                        // prop has id, servicos, custoMensal, status
                    }));
                });

                // Sort by CreatedAt (newest first)
                flattenedProposals.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setProposals(flattenedProposals);
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

    const filtersLeads = leads.filter(l => {
        const matchesSearch =
            l.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.email.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (startDate) {
            matchesDate = matchesDate && new Date(l.createdAt) >= new Date(startDate);
        }
        if (endDate) {
            // Add 1 day to include the end date fully
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            matchesDate = matchesDate && new Date(l.createdAt) < end;
        }

        return matchesSearch && matchesDate;
    });

    const totalValue = filtersLeads.reduce((acc, lead) => {
        return acc + (lead.propostas[0]?.custoMensal || 0);
    }, 0);

    // Helper to parse services
    const getServiceDetails = (proposta: any) => {
        if (!proposta || !proposta.servicos) return { types: [], details: [] };
        try {
            const servicos = JSON.parse(proposta.servicos);
            // @ts-ignore
            const types = servicos.map(s => s.config.funcao || s.config.servicoId).filter((v, i, a) => a.indexOf(v) === i);
            // @ts-ignore
            const details = servicos.map(s => `${s.config.quantidade}x ${s.config.cargo || s.config.funcao}`);
            return { types, details };
        } catch (e) {
            return { types: ['Erro ao ler'], details: [] };
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Leads e Simulações</h1>
                    <p className="text-gray-500">Gerencie contatos e visualize propostas recentes.</p>
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Data Início</label>
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Data Fim</label>
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchLeads} className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 h-[38px]">
                        Atualizar
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar leads..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none h-[38px]"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Totalizer Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                <p className="text-slate-400 text-sm font-medium mb-1">Valor Total em Propostas (Filtrado)</p>
                <div className="text-3xl font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                </div>
                <div className="text-sm text-slate-400 mt-2">
                    {filtersLeads.length} simulações encontradas
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
                                <th className="px-6 py-4">Processos</th>
                                <th className="px-6 py-4">Detalhamento</th>
                                <th className="px-6 py-4">Valor Mensal</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtersLeads.map(lead => {
                                const details = lead.propostas[0] ? getServiceDetails(lead.propostas[0]) : { types: [], details: [] };
                                return (
                                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{lead.nome}</div>
                                                    <div className="text-sm text-gray-500 transition-all hover:text-primary">
                                                        {lead.empresa}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {details.types.map((t: string, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium border border-blue-100">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {details.details.map((d: string, i: number) => (
                                                    <span key={i} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block w-fit">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
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
                                )
                            })}
                        </tbody>
                    </table>
                    {filtersLeads.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            Nenhum lead encontrado neste período.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
