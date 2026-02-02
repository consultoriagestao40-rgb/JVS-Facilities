import { NextResponse } from 'next/server';
import { ParametrosCustos, RegraCCT, BreakdownCustos } from '@/types/simulador';
import { MOCK_REGRAS } from '@/data/regrasCCT';

// --- Types ---
interface BackendConfigPayload {
    funcao: string;
    estado: string;
    cidade: string;
    cargo?: string; // Added cargo
    dias: string[];
    horarioEntrada: string;
    horarioSaida: string;
    quantidade: number;
    materiais?: number;
    adicionalCopa?: number;
    adicionais?: {
        insalubridade?: boolean;
        periculosidade?: boolean;
    };
    intrajornada?: boolean; // New
    copa?: boolean; // Checkbox from Step 4
}

// Detailed Breakdown used internally for calculations
interface DetailedBreakdown {
    ferias: number;
    decimoTerceiro: number;
    rescisao: number;
}


// Helper to look up CCT Rule
// Prioritize: Explicit City Match -> State Match (Wildcard) -> Default Global Param
function getMatchingRule(
    config: BackendConfigPayload,
    regras: RegraCCT[] | undefined,
    globalParams: ReturnType<typeof getValores>
) {
    if (!regras || regras.length === 0) return null;

    // Helper for specificity score
    // 3 points = Explicit City + Explicit Cargo
    // 2 points = State + Explicit Cargo
    // 1 point = Explicit City + No Cargo (Generic) / State + No Cargo

    // Filter by Function first (Essential)
    const validRules = regras.filter(r => r.funcao === config.funcao);

    // Find Best Match
    let bestMatch: RegraCCT | null = null;
    let maxScore = -1;

    for (const r of validRules) {
        let score = 0;

        // Qualification 1: Location
        const isCityMatch = r.uf.toUpperCase() === config.estado.toUpperCase() && r.cidade?.toLowerCase() === config.cidade?.toLowerCase();
        const isStateMatch = r.uf.toUpperCase() === config.estado.toUpperCase() && (!r.cidade || r.cidade === '*');

        if (!isCityMatch && !isStateMatch) continue; // Not valid location

        score += isCityMatch ? 20 : 10; // City is tighter than State

        // Qualification 2: Cargo (Sub-function or List)
        const configCargo = (config as any).cargo; // Cast if type incomplete
        const ruleCargo = r.cargo;
        const ruleCargosList = r.cargos || [];

        let foundSpecificCargoInList = false;

        if (configCargo) {
            // Check legacy single field
            if (ruleCargo && ruleCargo.toLowerCase() === configCargo.toLowerCase()) {
                score += 5; // Exact Cargo Match
            }
            // Check new array field
            else if (ruleCargosList.some(c => c.nome.toLowerCase() === configCargo.toLowerCase())) {
                score += 5;
                foundSpecificCargoInList = true;
            }
            else if (!ruleCargo && ruleCargosList.length === 0) {
                score += 1; // Generic Rule is acceptable fallback if no specific cargo defined
            } else {
                continue; // Rule is for DIFFERENT cargo(s), skip.
            }
        } else {
            // No Cargo requested
            // If the rule has specific cargos, we can still use it as a generic fallback IF it has a valid Piso.
            // We give it a lower score (3) than a specific match (5), but do not skip it.
            score += 3;
        }

        if (score > maxScore) {
            maxScore = score;
            // If we found a match in the list, we clone the rule and override the Piso
            if (foundSpecificCargoInList && configCargo) {
                const specificRole = ruleCargosList.find(c => c.nome.toLowerCase() === configCargo.toLowerCase());
                const specificPiso = specificRole?.piso || r.salarioPiso;
                const specificGratificacao = specificRole?.gratificacao ?? r.gratificacoes;
                // Store copa temporarily in a new property (need to extend RegraCCT locally or handle via extra variable)
                // For simplicity, we will merge it into 'adicionais' config or return it as part of the match info.
                // Best approach: Add 'adicionalCopa' to the match object (cast as any if needed or update type globally)
                bestMatch = {
                    ...r,
                    salarioPiso: specificPiso,
                    gratificacoes: specificGratificacao,
                    cargo: configCargo,
                    // @ts-ignore: Prop 'copa' doesn't exist on RegraCCT yet but we need to pass it
                    adicionalCopa: specificRole?.adicionalCopa || 0
                };
            } else {
                bestMatch = r;
            }
        } else if (score === maxScore) {
            // Tie-breaker: Prefer PR over others if score is equal (Safety for current user)
            if (r.uf === 'PR' && bestMatch?.uf !== 'PR') {
                bestMatch = r;
                maxScore = score;
            }
        }
    }

    // FINAL FALLBACK: If no match found (e.g. state config is wrong), Force PR Rule
    if (!bestMatch) {
        const fallback = regras.find(r => r.id === 'PR_LIMPEZA_2025');
        if (fallback) return fallback;
    }

    return bestMatch;
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
            TIPO_VR: match.beneficios.tipoValeRefeicao || 'DIARIO',
            VALE_TRANSPORTE_DIA: match.beneficios.valeTransporte,
            CESTA_BASICA: match.beneficios.cestaBasica,
            UNIFORME_MENSAL: match.custosOperacionais?.uniformeEpis ?? match.beneficios.uniforme, // Prefer new field
            GRATIFICACOES: match.gratificacoes || 0, // New Value
            ADICIONAL_COPA: (match as any).adicionalCopa || 0
        },
        BENEFICIOS_CONFIG: match.configuracoesBeneficios || { descontoVT: 0.06, descontoVA: 0.20, vaSobreFerias: true },
        ADICIONAIS_CONFIG: match.adicionais || { insalubridade: false, grauInsalubridade: 0.20, baseInsalubridade: 'SALARIO_MINIMO' },
        CUSTOS_OPS: match.custosOperacionais || { examesMedicos: 0, uniformeEpis: 0 },
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
            GRATIFICACOES: 0 // Default
        },
        PISOS: params?.pisosSalariais ?? {
            limpeza: 1900.00, // Updated Default from 1590
            seguranca: 2100.00,
            recepcao: 1750.00,
            jardinagem: 1800.00
        },
        // Defaults for new structure (merged in getValoresFinais usually, but needed for type inference)
        CUSTOS_OPS: { examesMedicos: 0, uniformeEpis: 0 },
        ADICIONAIS_CONFIG: { insalubridade: false, grauInsalubridade: 0.20, baseInsalubridade: 'SALARIO_MINIMO' as 'SALARIO_MINIMO' | 'SALARIO_BASE' }
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

