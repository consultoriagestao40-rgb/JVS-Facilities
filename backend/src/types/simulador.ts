export interface ConfiguracaoServico {
    id: string; // Unique ID
    servicoId: string; // matches ServicoTipo on frontend
    funcao: string; // Legacy field for backend, will keep for compatibility
    estado: string;
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
}

export interface BreakdownCustos {
    salarioBase: number;
    gratificacoes?: number;
    adicionais: {
        insalubridade: number;
        periculosidade: number;
        noturno: number;
        intrajornada: number;
        dsr: number;
        copa: number; // Moved from beneficios in sync with frontend
        total: number;
    };
    beneficios: {
        valeRefeicao: number;
        valeTransporte: number;
        cestaBasica: number;
        uniforme: number;
        vaSobreFerias: number;
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
    custosOperacionais: {
        examesMedicos: number;
        total: number;
    };
    insumos: number; // Materiais + Equipamentos
    tributos: number;
    lucro: number;
    totalMensal: number;
}

export interface ResultadoSimulacao {
    id: string;
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

