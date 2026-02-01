import { NextResponse } from 'next/server';

// --- Types ---
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

interface BreakdownCustos {
    salarioBase: number;
    adicionais: number;
    beneficios: number;
    encargos: number;
    insumos: number;
    tributos: number;
    lucro: number;
    totalMensal: number;
}

// --- Logic (Ported from CalculoService) ---
const ALIQUOTAS = {
    INSS: 0.20,
    FGTS: 0.08,
    RAT: 0.02,
    PIS: 0.0165,
    COFINS: 0.076,
    ISS_PADRAO: 0.05,
    MARGEM_LUCRO: 0.15,
};

const VALORES_BASE = {
    SALARIO_MINIMO: 1412.00,
    VALE_REFEICAO_DIA: 25.00,
    VALE_TRANSPORTE_DIA: 12.00,
    CESTA_BASICA: 150.00,
    UNIFORME_MENSAL: 25.00,
};

function getPisoSalarial(funcao: string): number {
    const normalized = funcao.toLowerCase();
    if (normalized.includes('limpeza')) return 1590.00;
    if (normalized.includes('seguranca') || normalized.includes('vigilante')) return 2100.00;
    if (normalized.includes('recepcao')) return 1750.00;
    if (normalized.includes('jardineiro')) return 1800.00;
    return VALORES_BASE.SALARIO_MINIMO;
}

function calcularAdicionais(base: number, configAdicionais?: BackendConfigPayload['adicionais']): number {
    let total = 0;
    if (configAdicionais?.insalubridade) total += VALORES_BASE.SALARIO_MINIMO * 0.20;
    if (configAdicionais?.periculosidade) total += base * 0.30;
    return total;
}

function calcularBeneficios(dias: number): number {
    const vr = dias * VALORES_BASE.VALE_REFEICAO_DIA;
    const vt = dias * VALORES_BASE.VALE_TRANSPORTE_DIA;
    return vr + vt + VALORES_BASE.CESTA_BASICA + VALORES_BASE.UNIFORME_MENSAL;
}

function calcularEncargos(baseCalculo: number): number {
    const { INSS, FGTS, RAT } = ALIQUOTAS;
    const provisionRate = 0.35;
    const basicCharges = baseCalculo * (INSS + FGTS + RAT);
    const provisions = baseCalculo * provisionRate;
    return basicCharges + provisions;
}

function calcularItem(config: BackendConfigPayload) {
    // 1. Base
    const salarioBase = getPisoSalarial(config.funcao);

    // 2. Adicionais
    const adicionais = calcularAdicionais(salarioBase, config.adicionais);
    const remuneracaoTotal = salarioBase + adicionais;

    // 3. Beneficios
    const diasTrabalhados = config.dias.length * 4.33;
    const beneficios = calcularBeneficios(diasTrabalhados);

    // 4. Encargos
    const encargos = calcularEncargos(remuneracaoTotal);

    // 5. Insumos
    const insumos = (config.materiais || 0);

    // Subtotal
    const custoOperacional = remuneracaoTotal + beneficios + encargos + insumos;

    // 6. Lucro
    const lucro = custoOperacional * ALIQUOTAS.MARGEM_LUCRO;

    // 7. Impostos
    const precoSemImpostos = custoOperacional + lucro;
    const totalImpostosRate = ALIQUOTAS.PIS + ALIQUOTAS.COFINS + ALIQUOTAS.ISS_PADRAO;
    const precoFinal = precoSemImpostos / (1 - totalImpostosRate);
    const tributos = precoFinal - precoSemImpostos;

    const custoTotal = precoFinal * config.quantidade;

    const detalhamento: BreakdownCustos = {
        salarioBase,
        adicionais,
        beneficios,
        encargos,
        insumos,
        tributos,
        lucro,
        totalMensal: precoFinal
    };

    return {
        config, // Return original config as reference
        custoUnitario: precoFinal,
        custoTotal,
        detalhamento
    };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const configs = body.configs as BackendConfigPayload[];

        if (!configs || !Array.isArray(configs) || configs.length === 0) {
            return NextResponse.json(
                { error: 'Invalid Input', message: 'Lista de configurações vazia.' },
                { status: 400 }
            );
        }

        const servicosCalculados = configs.map(config => calcularItem(config));

        const resumo = servicosCalculados.reduce((acc, item) => ({
            custoMensalTotal: acc.custoMensalTotal + item.custoTotal,
            custoAnualTotal: acc.custoAnualTotal + (item.custoTotal * 12),
            impostosTotal: acc.impostosTotal + item.detalhamento.tributos,
            lucroEstimado: acc.lucroEstimado + item.detalhamento.lucro
        }), { custoMensalTotal: 0, custoAnualTotal: 0, impostosTotal: 0, lucroEstimado: 0 });

        const responseData = {
            id: `PROP-${Date.now()}`,
            servicos: servicosCalculados,
            resumo
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Erro no cálculo:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Erro ao processar cálculo.' },
            { status: 500 }
        );
    }
}
