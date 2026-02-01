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
    gratificacoes?: number; // New field
    adicionais: {
        insalubridade: number;
        periculosidade: number;
        noturno: number; // New
        intrajornada: number; // New
        dsr: number; // New
        total: number;
    };
    beneficios: {
        valeRefeicao: number;
        valeTransporte: number;
        cestaBasica: number;
        uniforme: number;
        adicionalCopa: number; // Moved from adicionais
        vaSobreFerias: number; // New cost
        descontoVA: number; // Negative value
        descontoVT: number; // Negative value
        total: number;
    };
    encargos: number; // INSS + FGTS + RAT
    provisoes?: { // Optional for now to avoid breaking too much logic
        ferias: number;
        decimoTerceiro: number;
        rescisao: number;
        total: number;
    };
    custosOperacionais?: { // New Section, optional
        examesMedicos: number;
        total: number;
    };
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
