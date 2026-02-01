import React from 'react';
import { ItemResultado } from '@/types/simulador';

interface PlanilhaCustosProps {
    item: ItemResultado;
    onClose: () => void;
}

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

const SectionHeader = ({ title, total }: { title: string, total: number }) => (
    <tr className="bg-green-800 text-white font-bold text-sm">
        <td colSpan={3} className="px-4 py-2 uppercase tracking-wide">{title}</td>
        <td className="px-4 py-2 text-right">{formatCurrency(total)}</td>
    </tr>
);

const LineItem = ({ name, value, percentage }: { name: string, value: number, percentage?: number }) => (
    <tr className="border-b border-gray-100 text-sm hover:bg-gray-50">
        <td colSpan={2} className="px-4 py-1 text-gray-700">{name}</td>
        <td className="px-4 py-1 text-center text-gray-500 text-xs">
            {percentage ? `${percentage.toFixed(2)}%` : '-'}
        </td>
        <td className="px-4 py-1 text-right font-medium text-gray-800">{formatCurrency(value)}</td>
    </tr>
);

export default function PlanilhaCustos({ item, onClose }: PlanilhaCustosProps) {
    const d = item.detalhamento;

    // --- Montante A: Mão-de-Obra ---
    // Salário Base + Adicionais + Encargos + Provisões
    const totalAdicionais = d.adicionais.total;
    const totalProvisoes = d.provisoes.total;
    const totalEncargos = d.encargos; // Encargos Sociais only
    const montanteA = d.salarioBase + (d.gratificacoes || 0) + totalAdicionais + totalEncargos + totalProvisoes;

    // --- Montante B: Insumos ---
    const montanteB = d.insumos;

    // --- Montante C: Benefícios ---
    const montanteC = d.beneficios.total;

    // --- Montante D: BDI / Lucro / Impostos ??? ---
    // Na planilha do usuario: Montante D - BDI (Admin + Lucro)
    // E Impostos separado.
    // Nossa estrutura atual: 'Lucro' (Valor de margem) e 'Tributos' (Impostos na NF)
    // Vamos chamar "Montante D - Resultado & Tributos" pra simplificar ou seguir o print
    // Print: Montante D (BDI: Admin + Lucro)
    // Impostos (Abaixo)

    // Vamos agrupar Lucro em D.
    const montanteD = d.lucro;

    // Impostos separados
    const impostos = d.tributos;

    const totalGeral = item.custoTotal / item.config.quantidade; // Unitário final

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        📄 Extrato de Custos Detalhado
                        <span className="text-sm font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            {item.config.funcao}
                        </span>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        ✕ FECHAR
                    </button>
                </div>

                <div className="p-6 space-y-6 bg-white">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-green-900 text-white text-xs uppercase">
                                <th className="px-4 py-2 text-left" colSpan={2}>Discriminação</th>
                                <th className="px-4 py-2 text-center w-24">% ref.</th>
                                <th className="px-4 py-2 text-right w-32">Valor (R$)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* MONTANTE A */}
                            <SectionHeader title='Montante "A" - Mão-de-obra' total={montanteA} />
                            <LineItem name="1) Salário Base / Piso" value={d.salarioBase} />
                            {d.gratificacoes && d.gratificacoes > 0 && <LineItem name="Gratificações / Função" value={d.gratificacoes} />}

                            <LineItem name="Adicional Insalubridade" value={d.adicionais.insalubridade} />
                            <LineItem name="Adicional Periculosidade" value={d.adicionais.periculosidade} />
                            <LineItem name="Adicional Noturno (c/ Hora Reduzida)" value={d.adicionais.noturno} />
                            <LineItem name="Hora Extra Intrajornada (Indenizada)" value={d.adicionais.intrajornada} />
                            <LineItem name="Reflexo DSR (Sobre Variáveis)" value={d.adicionais.dsr} />

                            <tr className="bg-gray-50 font-semibold text-xs text-gray-600"><td colSpan={4} className="px-4 py-1">Encargos & Provisões</td></tr>
                            <LineItem name="2) Encargos Sociais (INSS, FGTS, RAT...)" value={d.encargos} />
                            <LineItem name="3) Provisão Férias + 1/3" value={d.provisoes.ferias} />
                            <LineItem name="4) Provisão 13º Salário" value={d.provisoes.decimoTerceiro} />
                            <LineItem name="5) Provisão Rescisão" value={d.provisoes.rescisao} />

                            {/* MONTANTE B */}
                            <SectionHeader title='Montante "B" - Insumos & Operacionais' total={montanteB + (d.custosOperacionais?.total || 0)} />
                            <LineItem name="1) Materiais e Equipamentos" value={d.insumos} />
                            <LineItem name="2) Exames Médicos (PCMSO/ASO)" value={d.custosOperacionais?.examesMedicos || 0} />

                            {/* MONTANTE C */}
                            <SectionHeader title='Montante "C" - Benefícios' total={montanteC} />
                            <LineItem name="1) Vale Alimentação / Refeição" value={d.beneficios.valeRefeicao} />
                            <LineItem name="2) Vale Transporte" value={d.beneficios.valeTransporte} />
                            <LineItem name="3) Cesta Básica / Assiduidade" value={d.beneficios.cestaBasica} />
                            <LineItem name="4) Uniformes / EPIs (Mensal)" value={d.beneficios.uniforme} />
                            {d.beneficios.vaSobreFerias > 0 && <LineItem name="5) Provisão VA nas Férias (1/12)" value={d.beneficios.vaSobreFerias} />}
                            {d.beneficios.adicionalCopa > 0 && <LineItem name="Adicional de Copa (Fixo/Mês)" value={d.beneficios.adicionalCopa} />}

                            {/* Descontos (Values are negative) */}
                            {d.beneficios.descontoVA < 0 && <tr className="border-b border-gray-100 text-sm hover:bg-gray-50 text-red-600">
                                <td colSpan={3} className="px-4 py-1">(-) Desconto VA (Funcionario)</td>
                                <td className="px-4 py-1 text-right font-medium">{formatCurrency(d.beneficios.descontoVA)}</td>
                            </tr>}
                            {d.beneficios.descontoVT < 0 && <tr className="border-b border-gray-100 text-sm hover:bg-gray-50 text-red-600">
                                <td colSpan={3} className="px-4 py-1">(-) Desconto VT (6% Salário)</td>
                                <td className="px-4 py-1 text-right font-medium">{formatCurrency(d.beneficios.descontoVT)}</td>
                            </tr>}

                            {/* SUBTOTAL */}
                            <tr className="bg-gray-200 font-bold text-gray-800">
                                <td colSpan={3} className="px-4 py-2 text-right uppercase text-xs">Total Parcial (A + B + C)</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(montanteA + montanteB + (d.custosOperacionais?.total || 0) + montanteC)}</td>
                            </tr>

                            {/* MONTANTE D */}
                            <SectionHeader title='Montante "D" - Margem / Lucro' total={montanteD} />
                            <LineItem name="1) Margem de Lucro Estimada" value={d.lucro} />

                            {/* TRIBUTOS */}
                            <tr className="bg-green-800 text-white font-bold text-sm mt-4 border-t-4 border-white">
                                <td colSpan={3} className="px-4 py-2 uppercase tracking-wide">Impostos Indiretos (PIS/COFINS/ISS)</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(impostos)}</td>
                            </tr>
                            <LineItem name="Tributos sobre Faturamento" value={impostos} />

                            {/* FINAL */}
                            <tr className="bg-black text-white font-bold text-lg">
                                <td colSpan={3} className="px-4 py-4 text-right uppercase">Preço Total Unitário</td>
                                <td className="px-4 py-4 text-right header-currency">{formatCurrency(totalGeral)}</td>
                            </tr>
                            <tr className="bg-gray-100 font-bold text-sm text-gray-800">
                                <td colSpan={3} className="px-4 py-2 text-right uppercase">Mensal Total ({item.config.quantidade}x)</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(item.custoTotal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
