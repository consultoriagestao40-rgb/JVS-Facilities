"use client";

import { useEffect, useState } from 'react';
import { useSimulador } from '@/context/SimuladorContext';
import { simuladorService } from '@/services/simuladorService';
import { ResultadoSimulacao } from '@/types/simulador';
import { Download, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumoProposta() {
    const { state } = useSimulador();
    const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const calcular = async () => {
            try {
                // If we have no items, don't calculate or show empty
                if (state.configuracoes.length === 0) {
                    setLoading(false);
                    return;
                }

                const data = await simuladorService.calcularProposta(state);
                setResultado(data);
            } catch (err) {
                console.error(err);
                setError("Não foi possível calcular a proposta. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        calcular();
    }, []); // Run once on mount

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Calculando melhor proposta...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 underline">Tentar novamente</button>
            </div>
        );
    }

    if (!resultado) return null;

    const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                    <CheckCircle className="w-4 h-4" />
                    Proposta Gerada com Sucesso
                </div>
                <h2 className="text-3xl font-heading font-bold text-gray-900">
                    Proposta Comercial
                </h2>
                <p className="text-gray-500">ID: {resultado.id}</p>
            </div>

            {/* Total Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
                    <div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">Investimento Mensal</p>
                        <h3 className="text-4xl md:text-5xl font-bold mt-2 text-primary">
                            {formatBRL(resultado.resumo.custoMensalTotal)}
                        </h3>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Investimento Anual</span>
                            <span className="text-white font-bold">{formatBRL(resultado.resumo.custoAnualTotal)}</span>
                        </div>
                    </div>
                </motion.div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Detalhamento de Custos</h3>
                    <div className="space-y-4">
                        {resultado.servicos.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-bold text-gray-900 capitalize">{item.config.funcao}</p>
                                    <p className="text-xs text-gray-500">{item.config.quantidade}x profissional(is)</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">{formatBRL(item.custoTotal)}</p>
                                    <p className="text-xs text-gray-500">unit: {formatBRL(item.custoUnitario)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Breakdown - Simplified Visual */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Composição Transparente
                </h4>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                    <div style={{ width: '40%' }} className="bg-blue-500 h-full" title="Salários"></div>
                    <div style={{ width: '25%' }} className="bg-green-500 h-full" title="Encargos"></div>
                    <div style={{ width: '15%' }} className="bg-yellow-500 h-full" title="Benefícios"></div>
                    <div style={{ width: '20%' }} className="bg-primary h-full" title="Tributos/Lucro"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Salários</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Encargos</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Benefícios</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Taxas/Lucro</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
                    <Download className="w-5 h-5" />
                    Baixar Proposta em PDF
                </button>
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-green-600 hover:shadow-xl hover:-translate-y-1 transition-all">
                    QUERO CONTRATAR
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
                Ao clicar em "Quero Contratar", um de nossos executivos entrará em contato para formalização.
            </p>
        </div>
    );
}
