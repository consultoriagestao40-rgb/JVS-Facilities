import { SimuladorState, ResultadoSimulacao } from '../types/simulador';

// Use relative path by default to work with Next.js Rewrites/API Routes automatically
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Backend expects valid payload
interface BackendConfigPayload {
    funcao: string;
    estado: string;
    cidade: string;
    dias: string[];
    horarioEntrada: string;
    horarioSaida: string;
    quantidade: number;
    materiais?: number;
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
            estado: 'SP', // Default for MVP
            cidade: 'São Paulo', // Default for MVP
            dias: config.diasSemana,
            horarioEntrada: config.horarioEntrada,
            horarioSaida: config.horarioSaida,
            quantidade: config.quantidade,
            // Assuming we stored materials/adicionais in step 4 in a way we can access here
            // For MVP, passing defaults or mock values if not in config array yet
            materiais: 0,
            adicionais: {
                insalubridade: false,
                periculosidade: false
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

