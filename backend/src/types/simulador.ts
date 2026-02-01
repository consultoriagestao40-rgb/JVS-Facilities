export interface ConfiguracaoServico {
    funcao: string;
    estado: string;
    cidade: string;
    dias: string[];
    horarioEntrada: string;
    horarioSaida: string;
    quantidade: number;
    materiais?: number;
    equipamentos?: string[];
    adicionais?: {
        insalubridade?: boolean;
        periculosidade?: boolean;
        noturno?: boolean;
    };
}

export interface BreakdownCustos {
    salarioBase: number;
    adicionais: number;
    beneficios: number;
    encargos: number;
    insumos: number; // Materiais + Equipamentos
    tributos: number;
    lucro: number;
    totalMensal: number;
}

export interface ResultadoSimulacao {
    id: string; // ID da simulação/proposta
    servicos: {
        config: ConfiguracaoServico;
        custoUnitario: number;
        custoTotal: number;
        detalhamento: BreakdownCustos;
    }[];
    resumo: {
        custoMensalTotal: number;
        custoAnualTotal: number;
        impostosTotal: number;
        lucroEstimado: number;
    };
}