// Returns detailed additionals
function calcularAdicionais(
    base: number,
    valores: any,
    config: BackendConfigPayload
) {
    let insalubridade = 0;
    let periculosidade = 0;
    let adicionalNoturno = 0;
    let dsr = 0;
    let intrajornadaReflexo = 0;

    // Insalubridade
    if (config.adicionais?.insalubridade) {
        const grau = valores.ADICIONAIS_CONFIG?.grauInsalubridade ?? 0.20;
        const baseCalc = valores.ADICIONAIS_CONFIG?.baseInsalubridade === 'SALARIO_BASE' ? base : valores.VALORES_BASE.SALARIO_MINIMO;
        insalubridade = baseCalc * grau;
    }

    // Periculosidade is on Base Salary
    if (config.adicionais?.periculosidade) periculosidade = base * 0.30;

    // --- Intelligent Calculations ---

    // 1. Adicional Noturno
    if (config.horarioEntrada && config.horarioSaida) {
        const horasNoturnas = calcularHorasNoturnas(config.horarioEntrada, config.horarioSaida);
        // Premium: 20% on Base Hourly Rate
        const hourlyRate = base / 220; // Standard CLT divisor
        const nightPremium = hourlyRate * 0.20 * horasNoturnas * 22; // * 22 days per month (avg)

        adicionalNoturno = nightPremium;
    }

    // 2. Intrajornada (Indemnified Lunch Break)
    if (config.intrajornada) {
        // 1 Hour Extra per day at 50% premium
        const hourlyRate = base / 220;
        const dailyCost = hourlyRate * 1.5; // 1h + 50%
        intrajornadaReflexo = dailyCost * 22; // 22 days
    }

    // 3. DSR (Descanso Semanal Remunerado)
    // Only on variable stuff (Noturno + Intrajornada + Periculosidade sometimes?)
    // Usually Periculosidade/Insalubridade are monthly and include DSR.
    // But Noturno and Overtime generate DSR.
    const variaveisParaDSR = adicionalNoturno + intrajornadaReflexo;
    if (variaveisParaDSR > 0) {
        // Formula: (Variables / Dias Úteis * Domingos/Feriados)
        // Standard Estimate: (Var / 22) * 4 approx 18-20%
        // Using 1/6 for simplicity (common approximation)
        dsr = variaveisParaDSR / 6;
    }

    return {
        insalubridade,
        periculosidade,
        noturno: adicionalNoturno,
        intrajornada: intrajornadaReflexo,
        dsr,
        total: insalubridade + periculosidade + adicionalNoturno + intrajornadaReflexo + dsr
    };
}

