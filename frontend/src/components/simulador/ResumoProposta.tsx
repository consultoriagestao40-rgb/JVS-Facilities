"use client";

import { useEffect, useState } from 'react';
import { useSimulador } from '@/context/SimuladorContext';
import { simuladorService } from '@/services/simuladorService';
import { ResultadoSimulacao } from '@/types/simulador';
import { Download, FileText, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { generatePropostaPDF } from '@/utils/generatePropostaPDF';
import PlanilhaCustos from '@/components/common/PlanilhaCustos';
import { motion } from 'framer-motion';
import { ItemResultado } from '@/types/simulador';

export default function ResumoProposta() {
    const { state, novoCalculo, goToStep } = useSimulador();
    const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [extractItem, setExtractItem] = useState<ItemResultado | null>(null);

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
            <div className="text-center relative">

                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                    <CheckCircle className="w-4 h-4" />
                    Proposta Gerada com Sucesso
                </div>
                <h2 className="text-3xl font-heading font-bold text-gray-900">
                    Proposta Comercial (v2.1)
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
                                    <p className="font-bold text-gray-900 capitalize">
                                        {item.config.cargo ? `${item.config.funcao} - ${item.config.cargo}` : item.config.funcao}
                                    </p>
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

            {/* Services List and Extract */}
            <div className="space-y-4">
                {resultado.servicos.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 p-2 rounded-lg"><FileText size={20} /></span>
                                {item.config.funcao}
                            </h4>
                            <p className="text-gray-500 text-sm mt-1 ml-11">
                                {item.config.quantidade} profissional(is) • {item.config.horarioEntrada} às {item.config.horarioSaida} ({item.config.dias.join(', ')})
                            </p>
                            {/* Tags de Inteligencia */}
                            <div className="flex gap-2 ml-11 mt-2">
                                {item.detalhamento.adicionais.noturno > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">🌙 Adic. Noturno Real</span>}
                                {item.detalhamento.adicionais.intrajornada > 0 && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">🍽️ Intrajornada</span>}
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Custo Unitário Final</p>
                            <p className="text-2xl font-bold text-gray-900">{formatBRL(item.custoUnitario)}</p>
                        </div>

                        <button
                            onClick={() => setExtractItem(item)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors border border-gray-200"
                        >
                            Ver Extrato Detalhado
                        </button>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                <button
                    onClick={() => novoCalculo()}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                    Nova Simulação
                </button>

                <button
                    onClick={() => goToStep(3)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                    Editar Simulação
                </button>
                <button
                    onClick={() => resultado && generatePropostaPDF(resultado, state.userData)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Baixar Proposta em PDF
                </button>
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-green-600 hover:shadow-xl hover:-translate-y-1 transition-all">
                    QUERO CONTRATAR
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {extractItem && <PlanilhaCustos item={extractItem} onClose={() => setExtractItem(null)} />}
        </div>
    );
}
