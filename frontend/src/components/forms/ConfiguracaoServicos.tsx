"use client";

import { useState, useEffect } from 'react';
import { useSimulador } from '@/context/SimuladorContext';
import { clsx } from 'clsx';
import { Clock, Users, Calendar, MapPin, Briefcase } from 'lucide-react';
import { ServicoTipo, RegraCCT } from '@/types/simulador';

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
    const [availableRules, setAvailableRules] = useState<RegraCCT[]>([]);
    const [loadingRules, setLoadingRules] = useState(true);

    // Fetch Rules on Mount
    useEffect(() => {
        async function fetchRules() {
            try {
                const res = await fetch('/api/simulador/regras');
                if (res.ok) {
                    const data = await res.json();
                    setAvailableRules(data);
                }
            } catch (error) {
                console.error("Failed to fetch CCT rules", error);
            } finally {
                setLoadingRules(false);
            }
        }
        fetchRules();
    }, []);

    // Helper to get config for a specific service or return default
    const getConfig = (serviceId: ServicoTipo) => {
        return localConfigs.find(c => c.servicoId === serviceId) || {
            servicoId: serviceId,
            diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
            horarioEntrada: '08:00',
            horarioSaida: '18:00',
            quantidade: 1,
            // Default first available rule values will be set if missing
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
                <p className="text-gray-500">Defina localização, cargo, dias e horários para cada serviço.</p>
            </div>

            <div className="space-y-6">
                {state.servicosSelecionados.map(serviceId => {
                    const config = getConfig(serviceId);

                    // Filter rules for this service type
                    const serviceRules = availableRules.filter(r => r.funcao === serviceId);
                    // Extract unique UFs
                    const uniqueUfs = Array.from(new Set(serviceRules.map(r => r.uf))).filter(Boolean); // Filter out undefined/null

                    // Get currently selected Rule based on State (if selected)
                    // We assume State is selected first.
                    // Actually, 'config' might not have 'estado' yet. We need to store it in 'config'.
                    // We will piggyback on 'state' in backend payload, here let's add it to localConfig.
                    // But 'ConfiguracaoServico' type might need update? No, we can just pass it as extra props for now, 
                    // or ideally update the type. Backend expects 'estado', 'cidade'.

                    const selectedUF = (config as any).estado || '';
                    const selectedCargo = config.cargo || '';

                    // Filter Cargos based on UF
                    const rulesForUF = serviceRules.filter(r => r.uf === selectedUF);

                    // Aggregate Roles from rules
                    let availableRoles: { label: string, value: string }[] = [];
                    rulesForUF.forEach(r => {
                        if (r.cargos && r.cargos.length > 0) {
                            r.cargos.forEach(c => availableRoles.push({ label: c.nome, value: c.nome }));
                        } else if (r.cargo) {
                            availableRoles.push({ label: r.cargo, value: r.cargo });
                        }
                    });
                    // Unique roles
                    availableRoles = Array.from(new Set(availableRoles.map(a => a.value)))
                        .map(value => availableRoles.find(a => a.value === value)!);

                    return (
                        <div key={serviceId} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-primary border-b border-gray-100 pb-2">
                                {serviceId}
                            </h3>

                            <div className="space-y-6">
                                {/* Location & Role Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    {/* Estado */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                            <MapPin size={16} /> Estado (UF)
                                        </label>
                                        <select
                                            value={selectedUF}
                                            onChange={(e) => {
                                                handleUpdate(serviceId, 'estado', e.target.value);
                                                handleUpdate(serviceId, 'cargo', ''); // Reset cargo
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="">Selecione...</option>
                                            {uniqueUfs.map(uf => (
                                                <option key={uf} value={uf}>{uf}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Cidade */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            value={(config as any).cidade || ''}
                                            onChange={(e) => handleUpdate(serviceId, 'cidade', e.target.value)}
                                            placeholder="Ex: Curitiba"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        <span className="text-xs text-gray-400 mt-1">Deixe vazio para regra geral do Estado</span>
                                    </div>

                                    {/* Cargo */}
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                            <Briefcase size={16} /> Cargo / Função
                                        </label>
                                        <select
                                            value={selectedCargo}
                                            onChange={(e) => handleUpdate(serviceId, 'cargo', e.target.value)}
                                            disabled={!selectedUF}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <option value="">{selectedUF ? 'Selecione o Cargo...' : 'Selecione o Estado primeiro'}</option>
                                            {availableRoles.map(role => (
                                                <option key={role.value} value={role.value}>{role.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>


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
                                                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                                        isSelected
                                                            ? "bg-primary text-white shadow-sm"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    )}
                                                >
                                                    {day.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Horários */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                            <Clock size={16} /> Entrada
                                        </label>
                                        <input
                                            type="time"
                                            value={config.horarioEntrada}
                                            onChange={(e) => handleUpdate(serviceId, 'horarioEntrada', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                            <Clock size={16} /> Saída
                                        </label>
                                        <input
                                            type="time"
                                            value={config.horarioSaida}
                                            onChange={(e) => handleUpdate(serviceId, 'horarioSaida', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Quantidade */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <Users size={16} /> Quantidade de Profissionais
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={config.quantidade}
                                        onChange={(e) => handleUpdate(serviceId, 'quantidade', parseInt(e.target.value) || 1)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>

                                {/* Materiais e Equipamentos */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <Briefcase size={16} /> Materiais e Equipamentos (R$)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={config.materiais || ''}
                                        onChange={(e) => handleUpdate(serviceId, 'materiais', parseFloat(e.target.value) || 0)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>

                                {/* Adicional de Copa */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <Briefcase size={16} /> Adicional de Copa (R$)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={(config as any).adicionalCopa || ''}
                                        onChange={(e) => handleUpdate(serviceId, 'adicionalCopa', parseFloat(e.target.value) || 0)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                    />
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

                                { /* Legacy Cargo Selector Removed */}
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