// ----------------------------------------------------------------------
// 4. HELPER: Calculate Benefits (With Discounts and Fixed/Daily Logic)
// ----------------------------------------------------------------------
function calcularBeneficios(
    dias: number,
    valores: any
) {
    const salarioBase = valores.VALORES_BASE.SALARIO_MINIMO; // Actually Piso

    // 1. Vale Transporte
    // Cost: Days * Daily Value
    const custoVT = dias * valores.VALORES_BASE.VALE_TRANSPORTE_DIA;

    // Discount: 6% of Base Salary (Limited to Cost)
    const percentVT = valores.BENEFICIOS_CONFIG?.descontoVT ?? 0.06;
    const descontoPotencialVT = salarioBase * percentVT;
    const descontoVTReal = Math.min(descontoPotencialVT, custoVT);

    // 2. Vale Refeição / Alimentação
    let custoVR = 0;
    if (valores.VALORES_BASE.TIPO_VR === 'MENSAL') {
        custoVR = valores.VALORES_BASE.VALE_REFEICAO_DIA; // Stores Monthly Value
    } else {
        custoVR = dias * valores.VALORES_BASE.VALE_REFEICAO_DIA;
    }

    // Discount VA
    const percentVA = valores.BENEFICIOS_CONFIG?.descontoVA ?? 0.20; // Default 20%
    const descontoVAReal = custoVR * percentVA;

    // VA on Vacation (Provision 1/12)
    let vaSobreFerias = 0;
    if (valores.BENEFICIOS_CONFIG?.vaSobreFerias) { // Default true
        vaSobreFerias = custoVR / 12;
    }

    const cesta = valores.VALORES_BASE.CESTA_BASICA;
    const uniforme = valores.VALORES_BASE.UNIFORME_MENSAL;
    const copa = (valores.VALORES_BASE as any).ADICIONAL_COPA || 0; // Fix: Include Copa

    // Total = (Costs) - (Discounts) + (Provisions)
    // Note: Discounts are subtracted from the company cost because the employee pays them.
    // ADD COPA TO TOTAL
    const total =
        (custoVR + custoVT + cesta + uniforme + copa + vaSobreFerias) -
        (descontoVAReal + descontoVTReal);

    return {
        valeRefeicao: custoVR,
        valeTransporte: custoVT,
        cestaBasica: cesta,
        uniforme: uniforme,
        adicionalCopa: copa, // Return field
        vaSobreFerias: vaSobreFerias,
        descontoVA: -descontoVAReal, // Return as negative for display consistency
        descontoVT: -descontoVTReal, // Return as negative for display consistency
        total: total
    };
}

