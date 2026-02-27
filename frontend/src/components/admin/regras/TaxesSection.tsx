"use client";

import { RegraCCT as RegraCCTType } from '@/types/simulador';

interface TaxesSectionProps {
    regra: RegraCCTType;
    onChange: (section: keyof RegraCCTType | null, field: string, value: any) => void;
}

export default function TaxesSection({ regra, onChange }: TaxesSectionProps) {
    return (
        <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase">Alíquotas & Impostos (%)</h4>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4">
                <h5 className="text-[10px] font-black text-amber-800 uppercase mb-2">Encargos Sociais</h5>
                <div className="space-y-3">
                    {['inss', 'fgts', 'rat'].map(key => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-amber-700 mb-1 uppercase">{key}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={Number((Number(regra.aliquotas[key as keyof typeof regra.aliquotas]) * 100).toFixed(2))}
                                    onChange={e => onChange('aliquotas', key, String(Number(e.target.value) / 100))}
                                    className="w-full p-2 pr-8 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 outline-none font-mono text-sm"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold">%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-4">
                <h5 className="text-[10px] font-black text-green-800 uppercase mb-2">Tributos sobre Faturamento</h5>
                <div className="space-y-3">
                    {['pis', 'cofins', 'iss'].map(key => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-green-700 mb-1 uppercase">{key}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={Number((Number(regra.aliquotas[key as keyof typeof regra.aliquotas]) * 100).toFixed(2))}
                                    onChange={e => onChange('aliquotas', key, String(Number(e.target.value) / 100))}
                                    className="w-full p-2 pr-8 border border-green-200 rounded focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 font-bold">%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <h5 className="text-[10px] font-black text-blue-800 uppercase mb-2">Comercial</h5>
                <div>
                    <label className="block text-xs font-bold text-blue-700 mb-1 uppercase">Margem de Lucro</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            value={Number((Number(regra.aliquotas.margemLucro) * 100).toFixed(2))}
                            onChange={e => onChange('aliquotas', 'margemLucro', String(Number(e.target.value) / 100))}
                            className="w-full p-2 pr-8 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 font-bold">%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
