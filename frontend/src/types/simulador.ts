export type UserData = {
    nome: string;
    empresa: string;
    cnpj: string;
    email: string;
    whatsapp: string;
};

export type ServicoTipo = 'LIMPEZA' | 'PORTARIA' | 'RECEPCAO' | 'SEGURANCA' | 'JARDINAGEM' | 'MANUTENCAO' | 'COZINHA';

export type ServicoSelecionado = {
    id: ServicoTipo;
    nome: string;
    icon: string; // Name of lucide-react icon
};

export type ConfiguracaoServico = {
    id: string; // Unique ID (UUID)
    servicoId: ServicoTipo;
    estado: string; // Moved from 'any'
    cidade: string;
    diasSemana: string[]; // ['seg', 'ter', ...]
    horarioEntrada: string; // '08:00'
    horarioSaida: string; // '17:00'
    quantidade: number;
    intrajornada?: boolean; // Suppress break?
    cargo?: string; // Selected Sub-role (e.g. 'Zelador')
    materiais?: number; // Cost of materials
    adicionalCopa?: number; // Manual additional cost
    grauInsalubridade?: number; // 0.1, 0.2, 0.4
};


export interface RegraCCT {
    id: string;
    uf: string;
    cidade: string; // '*' for all cities in UF if needed
    funcao: string; // 'LIMPEZA', 'PORTARIA', etc.
    cargo?: string; // Legacy: Specific Role
    cargos?: { nome: string; piso: number; gratificacao?: number; adicionalCopa?: number }[]; // New: List of Roles
    dataVigencia: string;
    salarioPiso: number; // Default Floor
    gratificacoes?: number; // Extra payment
    beneficios: {
        valeRefeicao: number;
        tipoValeRefeicao?: 'DIARIO' | 'MENSAL';
        valeTransporte: number;
        cestaBasica: number;
        uniforme: number; // Will serve as monthly uniform cost
        adicionalCopa?: number; // New field
    };
    custosOperacionais: {
        examesMedicos: number; // Mensal
        uniformeEpis: number; // Mensal - if separate from benefits? Or replace. Let's keep distinct.
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
        grauInsalubridade: number; // e.g. 0.20, 0.40
        baseInsalubridade: 'SALARIO_MINIMO' | 'SALARIO_BASE';
        periculosidade: boolean;
    };
    provisoes: {
        ferias: number;
        decimoTerceiro: number;
        rescisao: number;
    };
    configuracoesBeneficios?: {
        descontoVT: number; // e.g. 0.06
        descontoVA: number; // e.g. 0.20
        vaSobreFerias: boolean;
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
    gratificacoes?: number; // New field
    adicionais: {
        insalubridade: number;
        periculosidade: number;
        noturno: number; // New
        intrajornada: number; // New
        dsr: number; // New
        copa: number; // Moved from beneficios
        total: number;
    };
    beneficios: {
        valeRefeicao: number;
        valeTransporte: number;
        cestaBasica: number;
        uniforme: number;
        // adicionalCopa removed
        vaSobreFerias: number; // New cost
        descontoVA: number; // Negative value
        descontoVT: number; // Negative value
        total: number;
    };
    encargos: number; // INSS + FGTS + RAT
    provisoes: {
        ferias: number;
        decimoTerceiro: number;
        rescisao: number;
        total: number;
    };
    custosOperacionais: { // New Section
        examesMedicos: number;
        total: number;
    };
    insumos: number; // Materiais + Equipamentos
    tributos: number;
    lucro: number;
    totalMensal: number;
}

// Exported Item Result for component usage
export interface ItemResultado {
    config: any;
    custoUnitario: number;
    custoTotal: number;
    detalhamento: BreakdownCustos;
}

export interface ResultadoSimulacao {
    id: string;
    servicos: ItemResultado[];
    resumo: {
        custoMensalTotal: number;
        custoAnualTotal: number;
        impostosTotal: number;
        lucroEstimado: number;
    };
}