function calcularEncargosSociais(remuneracao: number, valores: ReturnType<typeof getValores>): number {
    const { INSS, FGTS, RAT } = valores.ALIQUOTAS;
    // INSS (e.g., 20%), FGTS (8%), RAT (e.g., 2%)
    // Also include 'Sistema S', 'Salário Educação', 'Incra'? Usually encompassed in 'RAT' or 'Outros' in simplified views, 
    // but assuming INSS passed includes Employer part.
    return remuneracao * (INSS + FGTS + RAT);
}

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
    // Force numbers to avoid string concatenation issues or NaNs
    const Materials = Number(config.materiais) || 0;
    const Quantidade = Number(config.quantidade) || 1; // Default to 1 if 0/NaN
    const AdicionalCopaManual = Number(config.adicionalCopa) || 0;

    // 1. Base e Gratificações
    const salarioBase = getPisoSalarial(config.funcao, valores);
    const gratificacoes = valores.VALORES_BASE.GRATIFICACOES || 0;

    // Merge Manual + Rule Copa + Config Flag
    const adicionalCopaRule = (valores.VALORES_BASE as any).ADICIONAL_COPA || 0;
    let adicionalCopa = adicionalCopaRule + AdicionalCopaManual;

    // Fix for User: If 'copa' flag is checked but total is 0, apply fallback (20% of Base)
    if (config.copa && adicionalCopa === 0) {
        adicionalCopa = salarioBase * 0.20;
    }

    // 2. Adicionais
    const adicionaisObj = calcularAdicionais(salarioBase, valores, config);

    // Remuneração Total para fins de Encargos e Provisões
    const remuneracaoTotal = salarioBase + gratificacoes + adicionalCopa + adicionaisObj.total;

    // 3. Beneficios
    const diasTrabalhados = config.dias.length * 4.33; // Avg weeks per month
    const beneficios = calcularBeneficios(diasTrabalhados, valores);

    // 4. Encargos Sociais (Sobre Remuneração)
    const encargos = calcularEncargosSociais(remuneracaoTotal, valores);

    // 5. Provisões (Sobre Remuneração)
    const provisoesObj = calcularProvisoes(remuneracaoTotal, valores);
    const totalProvisoes = provisoesObj.ferias + provisoesObj.decimoTerceiro + provisoesObj.rescisao;

    // 6. Insumos & Operacionais
    const custoExames = valores.CUSTOS_OPS?.examesMedicos || 0;
    const insumos = Materials; // Use enforced number

    // Subtotal (Custo Operacional Direto)
    // Now include custoExames explicitly
    const custoOperacional = remuneracaoTotal + beneficios.total + encargos + totalProvisoes + insumos + custoExames;

    // 7. Lucro
    const lucro = custoOperacional * valores.ALIQUOTAS.MARGEM_LUCRO;

    // 8. Impostos
    // Preço de Venda = (Custo + Lucro) / (1 - TaxaImpostos)
    const precoSemImpostos = custoOperacional + lucro;
    const totalImpostosRate = valores.ALIQUOTAS.PIS + valores.ALIQUOTAS.COFINS + valores.ALIQUOTAS.ISS_PADRAO;
    const precoFinalUnitario = precoSemImpostos / (1 - totalImpostosRate);
    const tributos = precoFinalUnitario - precoSemImpostos;

    // Total Mensal (Multiplicado pela quantidade)
    const custoTotal = precoFinalUnitario * Quantidade; // Use enforced Quantity

    // Detalhamento (Unitário para exibição coerente)
    const detalhamento = {
        salarioBase,
        gratificacoes,
        aliquotas: valores.ALIQUOTAS,
        adicionais: {
            insalubridade: adicionaisObj.insalubridade,
            periculosidade: adicionaisObj.periculosidade,
            noturno: adicionaisObj.noturno,
            intrajornada: adicionaisObj.intrajornada,
            dsr: adicionaisObj.dsr,
            copa: adicionalCopa,
            total: adicionaisObj.total + adicionalCopa
        },
        beneficios,
        encargos,
        provisoes: {
            ferias: provisoesObj.ferias,
            decimoTerceiro: provisoesObj.decimoTerceiro,
            rescisao: provisoesObj.rescisao,
            total: totalProvisoes
        },
        custosOperacionais: {
            examesMedicos: custoExames,
            total: custoExames
        },
        insumos,
        tributos,
        lucro,
        totalMensal: precoFinalUnitario // Keep Unitary here for breakdown table default view
    };

    return {
        config, // Return original config as reference
        custoUnitario: precoFinalUnitario,
        custoTotal, // Final Total for Summary (Unit * Qty)
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

            // 2. Try to find Specific CCT Rule (passed in body.regrasCCT OR use server fallback)
            const regras = (body.regrasCCT as RegraCCT[] && (body.regrasCCT as RegraCCT[]).length > 0) ? body.regrasCCT as RegraCCT[] : MOCK_REGRAS;
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
