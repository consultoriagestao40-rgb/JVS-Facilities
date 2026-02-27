"use client";

import { RegraCCT as RegraCCTType } from '@/types/simulador';
import { useState } from 'react';
import { Edit, Trash, X } from 'lucide-react';
import { clsx } from 'clsx';

interface CargoTableSectionProps {
    regra: RegraCCTType;
    setRegra: React.Dispatch<React.SetStateAction<RegraCCTType>>;
}

export default function CargoTableSection({ regra, setRegra }: CargoTableSectionProps) {
    const [editingCargoIndex, setEditingCargoIndex] = useState<number | null>(null);
    const [newCargoState, setNewCargoState] = useState({ nome: '', piso: '', gratificacao: '', copa: '' });

    const handleAddOrUpdateCargo = () => {
        const nome = newCargoState.nome;
        const piso = parseFloat(newCargoState.piso);
        const gratificacao = parseFloat(newCargoState.gratificacao) || 0;
        const adicionalCopa = parseFloat(newCargoState.copa) || 0;

        if (nome && piso) {
            const newCargoObj = { nome, piso, gratificacao, adicionalCopa };

            if (editingCargoIndex !== null) {
                const updatedCargos = [...(regra.cargos || [])];
                updatedCargos[editingCargoIndex] = newCargoObj;
                setRegra(prev => ({ ...prev, cargos: updatedCargos }));
                setEditingCargoIndex(null);
            } else {
                const newCargos = [...(regra.cargos || []), newCargoObj];
                setRegra(prev => ({ ...prev, cargos: newCargos }));
            }

            setNewCargoState({ nome: '', piso: '', gratificacao: '', copa: '' });
        }
    };

    return (
        <div className="mt-8 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <h4 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 p-2 rounded-lg text-sm">📋</span>
                    Tabela de Cargos & Salários da Categoria
                </h4>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="text-xs font-black text-gray-500 mb-1 block uppercase">Nome do Cargo</label>
                            <input
                                value={newCargoState.nome}
                                onChange={e => setNewCargoState({ ...newCargoState, nome: e.target.value })}
                                type="text"
                                placeholder="Ex: Zelador Líder"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-500 mb-1 block uppercase">Piso Salarial (R$)</label>
                            <input
                                value={newCargoState.piso}
                                onChange={e => setNewCargoState({ ...newCargoState, piso: e.target.value })}
                                type="number"
                                placeholder="0.00"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-500 mb-1 block uppercase">Gratificação (R$)</label>
                            <input
                                value={newCargoState.gratificacao}
                                onChange={e => setNewCargoState({ ...newCargoState, gratificacao: e.target.value })}
                                type="number"
                                placeholder="0.00"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-500 mb-1 block uppercase">Adic. Copa (R$)</label>
                            <input
                                value={newCargoState.copa}
                                onChange={e => setNewCargoState({ ...newCargoState, copa: e.target.value })}
                                type="number"
                                placeholder="0.00"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleAddOrUpdateCargo}
                            className={clsx(
                                "flex-1 px-6 py-3 rounded-lg font-black shadow-lg transition-all h-[50px] flex items-center justify-center uppercase tracking-wider",
                                editingCargoIndex !== null ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                            )}
                        >
                            {editingCargoIndex !== null ? 'Atualizar Cargo' : 'Adicionar na Tabela'}
                        </button>

                        {editingCargoIndex !== null && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCargoIndex(null);
                                    setNewCargoState({ nome: '', piso: '', gratificacao: '', copa: '' });
                                }}
                                className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 font-bold h-[50px] flex items-center justify-center transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden border rounded-xl shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th className="p-4 border-b">Cargo</th>
                                <th className="p-4 border-b">Piso Salarial</th>
                                <th className="p-4 border-b">Gratificação</th>
                                <th className="p-4 border-b">Adc. Copa</th>
                                <th className="p-4 border-b w-24 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(regra.cargos || []).length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-400 bg-white italic">
                                        Nenhum cargo específico cadastrado. O sistema usará o Piso Padrão para esta categoria.
                                    </td>
                                </tr>
                            )}
                            {(regra.cargos || []).map((c, idx) => (
                                <tr key={idx} className="hover:bg-blue-50 transition-colors bg-white">
                                    <td className="p-4 font-bold text-gray-800">{c.nome}</td>
                                    <td className="p-4 font-mono text-green-700 font-black">R$ {c.piso.toFixed(2)}</td>
                                    <td className="p-4 font-mono text-gray-600">{c.gratificacao ? `R$ ${c.gratificacao.toFixed(2)}` : '-'}</td>
                                    <td className="p-4 font-mono text-gray-600">{c.adicionalCopa ? `R$ ${c.adicionalCopa.toFixed(2)}` : '-'}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    setEditingCargoIndex(idx);
                                                    setNewCargoState({
                                                        nome: c.nome,
                                                        piso: String(c.piso),
                                                        gratificacao: String(c.gratificacao || ''),
                                                        copa: String(c.adicionalCopa || '')
                                                    });
                                                }}
                                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newCargos = [...(regra.cargos || [])];
                                                    newCargos.splice(idx, 1);
                                                    setRegra(prev => ({ ...prev, cargos: newCargos }));
                                                }}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                title="Remover"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-[11px] text-gray-500 mt-3 flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="text-blue-500 font-bold">ℹ️ DICA:</span>
                    Cargos cadastrados aqui aparecerão como opções para o cliente no simulador após selecionar a categoria.
                </p>
            </div>
        </div>
    );
}
