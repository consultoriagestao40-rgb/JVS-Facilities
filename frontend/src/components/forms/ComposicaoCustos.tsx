"use client";

import { useSimulador } from '@/context/SimuladorContext';
import { useForm } from 'react-hook-form';
import { ArrowRight, ArrowLeft, Package, HardHat, AlertTriangle } from 'lucide-react';

type FormValues = {
    necessitaMateriais: boolean;
    valorMateriais: number;
    insalubridade: boolean;
    grauInsalubridade: string; // "0.20" | "0.40"
    periculosidade: boolean;
    copa: boolean;
};

export default function ComposicaoCustos() {
    const { state, nextStep, prevStep, updateConfiguracao } = useSimulador();

    // Load initial values from context/session if available
    // For MVP, simplified state mapping. Ideally, we would map specific service configs.
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            necessitaMateriais: false,
            valorMateriais: 0,
            insalubridade: false,
            grauInsalubridade: "0.20",
            periculosidade: false,
            copa: false
        }
    });

    const necessitaMateriais = watch('necessitaMateriais');

    const onSubmit = (data: FormValues) => {
        // Update all selected services with these global settings
        // Convert checkbox + value to actual numbers
        const materiaisValue = data.necessitaMateriais ? data.valorMateriais : 0;

        // Update each service configuration with these values
        state.configuracoes.forEach(config => {
            const updatedConfig = {
                ...config,
                // Fix: Only overwrite if 'necessitaMateriais'. Otherwise preserve Step 3 value.
                materiais: data.necessitaMateriais ? data.valorMateriais : config.materiais,
                // adicionalCopa preserved from ...config
                insalubridade: data.insalubridade,
                grauInsalubridade: data.insalubridade ? Number(data.grauInsalubridade) : 0,
                periculosidade: data.periculosidade,
                copa: data.copa // Boolean flag to enable copa calculation
            };
            updateConfiguracao(updatedConfig);
        });

        nextStep();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Composição de Custos e Adicionais</h2>
                <p className="text-gray-500">Detalhe os insumos e especificidades da operação.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Materiais e Equipamentos */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Materiais e Equipamentos</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                            <input
                                type="checkbox"
                                {...register('necessitaMateriais')}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <span className="text-gray-700 font-medium">Incluir fornecimento de materiais</span>
                        </label>

                        {necessitaMateriais && (
                            <div className="ml-8 animate-slide-down">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor Mensal Estimado (R$)
                                </label>
                                <input
                                    type="number"
                                    {...register('valorMateriais', { min: 0 })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    placeholder="Ex: 500,00"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Adicionais Legais */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Adicionais Legais</h3>
                    </div>

                    <div className="space-y-3">
                        {/* INSALUBRIDADE */}
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <label className="flex items-center gap-3 cursor-pointer mb-2">
                                <input
                                    type="checkbox"
                                    {...register('insalubridade')}
                                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                                />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Adicional de Insalubridade</span>
                                </div>
                            </label>

                            {watch('insalubridade') && (
                                <div className="ml-8 mt-2 space-y-2 animate-slide-down">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="0.20"
                                                {...register('grauInsalubridade')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-600">Grau Médio (20%)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="0.40"
                                                {...register('grauInsalubridade')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-600">Grau Máximo (40%)</span>
                                        </label>
                                    </div>
                                    <p className="text-xs text-orange-600 bg-orange-50 p-1 rounded">
                                        Calculado sobre a base definida na regra da CCT.
                                    </p>
                                </div>
                            )}
                        </div>

                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                            <input
                                type="checkbox"
                                {...register('periculosidade')}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <div className="flex flex-col">
                                <span className="text-gray-700 font-medium">Adicional de Periculosidade</span>
                                <span className="text-xs text-gray-500">Risco acentuado (30%)</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                            <input
                                type="checkbox"
                                {...register('copa')}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <div className="flex flex-col">
                                <span className="text-gray-700 font-medium">Adicional de Copa</span>
                                <span className="text-xs text-gray-500">Para funções que manipulam alimentos/copa</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <HardHat className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">Importante</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        Os adicionais serão calculados automaticamente sobre o piso salarial da categoria selecionada, conforme a Convenção Coletiva vigente.
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                </button>

                <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                    Ver Proposta Final
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </form >
    );
}
