"use client";

import { useState, useEffect } from 'react';
import { useSimulador } from '@/context/SimuladorContext';
import { clsx } from 'clsx';
import { Clock, Users, Calendar, MapPin, Briefcase } from 'lucide-react';
import { ServicoTipo, RegraCCT, ConfiguracaoServico } from '@/types/simulador';

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
    const { state, updateConfiguracao, removeConfiguracao, nextStep, prevStep, updateRegrasCCT } = useSimulador();
    const [localConfigs, setLocalConfigs] = useState<ConfiguracaoServico[]>([]);
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

    // Also sync retrieved Rules to Context so Backend receives them!
    useEffect(() => {
        if (availableRules.length > 0) {
            // @ts-ignore
            if (typeof updateRegrasCCT === 'function') {
                updateRegrasCCT(availableRules);
            }
        }
    }, [availableRules]);

    // Initialize Local State (and ensure IDs/Defaults)
    useEffect(() => {
        const initial = clone(state.configuracoes); // Deep copy to avoid ref issues
        let changed = false;

        // 1. Ensure at least one config exists for each selected service
        state.servicosSelecionados.forEach(type => {
            const hasConfig = initial.some(c => c.servicoId === type);
            if (!hasConfig) {
                initial.push(createDefaultConfig(type));
                changed = true;
            }
        });

        // 2. Cleanup: Remove configs for services that were DESELECTED
        const filtered = initial.filter(c => state.servicosSelecionados.includes(c.servicoId));
        if (filtered.length !== initial.length) changed = true;

        // 3. Ensure IDs and Defaults for existing (Migration)
        filtered.forEach(c => {
            if (!c.id) { c.id = `conf-${Math.random().toString(36).substr(2, 9)}`; changed = true; }
            if (!c.estado) { c.estado = 'PR'; changed = true; } // Fix reset bug
            if (!c.cidade) { c.cidade = 'Curitiba'; changed = true; }
            if (c.quantidade === undefined) { c.quantidade = 1; changed = true; }
        });

        // Set local state.
        // If we really want to persist these "fixes" immediately to context, we could, but local is safer first.
        setLocalConfigs(filtered);
    }, [state.servicosSelecionados]); // Run when selection changes

    const createDefaultConfig = (type: ServicoTipo): ConfiguracaoServico => ({
        id: `conf-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        servicoId: type,
        estado: 'PR',
        cidade: 'Curitiba',
        diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
        horarioEntrada: '08:00',
        horarioSaida: '17:00',
        quantidade: 1,
        materiais: 0,
        adicionalCopa: 0,
        intrajornada: false
    });

    const handleUpdate = (id: string, field: string, value: any) => {
        setLocalConfigs(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleAdd = (type: ServicoTipo) => {
        setLocalConfigs(prev => [...prev, createDefaultConfig(type)]);
    };

    const handleRemove = (id: string) => {
        if (confirm('Remover este profissional?')) {
            setLocalConfigs(prev => prev.filter(c => c.id !== id));
            removeConfiguracao(id); // remove from context too? No, wait till Next? 
            // Better only sync on Next, but removeConfiguracao is sync.
            // Actually, we only sync on Next usually. But removing implies intent. 
            // Let's just keep local consistent.
        }
    };

    const toggleDay = (id: string, dayId: string) => {
        const config = localConfigs.find(c => c.id === id);
        if (!config) return;
        const newDays = config.diasSemana.includes(dayId)
            ? config.diasSemana.filter(d => d !== dayId)
            : [...config.diasSemana, dayId];
        handleUpdate(id, 'diasSemana', newDays);
    };

    const handleNext = () => {
        // Save ALL local configs to context
        localConfigs.forEach(config => {
            updateConfiguracao(config);
        });
        // Also remove any in context that are NOT in local? 
        // Context might have stale ones if we removed locally?
        // Current 'updateConfiguracao' adds/updates. It does NOT remove missing.
        // We should sync properly.
        // Simplest: Iterate context configs, if not in local, remove?
        state.configuracoes.forEach(c => {
            if (!localConfigs.find(lc => lc.id === c.id)) {
                removeConfiguracao(c.id); // This might be buggy if state updates async. 
                // Ideally context should expose 'setConfiguracoes' bulk.
                // But removeConfiguracao works.
            }
        });

        nextStep();
    };

    function clone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Configure os Serviços</h2>
                <p className="text-gray-500">Defina localização, cargo, dias e horários para cada profissional.</p>
            </div>

            <div className="space-y-8">
                {state.servicosSelecionados.map(serviceType => {
                    // Filter configs for this Service Type
                    const configs = localConfigs.filter(c => c.servicoId === serviceType);

                    return (
                        <div key={serviceType} className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                                    {/* Icon could go here */}
                                    {serviceType}
                                </h3>
                                <button
                                    onClick={() => handleAdd(serviceType)}
                                    className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100 font-medium transition-colors flex items-center gap-1"
                                >
                                    + Adicionar Outro Profissional
                                </button>
                            </div>

                            {configs.map((config, index) => {
                                // Logic for Roles (same as before)
                                const serviceRules = availableRules.filter(r => r.funcao === serviceType);
                                const uniqueUfs = Array.from(new Set(serviceRules.map(r => r.uf))).filter(Boolean);
                                const selectedUF = config.estado || '';
                                const selectedCargo = config.cargo || '';
                                const rulesForUF = serviceRules.filter(r => r.uf === selectedUF);
                                let availableRoles: { label: string, value: string }[] = [];
                                rulesForUF.forEach(r => {
                                    if (r.cargos && r.cargos.length > 0) {
                                        r.cargos.forEach(c => availableRoles.push({ label: c.nome, value: c.nome }));
                                    } else if (r.cargo) {
                                        availableRoles.push({ label: r.cargo, value: r.cargo });
                                    }
                                });
                                availableRoles = Array.from(new Set(availableRoles.map(a => a.value)))
                                    .map(value => availableRoles.find(a => a.value === value)!);

                                return (
                                    <div key={config.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative">
                                        <div className="absolute top-4 right-4 text-xs font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded">
                                            #{index + 1}
                                        </div>
                                        {configs.length > 1 && (
                                            <button
                                                onClick={() => handleRemove(config.id)}
                                                className="absolute top-4 right-16 text-red-400 hover:text-red-600 p-1"
                                                title="Remover Profissional"
                                            >
                                                <Users size={16} /> <span className="text-xs">Remover</span>
                                            </button>
                                        )}

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
                                                            handleUpdate(config.id, 'estado', e.target.value);
                                                            handleUpdate(config.id, 'cargo', ''); // Reset cargo
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
                                                        value={config.cidade || ''}
                                                        onChange={(e) => handleUpdate(config.id, 'cidade', e.target.value)}
                                                        placeholder="Ex: Curitiba"
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                                    />
                                                </div>

                                                {/* Cargo */}
                                                <div className="md:col-span-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                                        <Briefcase size={16} /> Cargo / Função
                                                    </label>
                                                    <select
                                                        value={selectedCargo}
                                                        onChange={(e) => handleUpdate(config.id, 'cargo', e.target.value)}
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
                                                                onClick={() => toggleDay(config.id, day.id)}
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
                                                        onChange={(e) => handleUpdate(config.id, 'horarioEntrada', e.target.value)}
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
                                                        onChange={(e) => handleUpdate(config.id, 'horarioSaida', e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Quantidade */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                                    <Users size={16} /> Quantidade (Deste perfil)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={config.quantidade}
                                                    onChange={(e) => handleUpdate(config.id, 'quantidade', parseInt(e.target.value) || 1)}
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
                                                    onChange={(e) => handleUpdate(config.id, 'materiais', parseFloat(e.target.value) || 0)}
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
                                                    value={config.adicionalCopa || ''}
                                                    onChange={(e) => handleUpdate(config.id, 'adicionalCopa', parseFloat(e.target.value) || 0)}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>

                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-4">
                                                <input
                                                    type="checkbox"
                                                    id={`intrajornada-${config.id}`}
                                                    checked={!!config.intrajornada}
                                                    onChange={(e) => handleUpdate(config.id, 'intrajornada', e.target.checked)}
                                                    className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                                                />
                                                <label htmlFor={`intrajornada-${config.id}`} className="text-sm text-gray-700 cursor-pointer select-none">
                                                    <strong>Indenizar Intrajornada</strong> (Pagar 1h Extra/dia por supressão de intervalo)
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
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
