"use client";

import { useEffect, useState } from 'react';
import { Loader2, MessageCircle, FileText, Search, User, Filter, Trash2, Eye, X } from 'lucide-react';
import PlanilhaCustos from '@/components/common/PlanilhaCustos';
import { ItemResultado } from '@/types/simulador';

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
    const [viewingProposal, setViewingProposal] = useState<any | null>(null);
    const [extractItem, setExtractItem] = useState<ItemResultado | null>(null);

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
                        return [];
                    }
                    return lead.propostas.map((prop: any) => ({
                        id: prop.id,
                        lead: lead,
                        ...prop
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

    const filteredProposals = proposals.filter(p => {
        const matchesSearch =
            p.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lead.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lead.email.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (startDate) {
            matchesDate = matchesDate && new Date(p.createdAt) >= new Date(startDate);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            matchesDate = matchesDate && new Date(p.createdAt) < end;
        }

        return matchesSearch && matchesDate;
    });

    const totalValue = filteredProposals.reduce((acc, p) => {
        return acc + (p.custoMensal || 0);
    }, 0);

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

    const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

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

            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                <p className="text-slate-400 text-sm font-medium mb-1">Valor Total em Propostas (Filtrado)</p>
                <div className="text-3xl font-bold">
                    {formatBRL(totalValue)}
                </div>
                <div className="text-sm text-slate-400 mt-2">
                    {filteredProposals.length} simulações encontradas
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
                            {filteredProposals.map(prop => {
                                const details = getServiceDetails(prop);
                                const lead = prop.lead;
                                return (
                                    <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
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
                                            <div>
                                                <div className="font-mono font-bold text-green-700">
                                                    {formatBRL(prop.custoMensal)}
                                                </div>
                                                <div className="text-xs text-gray-400 lowercase">{prop.status}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setViewingProposal(prop)}
                                                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                    title='Ver Detalhes'
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {lead.whatsapp && (
                                                    <button
                                                        onClick={() => handleWhatsApp(lead)}
                                                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                        title='Chamar no WhatsApp'
                                                    >
                                                        <MessageCircle size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Tem certeza que deseja excluir esta simulação?')) {
                                                            try {
                                                                const res = await fetch(`/api/propostas?id=${prop.id}`, { method: 'DELETE' });
                                                                if (res.ok) {
                                                                    fetchLeads(); // Reload list
                                                                } else {
                                                                    alert('Erro ao excluir');
                                                                }
                                                            } catch (e) {
                                                                alert('Erro ao excluir');
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                    title="Excluir Simulação"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {filteredProposals.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            Nenhum lead encontrado neste período.
                        </div>
                    )}
                </div>
            )}

            {/* View Proposal Modal */}
            {viewingProposal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white rounded-t-2xl sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <FileText className="text-primary" />
                                    Simulação: {viewingProposal.id || viewingProposal.numeroSequencial}
                                </h3>
                                <p className="text-slate-400 text-sm">{viewingProposal.lead.nome} - {viewingProposal.lead.empresa}</p>
                            </div>
                            <button onClick={() => setViewingProposal(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Custo Mensal</p>
                                    <p className="text-3xl font-bold text-slate-900">{formatBRL(viewingProposal.custoMensal)}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Custo Anual</p>
                                    <p className="text-3xl font-bold text-slate-900">{formatBRL(viewingProposal.custoAnual)}</p>
                                </div>
                            </div>

                            {/* Services List */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-800 border-l-4 border-primary pl-3">Serviços Selecionados</h4>
                                {JSON.parse(viewingProposal.servicos).map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-primary/30 transition-colors">
                                        <div className="flex-1">
                                            <h5 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                {item.config.funcao}
                                            </h5>
                                            <p className="text-gray-500 text-sm">
                                                {item.config.quantidade}x {item.config.cargo || item.config.funcao} • {item.config.horarioEntrada} às {item.config.horarioSaida}
                                            </p>
                                        </div>
                                        <div className="text-right mr-4">
                                            <p className="text-xs text-slate-400 uppercase font-bold">Total Mensal</p>
                                            <p className="text-xl font-bold text-green-700">{formatBRL(item.custoTotal)}</p>
                                        </div>
                                        <button
                                            onClick={() => setExtractItem(item)}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold text-sm transition-all border border-slate-200"
                                        >
                                            Ver Planilha Completa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t flex justify-end gap-3 rounded-b-2xl">
                            <button
                                onClick={() => setViewingProposal(null)}
                                className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-100"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Use the PlanilhaCustos component from common */}
            {extractItem && <PlanilhaCustos item={extractItem} onClose={() => setExtractItem(null)} />}
        </div>
    );
}

