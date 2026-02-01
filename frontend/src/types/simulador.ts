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


export interface RegraCCT {
    id: string;
    uf: string;
    cidade: string; // '*' for all cities in UF if needed
    funcao: string; // 'LIMPEZA', 'PORTARIA', etc.
    dataVigencia: string;
    salarioPiso: number;
    beneficios: {
        valeRefeicao: number;
        valeTransporte: number;
        cestaBasica: number;
        uniforme: number;
    };
    aliquotas: {
        inss: number;
        fgts: number;
        rat: number;
        pis: number;
        cofins: number;
        iss: number;
        margemLucro: number;
    };
    adicionais: {
        insalubridade: boolean;
        periculosidade: boolean;
    };
}

export interface ParametrosCustos {
    salarioMinimo: number;
    aliquotas: {
        inss: number;
        fgts: number;
        rat: number;
        pis: number;
        cofins: number;
        iss: number;
        margemLucro: number;
    };
    beneficios: {
        valeRefeicao: number;
        valeTransporte: number;
        cestaBasica: number;
        uniforme: number;
    };
    pisosSalariais: {
        limpeza: number;
        seguranca: number;
        recepcao: number;
        jardinagem: number;
    };
}

export type SimuladorState = {
    step: number;
    userData: UserData;
    servicosSelecionados: ServicoTipo[];
    configuracoes: ConfiguracaoServico[];
    parametros?: ParametrosCustos;
    regrasCCT?: RegraCCT[]; // List of custom rules
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
