import { SimuladorState, ResultadoSimulacao } from '../types/simulador';

// Use relative path by default to work with Next.js Rewrites/API Routes automatically
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Backend expects valid payload
interface BackendConfigPayload {
    funcao: string;
    estado: string;
    cidade: string;
    cargo?: string;
    dias: string[];
    horarioEntrada: string;
    horarioSaida: string;
    quantidade: number;
    materiais?: number;
    adicionalCopa?: number;
    intrajornada?: boolean;
    adicionais?: {
        insalubridade?: boolean;
        periculosidade?: boolean;
    };
}

export const simuladorService = {
    async calcularProposta(state: SimuladorState): Promise<ResultadoSimulacao> {
        // Map Frontend State to Backend Payload
        const configs: BackendConfigPayload[] = state.configuracoes.map(config => ({
            funcao: config.servicoId,
            // USE ACTUAL VALUES FROM CONFIG, NOT HARDCODED!
            estado: (config as any).estado || 'PR', // Use config state, fallback to PR
            cidade: (config as any).cidade || 'Curitiba', // Use config city
            cargo: (config as any).cargo, // Pass selected cargo/role
            dias: config.diasSemana,
            horarioEntrada: config.horarioEntrada,
            horarioSaida: config.horarioSaida,
            quantidade: config.quantidade,
            // PASS ACTUAL MATERIALS AND COPA FROM USER INPUT
            materiais: config.materiais || 0,
            adicionalCopa: (config as any).adicionalCopa || 0,
            intrajornada: config.intrajornada || false,
            copa: (config as any).copa || false, // Pass the checkbox flag
            adicionais: {
                insalubridade: (config as any).insalubridade || false,
                periculosidade: (config as any).periculosidade || false
            }
        }));

        // Use the configured API_URL (from env or default)
        const response = await fetch(`${API_URL}/simulador/calcular`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                configs,
                userData: state.userData, // Pass User Data for Lead generation
                parametros: state.parametros,
                regrasCCT: state.regrasCCT // Pass rules to backend for lookup
            }),
        });

        if (!response.ok) {
            throw new Error('Falha ao calcular proposta');
        }

        return response.json();
    }
};

