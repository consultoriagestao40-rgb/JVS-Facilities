"use client";

import { RegraCCT as RegraCCTType } from '@/types/simulador';

interface BasicInfoSectionProps {
    regra: RegraCCTType;
    onChange: (section: keyof RegraCCTType | null, field: string, value: any) => void;
}

export default function BasicInfoSection({ regra, onChange }: BasicInfoSectionProps) {
    return (
        <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase">Localização & Função</h4>
            <div>
                <label className="block text-sm font-medium mb-1">Estado (UF)</label>
                <select
                    value={regra.uf}
                    onChange={e => onChange(null, 'uf', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="PR">Paraná (PR)</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="SC">Santa Catarina (SC)</option>
                    <option value="RJ">Rio de Janeiro (RJ)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Cidade (Vazio para Todo Estado)</label>
                <input
                    type="text"
                    value={regra.cidade}
                    onChange={e => onChange(null, 'cidade', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: Curitiba"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Função</label>
                <select
                    value={regra.funcao}
                    onChange={e => onChange(null, 'funcao', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="LIMPEZA">Limpeza</option>
                    <option value="PORTARIA">Portaria</option>
                    <option value="RECEPCAO">Recepção</option>
                    <option value="JARDINAGEM">Jardinagem</option>
                    <option value="SEGURANCA">Segurança</option>
                    <option value="MANUTENCAO">Manutenção</option>
                    <option value="COZINHA">Cozinha</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Piso Salarial Padrão (R$)</label>
                <input
                    type="number"
                    value={regra.salarioPiso}
                    onChange={e => onChange(null, 'salarioPiso', e.target.value)}
                    className="w-full p-2 border rounded font-bold text-green-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <hr className="border-gray-200" />
            <h4 className="font-bold text-sm text-gray-500 uppercase">Custos Operacionais (Mensal)</h4>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium mb-1">Exames Médicos</label>
                    <input
                        type="number"
                        value={regra.custosOperacionais?.examesMedicos || 0}
                        onChange={e => onChange('custosOperacionais', 'examesMedicos', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Uniformes/EPIs</label>
                    <input
                        type="number"
                        value={regra.custosOperacionais?.uniformeEpis || 0}
                        onChange={e => onChange('custosOperacionais', 'uniformeEpis', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <hr className="border-gray-200" />
            <h4 className="font-bold text-sm text-gray-500 uppercase">Adicionais</h4>
            <div className="space-y-4 bg-yellow-50 p-3 rounded border border-yellow-100">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={regra.adicionais.insalubridade}
                        onChange={e => onChange('adicionais', 'insalubridade', e.target.checked)}
                        id="chkInsalubridade"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="chkInsalubridade" className="font-semibold text-gray-700 cursor-pointer">Insalubridade</label>
                </div>

                {regra.adicionais.insalubridade && (
                    <div className="ml-6 space-y-3 animate-fade-in">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs block text-gray-600 font-bold mb-1">Grau (%):</label>
                                <select
                                    value={regra.adicionais.grauInsalubridade}
                                    onChange={e => onChange('adicionais', 'grauInsalubridade', Number(e.target.value))}
                                    className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value={0.10}>10% (Mínimo)</option>
                                    <option value={0.20}>20% (Médio)</option>
                                    <option value={0.40}>40% (Máximo)</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs block text-gray-600 font-bold mb-1">Base de Cálculo:</label>
                                <select
                                    value={regra.adicionais.baseInsalubridade}
                                    onChange={e => onChange('adicionais', 'baseInsalubridade', e.target.value)}
                                    className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="SALARIO_MINIMO">Salário Mínimo</option>
                                    <option value="SALARIO_BASE">Piso Salarial</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={regra.adicionais.periculosidade}
                        onChange={e => onChange('adicionais', 'periculosidade', e.target.checked)}
                        id="chkPericulosidade"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="chkPericulosidade" className="font-semibold text-gray-700 cursor-pointer">Periculosidade (30%)</label>
                </div>
            </div>
        </div>
    );
}
