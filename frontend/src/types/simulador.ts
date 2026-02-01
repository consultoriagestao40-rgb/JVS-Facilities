export type UserData = {
    nome: string;
    empresa: string;
    cnpj: string;
    email: string;
    whatsapp: string;
};

export type ServicoTipo = 'LIMPEZA' | 'PORTARIA' | 'RECEPCAO' | 'SEGURANCA' | 'JARDINAGEM' | 'MANUTENCAO';

export type ServicoSelecionado = {
    id: ServicoTipo;
    nome: string;
    icon: string; // Name of lucide-react icon
};

export type ConfiguracaoServico = {
    servicoId: ServicoTipo;
    diasSemana: string[]; // ['seg', 'ter', ...]
    horarioEntrada: string; // '08:00'
    horarioSaida: string; // '17:00'
    quantidade: number;
};

export type SimuladorState = {
    step: number;
    userData: UserData;
    servicosSelecionados: ServicoTipo[];
    configuracoes: ConfiguracaoServico[];
    // Future: materiais, equipamentos, etc.
};

// API Types (Matched with Backend)
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
    id: string;
    servicos: {
        config: any; // Using any to avoid conflict with frontend specific config type for now, or we define BackendConfiguracaoServico
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
