"use client";

import { RegraCCT as RegraCCTType } from '@/types/simulador';

interface BenefitsSectionProps {
    regra: RegraCCTType;
    onChange: (section: keyof RegraCCTType | null, field: string, value: any) => void;
}

export default function BenefitsSection({ regra, onChange }: BenefitsSectionProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h4 className="font-bold text-sm text-gray-500 uppercase">Benefícios (R$)</h4>

                {/* Vale Refeição */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <label className="block text-sm font-bold text-gray-600 mb-2">Vale Refeição / Alimentação</label>
                    <div className="flex gap-2 mb-2">
                        <select
                            value={regra.beneficios.tipoValeRefeicao}
                            onChange={e => onChange('beneficios', 'tipoValeRefeicao', e.target.value)}
                            className="p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="DIARIO">R$ / Dia</option>
                            <option value="MENSAL">R$ / Mês (Fixo)</option>
                        </select>
                        <input
                            type="number"
                            value={regra.beneficios.valeRefeicao}
                            onChange={e => onChange('beneficios', 'valeRefeicao', e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Valor"
                        />
                    </div>
                    <div className="space-y-2 pl-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={regra.configuracoesBeneficios?.vaSobreFerias ?? true}
                                onChange={e => onChange('configuracoesBeneficios', 'vaSobreFerias', e.target.checked)}
                                id="vaFerias"
                                className="w-3 h-3 text-blue-600 rounded"
                            />
                            <label htmlFor="vaFerias" className="text-xs text-gray-600 font-medium cursor-pointer">Provisionar sobre Férias</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600 font-medium">Desc. no VA (%):</label>
                            <input
                                type="number"
                                step="0.01"
                                value={Number((regra.configuracoesBeneficios?.descontoVA ?? 0.20) * 100).toFixed(1)}
                                onChange={e => onChange('configuracoesBeneficios', 'descontoVA', String(Number(e.target.value) / 100))}
                                className="w-16 p-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Vale Transporte */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <label className="block text-sm font-bold text-gray-600 mb-2">Vale Transporte (Diário)</label>
                    <input
                        type="number"
                        value={regra.beneficios.valeTransporte}
                        onChange={e => onChange('beneficios', 'valeTransporte', e.target.value)}
                        className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="flex items-center gap-2 pl-1">
                        <label className="text-xs text-gray-600 font-medium">Desc. Legal (% do Piso):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={Number((regra.configuracoesBeneficios?.descontoVT ?? 0.06) * 100).toFixed(1)}
                            onChange={e => onChange('configuracoesBeneficios', 'descontoVT', String(Number(e.target.value) / 100))}
                            className="w-16 p-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Outros Beneficios */}
                {Object.entries(regra.beneficios).map(([key, val]) => {
                    if (['valeRefeicao', 'tipoValeRefeicao', 'valeTransporte', 'adicionalCopa'].includes(key)) return null;
                    return (
                        <div key={key}>
                            <label className="block text-sm font-medium mb-1 capitalize text-gray-600">{key.replace(/([A-Z])/g, ' $1')}</label>
                            <input
                                type="number"
                                value={val}
                                onChange={e => onChange('beneficios', key, e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    );
                })}

                {/* Adicional de Copa */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <label className="block text-sm font-bold text-blue-800 mb-1">Adicional de Copa (Fixo/Mês)</label>
                    <input
                        type="number"
                        value={regra.beneficios.adicionalCopa || 0}
                        onChange={e => onChange('beneficios', 'adicionalCopa', e.target.value)}
                        className="w-full p-2 border border-blue-200 rounded text-blue-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-[10px] text-blue-600 mt-1 uppercase font-bold">Padrão da categoria (Ex: PR = 120,00)</p>
                </div>
            </div>
        </div>
    );
}
