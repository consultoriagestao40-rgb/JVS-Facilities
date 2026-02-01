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
// Helper to look up CCT Rule
// Prioritize: Explicit City Match -> State Match (Wildcard) -> Default Global Param
function getMatchingRule(
    config: BackendConfigPayload,
    regras: RegraCCT[] | undefined,
    globalParams: ReturnType<typeof getValores>
) {
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
}

// Helper to get values merging Global + Rule
function getValoresFinais(
    match: RegraCCT | null,
    global: ReturnType<typeof getValores>
) {
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
}

// Helper: Get Values (Hoisted)
function getValores(params?: ParametrosCustos) {
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
}


function getPisoSalarial(funcao: string, valores: any): number {
    const normalized = funcao.toLowerCase();
    // Use the specific floor if defined in PISOS (merged from rule), otherwise fallback
    return valores.PISOS[normalized] || valores.VALORES_BASE.SALARIO_MINIMO;
}

// Helper to parse "HH:MM" to minutes from midnight
const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

// Calculate Night Hours (22:00 - 05:00) with Reduction Factor
function calcularHorasNoturnas(entrada: string, saida: string) {
    let start = timeToMinutes(entrada);
    let end = timeToMinutes(saida);

    // Handle overnight shift (e.g. 23:00 to 07:00)
    if (end < start) end += 24 * 60;

    const nightStart = 22 * 60; // 22:00 -> 1320
    const nightEnd = (24 + 5) * 60; // 05:00 next day -> 1740 (29h)

    // Check overlap
    // Shift is [start, end]
    // Night Window is [nightStart, nightEnd] (simplified for standard overnight)

    // We strictly care about 22:00 to 05:00.
    // If shift is 18:00 to 02:00. Overlap is 22:00 to 02:00.

    // Logic: normalize shift to absolute scale matching night window
    const overlapStart = Math.max(start, nightStart);
    const overlapEnd = Math.min(end, nightEnd); // Cap at 05:00

    let nightMinutes = 0;

    // Case 1: Standard Night Window Overlap (e.g. 22:00 - 05:00)
    if (overlapEnd > overlapStart) {
        nightMinutes += (overlapEnd - overlapStart);
    }

    // Also check "Early Morning" pre-05:00 if shift started previous day? 
    // Simplified: Just check intersection with 22h-05h window for single shift cycle.
    // If [start, end] crosses 22:00 (1320) or 05:00 (300 or 1740)

    // Robust approach: Iterate minutes? No too slow.
    // Range approach:
    // Window A: 22:00 (1320) to 24:00 (1440)
    // Window B: 00:00 (0 or 1440) to 05:00 (300 or 1740)

    // Since we added 24h to 'end' if it wrapped, 'end' is always > 'start'.

    // Intersection with 22:00-05:00 (next day)
    // Night start is 1320. Night end is 1740 (05:00 + 24h).

    const blockStart = Math.max(start, 1320); // max(start, 22:00)
    const blockEnd = Math.min(end, 1740);     // min(end, 05:00 next day)

    if (blockEnd > blockStart) {
        nightMinutes = blockEnd - blockStart;
    }

    // What if shift is 00:00 to 06:00? (Start 0, End 360) versus 22:00-05:00?
    // We normalized overnight shifts to be > 24h, but a standard starts-at-midnight shift is just 0-360.
    // In that case, start=0, end=360.
    // Night window can also be 00:00 to 05:00 (0 to 300).
    if (start < 1320 && end < 1320) {
        // Pure morning shift? 00:00 to 12:00.
        // Intersect [0, 300] (05:00)
        const earlyEnd = Math.min(end, 300);
        if (earlyEnd > start) {
            nightMinutes += (earlyEnd - start);
        }
    }

    const nightHoursClock = nightMinutes / 60;

    // Apply Reduction Factor: 52m30s (52.5) -> 60m
    // Factor = 60 / 52.5 = 1.142857
    const nightHoursPaid = nightHoursClock * 1.142857;

    return nightHoursPaid;
}

function calcularItem(config: BackendConfigPayload, valores: ReturnType<typeof getValores>) {
    // 1. Base
    const salarioBase = getPisoSalarial(config.funcao, valores);

    // 2. Adicionais
    const adicionaisObj = calcularAdicionais(salarioBase, valores, config);
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
            noturno: adicionaisObj.noturno,
            intrajornada: adicionaisObj.intrajornada,
            dsr: adicionaisObj.dsr,
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
