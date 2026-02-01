"use client";

import { useState } from 'react';
import { useSimulador } from '@/context/SimuladorContext';
import { clsx } from 'clsx';
import { Clock, Users, Calendar } from 'lucide-react';
import { ServicoTipo } from '@/types/simulador';

const DAYS = [
    { id: 'seg', label: 'Seg' },
    { id: 'ter', label: 'Ter' },
    { id: 'qua', label: 'Qua' },
    { id: 'qui', label: 'Qui' },
    { id: 'sex', label: 'Sex' },
    { id: 'sab', label: 'Sáb' },
    { id: 'dom', label: 'Dom' },
];

export default function ConfiguracaoServicos() {
    const { state, updateConfiguracao, nextStep, prevStep } = useSimulador();
    const [localConfigs, setLocalConfigs] = useState(state.configuracoes);

    // Helper to get config for a specific service or return default
    const getConfig = (serviceId: ServicoTipo) => {
        return localConfigs.find(c => c.servicoId === serviceId) || {
            servicoId: serviceId,
            diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
            horarioEntrada: '08:00',
            horarioSaida: '18:00',
            quantidade: 1
        };
    };

    const handleUpdate = (serviceId: ServicoTipo, field: string, value: any) => {
        setLocalConfigs(prev => {
            const existing = prev.find(c => c.servicoId === serviceId);
            let updated;

            if (existing) {
                updated = prev.map(c => c.servicoId === serviceId ? { ...c, [field]: value } : c);
            } else {
                const newConfig = {
                    servicoId: serviceId,
                    diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
                    horarioEntrada: '08:00',
                    horarioSaida: '18:00',
                    quantidade: 1,
                    [field]: value
                };
                updated = [...prev, newConfig];
            }
            return updated;
        });
    };

    const toggleDay = (serviceId: ServicoTipo, dayId: string) => {
        const config = getConfig(serviceId);
        const newDays = config.diasSemana.includes(dayId)
            ? config.diasSemana.filter(d => d !== dayId)
            : [...config.diasSemana, dayId];
        handleUpdate(serviceId, 'diasSemana', newDays);
    };

    const handleNext = () => {
        // Save all current local configs to context
        state.servicosSelecionados.forEach(serviceId => {
            const config = getConfig(serviceId);
            updateConfiguracao(config);
        });
        nextStep();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Configure os Serviços</h2>
                <p className="text-gray-500">Defina os dias, horários e quantidade de profissionais para cada serviço.</p>
            </div>

            <div className="space-y-6">
                {state.servicosSelecionados.map(serviceId => {
                    const config = getConfig(serviceId);
                    return (
                        <div key={serviceId} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-primary border-b border-gray-100 pb-2">
                                {serviceId}
                            </h3>

                            <div className="space-y-6">
                                {/* Dias da Semana */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                        <Calendar size={18} /> Dias de Atuação
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {DAYS.map(day => {
                                            const isSelected = config.diasSemana.includes(day.id);
                                            return (
                                                <button
                                                    key={day.id}
                                                    onClick={() => toggleDay(serviceId, day.id)}
                                                    className={clsx(
                                                        "px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200",
                                                        isSelected
                                                            ? "bg-primary text-white border-primary shadow-sm"
                                                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                                                    )}
                                                >
                                                    {day.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Horários */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Clock size={18} /> Horário de Trabalho
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={config.horarioEntrada}
                                                onChange={(e) => handleUpdate(serviceId, 'horarioEntrada', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            />
                                            <span className="text-gray-400">às</span>
                                            <input
                                                type="time"
                                                value={config.horarioSaida}
                                                onChange={(e) => handleUpdate(serviceId, 'horarioSaida', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Quantidade */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Users size={18} /> Profissionais
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={config.quantidade}
                                            onChange={(e) => handleUpdate(serviceId, 'quantidade', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-4">
                                    <input
                                        type="checkbox"
                                        id={`intrajornada-${serviceId}`}
                                        checked={!!config.intrajornada}
                                        onChange={(e) => handleUpdate(serviceId, 'intrajornada', e.target.checked)}
                                        className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                                    />
                                    <label htmlFor={`intrajornada-${serviceId}`} className="text-sm text-gray-700 cursor-pointer select-none">
                                        <strong>Indenizar Intrajornada</strong> (Pagar 1h Extra/dia por supressão de intervalo)
                                    </label>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
                <button
                    onClick={prevStep}
                    className="text-gray-500 hover:text-gray-800 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    &larr; Voltar
                </button>
                <button
                    onClick={handleNext}
                    className="bg-primary hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5"
                >
                    Calcular Custos &rarr;
                </button>
            </div>
        </div>
    );
}
