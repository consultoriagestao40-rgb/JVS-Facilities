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

// Detailed Breakdown used internally for calculations
interface DetailedBreakdown {
    ferias: number;
    decimoTerceiro: number;
    rescisao: number;
}


// --- Logic ---
// --- Logic ---
import { ParametrosCustos, RegraCCT, BreakdownCustos } from '@/types/simulador';

// Helper to look up CCT Rule
// Prioritize: Explicit City Match -> State Match (Wildcard) -> Default Global Param
const getMatchingRule = (
    config: BackendConfigPayload,
    regras: RegraCCT[] | undefined,
    globalParams: ReturnType<typeof getValores>
) => {
    if (!regras || regras.length === 0) return null;

    // 1. Try Exact City Match
    const cityMatch = regras.find(r =>
        r.uf === config.estado &&
        r.cidade?.toLowerCase() === config.cidade?.toLowerCase() &&
        r.funcao === config.funcao
    );
    if (cityMatch) return cityMatch;

    // 2. Try State Match (Empty city or '*')
    const stateMatch = regras.find(r =>
        r.uf === config.estado &&
        (!r.cidade || r.cidade === '*') &&
        r.funcao === config.funcao
    );
    if (stateMatch) return stateMatch;

    return null;
};

// Helper to get values merging Global + Rule
const getValoresFinais = (
    match: RegraCCT | null,
    global: ReturnType<typeof getValores>
) => {
    // If no rule, use defaults + standard provision rates (1/12, etc)
    if (!match) {
        return {
            ...global,
            PROVISOES: {
                // Default Standard CLT Rates if not configured
                FERIAS: 0.1111, // ~11.11%
                DECIMO_TERCEIRO: 0.0833, // ~8.33%
                RESCISAO: 0.05 // 5%
            }
        };
    }

    return {
        // Rule overrides global
        ALIQUOTAS: { ...global.ALIQUOTAS, ...match.aliquotas },
        VALORES_BASE: {
            ...global.VALORES_BASE,
            SALARIO_MINIMO: match.salarioPiso,
            VALE_REFEICAO_DIA: match.beneficios.valeRefeicao,
            VALE_TRANSPORTE_DIA: match.beneficios.valeTransporte,
            CESTA_BASICA: match.beneficios.cestaBasica,
            UNIFORME_MENSAL: match.beneficios.uniforme
        },
        PISOS: {
            ...global.PISOS,
            [match.funcao.toLowerCase()]: match.salarioPiso
        },
        PROVISOES: {
            // Use rates from the CCT Rule
            FERIAS: match.provisoes?.ferias ?? 0.1111,
            DECIMO_TERCEIRO: match.provisoes?.decimoTerceiro ?? 0.0833,
            RESCISAO: match.provisoes?.rescisao ?? 0.05
        }
    };
};

// ... (getValores remains same, only getValoresFinais changes structure return)

// ...

function calcularProvisoes(remuneracao: number, valores: any): DetailedBreakdown {
    // PROVISOES now available in 'valores' object constructed by getValoresFinais
    const rates = valores.PROVISOES || { FERIAS: 0.1111, DECIMO_TERCEIRO: 0.0833, RESCISAO: 0.05 };

    const ferias = remuneracao * rates.FERIAS;
    const decimoTerceiro = remuneracao * rates.DECIMO_TERCEIRO;
    const rescisao = remuneracao * rates.RESCISAO;

    return {
        ferias,
        decimoTerceiro,
        rescisao
    };
}

function calcularItem(config: BackendConfigPayload, valores: ReturnType<typeof getValores>) {
    // 1. Base
    const salarioBase = getPisoSalarial(config.funcao, valores);

    // 2. Adicionais
    const adicionaisObj = calcularAdicionais(salarioBase, valores, config.adicionais);
    const remuneracaoTotal = salarioBase + adicionaisObj.total;

    // 3. Beneficios
    const diasTrabalhados = config.dias.length * 4.33; // Avg weeks per month
    const beneficios = calcularBeneficios(diasTrabalhados, valores);

    // 4. Encargos Sociais (Sobre Remuneração)
    const encargos = calcularEncargosSociais(remuneracaoTotal, valores);

    // 5. Provisões (Sobre Remuneração)
    const provisoesObj = calcularProvisoes(remuneracaoTotal, valores);
    const totalProvisoes = provisoesObj.ferias + provisoesObj.decimoTerceiro + provisoesObj.rescisao;

    // 6. Insumos
    const insumos = (config.materiais || 0);

    // Subtotal (Custo Operacional Direto)
    const custoOperacional = remuneracaoTotal + beneficios + encargos + totalProvisoes + insumos;

    // 7. Lucro
    const lucro = custoOperacional * valores.ALIQUOTAS.MARGEM_LUCRO;

    // 8. Impostos
    // Preço de Venda = (Custo + Lucro) / (1 - TaxaImpostos)
    const precoSemImpostos = custoOperacional + lucro;
    const totalImpostosRate = valores.ALIQUOTAS.PIS + valores.ALIQUOTAS.COFINS + valores.ALIQUOTAS.ISS_PADRAO;
    const precoFinal = precoSemImpostos / (1 - totalImpostosRate);
    const tributos = precoFinal - precoSemImpostos;

    const custoTotal = precoFinal * config.quantidade;

    const detalhamento: BreakdownCustos = {
        salarioBase,
        adicionais: { // Updated structure
            insalubridade: adicionaisObj.insalubridade,
            periculosidade: adicionaisObj.periculosidade,
            total: adicionaisObj.total
        },
        beneficios,
        encargos, // Now only Social Charges
        provisoes: { // New Field
            ferias: provisoesObj.ferias,
            decimoTerceiro: provisoesObj.decimoTerceiro,
            rescisao: provisoesObj.rescisao,
            total: totalProvisoes
        },
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

        const servicosCalculados = configs.map(config => {
            // 1. Get Global Defaults
            const globalVals = getValores(parametros);

            // 2. Try to find Specific CCT Rule (passed in body.regrasCCT)
            const regras = body.regrasCCT as RegraCCT[] | undefined;
            const match = getMatchingRule(config, regras, globalVals);

            // 3. Merge
            const valoresFinais = getValoresFinais(match, globalVals);

            return calcularItem(config, valoresFinais);
        });

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
