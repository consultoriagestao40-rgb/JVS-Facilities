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

interface ParametrosCustos {
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

// --- Logic ---

// Helper to get values from params or defaults
const getValores = (params?: ParametrosCustos) => {
    return {
        ALIQUOTAS: {
            INSS: params?.aliquotas.inss ?? 0.20,
            FGTS: params?.aliquotas.fgts ?? 0.08,
            RAT: params?.aliquotas.rat ?? 0.02,
            PIS: params?.aliquotas.pis ?? 0.0165,
            COFINS: params?.aliquotas.cofins ?? 0.076,
            ISS_PADRAO: params?.aliquotas.iss ?? 0.05,
            MARGEM_LUCRO: params?.aliquotas.margemLucro ?? 0.15,
        },
        VALORES_BASE: {
            SALARIO_MINIMO: params?.salarioMinimo ?? 1412.00,
            VALE_REFEICAO_DIA: params?.beneficios.valeRefeicao ?? 25.00,
            VALE_TRANSPORTE_DIA: params?.beneficios.valeTransporte ?? 12.00,
            CESTA_BASICA: params?.beneficios.cestaBasica ?? 150.00,
            UNIFORME_MENSAL: params?.beneficios.uniforme ?? 25.00,
        },
        PISOS: params?.pisosSalariais ?? {
            limpeza: 1590.00,
            seguranca: 2100.00,
            recepcao: 1750.00,
            jardinagem: 1800.00
        }
    };
};


function getPisoSalarial(funcao: string, valores: ReturnType<typeof getValores>): number {
    const normalized = funcao.toLowerCase();
    if (normalized.includes('limpeza')) return valores.PISOS.limpeza;
    if (normalized.includes('seguranca') || normalized.includes('vigilante')) return valores.PISOS.seguranca;
    if (normalized.includes('recepcao')) return valores.PISOS.recepcao;
    if (normalized.includes('jardineiro')) return valores.PISOS.jardinagem;
    return valores.VALORES_BASE.SALARIO_MINIMO;
}

function calcularAdicionais(base: number, valores: ReturnType<typeof getValores>, configAdicionais?: BackendConfigPayload['adicionais']): number {
    let total = 0;
    if (configAdicionais?.insalubridade) total += valores.VALORES_BASE.SALARIO_MINIMO * 0.20;
    if (configAdicionais?.periculosidade) total += base * 0.30;
    return total;
}

function calcularBeneficios(dias: number, valores: ReturnType<typeof getValores>): number {
    const vr = dias * valores.VALORES_BASE.VALE_REFEICAO_DIA;
    const vt = dias * valores.VALORES_BASE.VALE_TRANSPORTE_DIA;
    return vr + vt + valores.VALORES_BASE.CESTA_BASICA + valores.VALORES_BASE.UNIFORME_MENSAL;
}

function calcularEncargos(baseCalculo: number, valores: ReturnType<typeof getValores>): number {
    const { INSS, FGTS, RAT } = valores.ALIQUOTAS;
    const provisionRate = 0.35;
    const basicCharges = baseCalculo * (INSS + FGTS + RAT);
    const provisions = baseCalculo * provisionRate;
    return basicCharges + provisions;
}

function calcularItem(config: BackendConfigPayload, valores: ReturnType<typeof getValores>) {
    // 1. Base
    const salarioBase = getPisoSalarial(config.funcao, valores);

    // 2. Adicionais
    const adicionais = calcularAdicionais(salarioBase, valores, config.adicionais);
    const remuneracaoTotal = salarioBase + adicionais;

    // 3. Beneficios
    const diasTrabalhados = config.dias.length * 4.33;
    const beneficios = calcularBeneficios(diasTrabalhados, valores);

    // 4. Encargos
    const encargos = calcularEncargos(remuneracaoTotal, valores);

    // 5. Insumos
    const insumos = (config.materiais || 0);

    // Subtotal
    const custoOperacional = remuneracaoTotal + beneficios + encargos + insumos;

    // 6. Lucro
    const lucro = custoOperacional * valores.ALIQUOTAS.MARGEM_LUCRO;

    // 7. Impostos
    const precoSemImpostos = custoOperacional + lucro;
    const totalImpostosRate = valores.ALIQUOTAS.PIS + valores.ALIQUOTAS.COFINS + valores.ALIQUOTAS.ISS_PADRAO;
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
        const parametros = body.parametros as ParametrosCustos | undefined;

        if (!configs || !Array.isArray(configs) || configs.length === 0) {
            return NextResponse.json(
                { error: 'Invalid Input', message: 'Lista de configurações vazia.' },
                { status: 400 }
            );
        }

        // Initialize values with provided params or defaults
        const valores = getValores(parametros);

        const servicosCalculados = configs.map(config => calcularItem(config, valores));

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
