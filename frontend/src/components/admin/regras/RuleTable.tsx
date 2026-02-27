"use client";

import { RegraCCT as RegraCCTType } from '@/types/simulador';
import { Edit, Trash } from 'lucide-react';

interface RuleTableProps {
    regras: RegraCCTType[];
    onEdit: (regra: RegraCCTType) => void;
    onDelete: (id: string) => void;
    calculateTotalCost: (regra: RegraCCTType) => number;
    calculateEstimativePrice: (regra: RegraCCTType) => number;
}

export default function RuleTable({
    regras,
    onEdit,
    onDelete,
    calculateTotalCost,
    calculateEstimativePrice
}: RuleTableProps) {
    if (regras.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400 bg-white border rounded-lg italic">
                Nenhuma regra encontrada. Cadastre a primeira!
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        <th className="p-4 font-semibold text-gray-600">Local (UF/Cidade)</th>
                        <th className="p-4 font-semibold text-gray-600">Função</th>
                        <th className="p-4 font-semibold text-gray-600">Cargo</th>
                        <th className="p-4 font-semibold text-gray-600">Piso (R$)</th>
                        <th className="p-4 font-semibold text-gray-600">Adicional (R$)</th>
                        <th className="p-4 font-semibold text-gray-600">Remun. Total</th>
                        <th className="p-4 font-semibold text-gray-600">Preço Venda (Final)</th>
                        <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {regras.flatMap(regra => {
                        const renderRow = (
                            key: string,
                            cargoLabel: string,
                            piso: number,
                            gratificacao: number,
                            isSubItem: boolean
                        ) => {
                            const proxyRegra = {
                                ...regra,
                                salarioPiso: piso,
                                gratificacoes: gratificacao
                            };
                            const precoVenda = calculateEstimativePrice(proxyRegra);
                            const totalRemuneracao = piso + gratificacao;

                            return (
                                <tr key={key} className={`border-b hover:bg-gray-50 transition-colors ${isSubItem ? 'bg-gray-50/50' : ''}`}>
                                    <td className="p-4">
                                        <span className="font-bold text-gray-800">{regra.uf}</span>
                                        <span className="text-gray-500 mx-2">-</span>
                                        {regra.cidade || '(Todas)'}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                                            {regra.funcao}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 font-medium">
                                        {cargoLabel}
                                    </td>
                                    <td className="p-4 font-mono text-gray-700">R$ {piso.toFixed(2)}</td>
                                    <td className="p-4 font-mono text-gray-700">R$ {gratificacao.toFixed(2)}</td>
                                    <td className="p-4 font-mono font-bold text-gray-900 bg-yellow-50 border-x border-yellow-100">
                                        R$ {totalRemuneracao.toFixed(2)}
                                    </td>
                                    <td className="p-4 font-mono font-bold text-green-700">R$ {precoVenda.toFixed(2)}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => onEdit(regra)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                            title="Editar Regra Completa"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {!isSubItem && (
                                            <button
                                                onClick={() => onDelete(regra.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                title="Excluir Regra"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        };

                        if (regra.cargos && regra.cargos.length > 0) {
                            return regra.cargos.map((c, idx) =>
                                renderRow(
                                    `${regra.id}_${idx}`,
                                    c.nome,
                                    c.piso,
                                    c.gratificacao || 0,
                                    true
                                )
                            );
                        }

                        return [renderRow(regra.id, regra.cargo || 'Padrão (Genérico)', regra.salarioPiso, regra.gratificacoes || 0, false)];
                    })}
                </tbody>
            </table>
        </div>
    );
}
