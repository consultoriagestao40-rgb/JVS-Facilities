"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SimuladorState, UserData, ServicoTipo, ConfiguracaoServico } from '@/types/simulador';

type SimuladorContextType = {
    state: SimuladorState;
    nextStep: () => void;
    prevStep: () => void;
    updateUserData: (data: UserData) => void;
    toggleServico: (id: ServicoTipo) => void;
    updateConfiguracao: (config: ConfiguracaoServico) => void;
};

const defaultState: SimuladorState = {
    step: 1,
    userData: { nome: '', empresa: '', cnpj: '', email: '', whatsapp: '' },
    servicosSelecionados: [],
    configuracoes: []
};

const SimuladorContext = createContext<SimuladorContextType | undefined>(undefined);

export function SimuladorProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<SimuladorState>(defaultState);

    // Load from sessionStorage on mount
    useEffect(() => {
        const saved = sessionStorage.getItem('jvsserv_simulador');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge loaded state with default structure to ensure all fields exist
                setState(prev => ({
                    ...defaultState,
                    ...parsed,
                    // Ensure nested arrays/objects are also valid if missing
                    configuracoes: parsed.configuracoes || [],
                    servicosSelecionados: parsed.servicosSelecionados || [],
                    userData: { ...defaultState.userData, ...(parsed.userData || {}) }
                }));
            } catch (e) {
                console.error('Failed to load simulador state', e);
            }
        }
    }, []);

    // Save to sessionStorage on change
    useEffect(() => {
        sessionStorage.setItem('jvsserv_simulador', JSON.stringify(state));
    }, [state]);

    const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
    const prevStep = () => setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));

    const updateUserData = (data: UserData) => {
        setState(prev => ({ ...prev, userData: data }));
    };

    const toggleServico = (id: ServicoTipo) => {
        setState(prev => {
            const exists = prev.servicosSelecionados.includes(id);
            const newServicos = exists
                ? prev.servicosSelecionados.filter(s => s !== id)
                : [...prev.servicosSelecionados, id];
            return { ...prev, servicosSelecionados: newServicos };
        });
    };

    const updateConfiguracao = (config: ConfiguracaoServico) => {
        // Logic to add/update config will go here
        // For now simple placeholder
        setState(prev => ({
            ...prev,
            configuracoes: [...prev.configuracoes, config]
        }));
    };

    return (
        <SimuladorContext.Provider value={{
            state,
            nextStep,
            prevStep,
            updateUserData,
            toggleServico,
            updateConfiguracao
        }}>
            {children}
        </SimuladorContext.Provider>
    );
}

export function useSimulador() {
    const context = useContext(SimuladorContext);
    if (context === undefined) {
        throw new Error('useSimulador must be used within a SimuladorProvider');
    }
    return context;
}
