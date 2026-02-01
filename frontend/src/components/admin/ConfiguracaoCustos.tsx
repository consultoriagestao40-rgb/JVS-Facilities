
"use client";

import { useSimulador } from '@/context/SimuladorContext';
import { ParametrosCustos } from '@/types/simulador';
import { useState } from 'react';
import { X, Save } from 'lucide-react';

export default function ConfiguracaoCustos({ onClose }: { onClose: () => void }) {
    const { updateParametros, state } = useSimulador();

    // Default values if not set
    const defaultParams: ParametrosCustos = {
        salarioMinimo: 1412.00,
        aliquotas: {
            inss: 0.20,
            fgts: 0.08,
            rat: 0.02,
            pis: 0.0165,
            cofins: 0.076,
            iss: 0.05,
            margemLucro: 0.15,
        },
        beneficios: {
            valeRefeicao: 25.00,
            valeTransporte: 12.00,
            cestaBasica: 150.00,
            uniforme: 25.00,
        },
        pisosSalariais: {
            limpeza: 1590.00,
            seguranca: 2100.00,
            recepcao: 1750.00,
            jardinagem: 1800.00,
        }
    };

    const [formState, setFormState] = useState<ParametrosCustos>(state.parametros || defaultParams);

    const handleSave = () => {
        updateParametros(formState);
        onClose();
        alert('Parâmetros salvos! Novos cálculos usarão estes valores.');
    };

    const handleChange = (section: keyof ParametrosCustos, key: string, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        setFormState(prev => {
            if (section === 'salarioMinimo') return { ...prev, salarioMinimo: numValue };

            // Handle nested objects
            return {
                ...prev,
                [section]: {
                    ...(prev[section] as any),
                    [key]: numValue
                }
            };
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Parametrização de Custos</h3>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-red-500" /></button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Pisos Salariais */}
                    <section>
                        <h4 className="font-bold text-primary mb-4 border-b pb-2">Pisos Salariais</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(formState.pisosSalariais).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">{key}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={val}
                                        onChange={(e) => handleChange('pisosSalariais', key, e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salário Mínimo</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formState.salarioMinimo}
                                    onChange={(e) => handleChange('salarioMinimo', '', e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Beneficios */}
                    <section>
                        <h4 className="font-bold text-primary mb-4 border-b pb-2">Benefícios (Valor Mensal/Diário)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(formState.beneficios).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={val}
                                        onChange={(e) => handleChange('beneficios', key, e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Aliquotas */}
                    <section>
                        <h4 className="font-bold text-primary mb-4 border-b pb-2">Alíquotas e Margens (Decimais: 0.20 = 20%)</h4>
                        <div className="grid grid-cols-3 gap-4">
                            {Object.entries(formState.aliquotas).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={val}
                                        onChange={(e) => handleChange('aliquotas', key, e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-green-600">
                        <Save className="w-4 h-4" />
                        Salvar Configurações
                    </button>
                </div>
            </div>
        </div>
    );
}
