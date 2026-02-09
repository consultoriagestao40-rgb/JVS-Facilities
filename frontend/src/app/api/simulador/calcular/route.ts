import { NextResponse } from 'next/server';
import { ParametrosCustos, RegraCCT } from '@/types/simulador';
import { MOCK_REGRAS } from '@/data/regrasCCT';
import prisma from '@/lib/prisma';

// --- Types ---
interface BackendConfigPayload {
    funcao: string;
    estado: string;
    cidade: string;
    cargo?: string;
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
    intrajornada?: boolean;
    copa?: boolean;
}

// Detailed Breakdown used internally for calculations
interface DetailedBreakdown {
    ferias: number;
    decimoTerceiro: number;
    rescisao: number;
}


// Helper to look up CCT Rule (unchanged logic, just ensuring it returns the right object)
function getMatchingRule(
    config: BackendConfigPayload,
    regras: RegraCCT[] | undefined,
    globalParams: ReturnType<typeof getValores>
) {
    if (!regras || regras.length === 0) return null;

    const validRules = regras.filter(r => r.funcao === config.funcao);
    let bestMatch: RegraCCT | null = null;
    let maxScore = -1;

    for (const r of validRules) {
        let score = 0;
        const isCityMatch = r.uf.toUpperCase() === config.estado.toUpperCase() && r.cidade?.toLowerCase() === config.cidade?.toLowerCase();
        const isStateMatch = r.uf.toUpperCase() === config.estado.toUpperCase() && (!r.cidade || r.cidade === '*');

        if (!isCityMatch && !isStateMatch) continue;

        score += isCityMatch ? 20 : 10;

        const configCargo = (config as any).cargo;
        const ruleCargo = r.cargo;
        const ruleCargosList = r.cargos || [];

        let foundSpecificCargoInList = false;

        if (configCargo) {
            if (ruleCargo && ruleCargo.toLowerCase() === configCargo.toLowerCase()) {
                score += 5;
            } else if (ruleCargosList.some(c => c.nome.toLowerCase() === configCargo.toLowerCase())) {
                score += 5;
                foundSpecificCargoInList = true;
            } else if (!ruleCargo && ruleCargosList.length === 0) {
                score += 1;
            } else {
                continue;
            }
        } else {
            score += 3;
        }

        if (score > maxScore) {
            maxScore = score;
            if (foundSpecificCargoInList && configCargo) {
                const specificRole = ruleCargosList.find(c => c.nome.toLowerCase() === configCargo.toLowerCase());
                const specificPiso = specificRole?.piso || r.salarioPiso;
                const specificGratificacao = specificRole?.gratificacao ?? r.gratificacoes;
                const roleCopa = specificRole?.adicionalCopa;
                const generalCopa = r.beneficios.adicionalCopa || 0;
                const finalCopa = roleCopa || generalCopa;

                bestMatch = {
                    ...r,
                    salarioPiso: specificPiso,
                    gratificacoes: specificGratificacao,
                    cargo: configCargo,
                    // @ts-ignore
                    adicionalCopa: finalCopa
                };
            } else {
                bestMatch = r;
            }
        } else if (score === maxScore) {
            if (r.uf === 'PR' && bestMatch?.uf !== 'PR') {
                bestMatch = r;
                maxScore = score;
            }
        }
    }

    if (!bestMatch) {
        // Fallback to PR if nothing matches
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
    if (!match) {
        return {
            ...global,
            PROVISOES: {
                FERIAS: 0.1111,
                DECIMO_TERCEIRO: 0.0833,
                RESCISAO: 0.05
            }
        };
    }

    return {
        // Rule overrides global
        // CRITICAL FIX: Ensure aliquotas from rule (like margemLucro) override defaults
        ALIQUOTAS: { ...global.ALIQUOTAS, ...match.aliquotas },
        VALORES_BASE: {
            ...global.VALORES_BASE,
            SALARIO_MINIMO: match.salarioPiso,
            VALE_REFEICAO_DIA: match.beneficios.valeRefeicao,
            TIPO_VR: match.beneficios.tipoValeRefeicao || 'DIARIO',
            VALE_TRANSPORTE_DIA: match.beneficios.valeTransporte,
            CESTA_BASICA: match.beneficios.cestaBasica,
            UNIFORME_MENSAL: match.custosOperacionais?.uniformeEpis ?? match.beneficios.uniforme,
            GRATIFICACOES: match.gratificacoes || 0,
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
            MARGEM_LUCRO: params?.aliquotas.margemLucro ?? 0.08, // Changed default to 8% just in case, but Rule should override
        },
        VALORES_BASE: {
            SALARIO_MINIMO: params?.salarioMinimo ?? 1412.00,
            VALE_REFEICAO_DIA: params?.beneficios.valeRefeicao ?? 25.00,
            VALE_TRANSPORTE_DIA: params?.beneficios.valeTransporte ?? 12.00,
            CESTA_BASICA: params?.beneficios.cestaBasica ?? 6.00,
            UNIFORME_MENSAL: params?.beneficios.uniforme ?? 25.00,
            GRATIFICACOES: 0
        },
        PISOS: params?.pisosSalariais ?? {
            limpeza: 1900.00,
            seguranca: 2100.00,
            recepcao: 1750.00,
            jardinagem: 1800.00
        },
        CUSTOS_OPS: { examesMedicos: 0, uniformeEpis: 0 },
        ADICIONAIS_CONFIG: { insalubridade: false, grauInsalubridade: 0.20, baseInsalubridade: 'SALARIO_MINIMO' as 'SALARIO_MINIMO' | 'SALARIO_BASE' }
    };
}


function getPisoSalarial(funcao: string, valores: any): number {
    const normalized = funcao.toLowerCase();
    return valores.PISOS[normalized] || valores.VALORES_BASE.SALARIO_MINIMO;
}

// ... (timeToMinutes and calcularHorasNoturnas helpers unchanged, omitted for brevity. Assume they exist) ...
// Re-implementing them briefly to be safe
const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

function calcularHorasNoturnas(entrada: string, saida: string) {
    let start = timeToMinutes(entrada);
    let end = timeToMinutes(saida);
    if (end < start) end += 24 * 60;

    const blockStart = Math.max(start, 1320); // 22:00
    const blockEnd = Math.min(end, 1740);     // 05:00 next day

    let nightMinutes = 0;
    if (blockEnd > blockStart) {
        nightMinutes = blockEnd - blockStart;
    }

    if (start < 1320 && end < 1320) {
        const earlyEnd = Math.min(end, 300); // 05:00
        if (earlyEnd > start) {
            nightMinutes += (earlyEnd - start);
        }
    }

    const nightHoursClock = nightMinutes / 60;
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

    if (config.adicionais?.insalubridade) {
        const grau = valores.ADICIONAIS_CONFIG?.grauInsalubridade ?? 0.20;
        const baseCalc = valores.ADICIONAIS_CONFIG?.baseInsalubridade === 'SALARIO_BASE' ? base : valores.VALORES_BASE.SALARIO_MINIMO;
        insalubridade = baseCalc * grau;
    }

    if (config.adicionais?.periculosidade) periculosidade = base * 0.30;

    if (config.horarioEntrada && config.horarioSaida) {
        const horasNoturnas = calcularHorasNoturnas(config.horarioEntrada, config.horarioSaida);
        const hourlyRate = base / 220;
        const nightPremium = hourlyRate * 0.20 * horasNoturnas * 22;
        adicionalNoturno = nightPremium;
    }

    if (config.intrajornada) {
        const hourlyRate = base / 220;
        const dailyCost = hourlyRate * 1.5;
        intrajornadaReflexo = dailyCost * 22;
    }

    const variaveisParaDSR = adicionalNoturno + intrajornadaReflexo;
    if (variaveisParaDSR > 0) {
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
// 4. HELPER: Calculate Benefits
// ----------------------------------------------------------------------
function calcularBeneficios(
    dias: number,
    valores: any
) {
    const salarioBase = valores.VALORES_BASE.SALARIO_MINIMO;

    // Vale Transporte
    const custoVT = dias * valores.VALORES_BASE.VALE_TRANSPORTE_DIA;
    const percentVT = valores.BENEFICIOS_CONFIG?.descontoVT ?? 0.06;
    const descontoPotencialVT = salarioBase * percentVT;
    const descontoVTReal = Math.min(descontoPotencialVT, custoVT);

    // Vale Refeição
    let custoVR = 0;
    if (valores.VALORES_BASE.TIPO_VR === 'MENSAL') {
        custoVR = valores.VALORES_BASE.VALE_REFEICAO_DIA;
    } else {
        custoVR = dias * valores.VALORES_BASE.VALE_REFEICAO_DIA;
    }

    // VA on Vacation
    let vaSobreFerias = 0;
    if (valores.BENEFICIOS_CONFIG?.vaSobreFerias) {
        vaSobreFerias = custoVR / 12;
    }

    // Discount VA
    const percentVA = valores.BENEFICIOS_CONFIG?.descontoVA ?? 0.20;
    const descontoVAReal = (custoVR + vaSobreFerias) * percentVA;

    const cesta = valores.VALORES_BASE.CESTA_BASICA;
    const uniforme = valores.VALORES_BASE.UNIFORME_MENSAL;
    // Copa extracted from benefits total, handled in Salary Group

    const total =
        (custoVR + custoVT + cesta + uniforme + vaSobreFerias) -
        (descontoVAReal + descontoVTReal);

    return {
        valeRefeicao: custoVR,
        valeTransporte: custoVT,
        cestaBasica: cesta,
        uniforme: uniforme,
        vaSobreFerias: vaSobreFerias,
        descontoVA: -descontoVAReal,
        descontoVT: -descontoVTReal,
        total: total
    };
}


function calcularEncargosSociais(remuneracao: number, valores: ReturnType<typeof getValores>): number {
    const { INSS, FGTS, RAT } = valores.ALIQUOTAS;
    // Ensure we are using the Rule's ALIQUOTAS which should be merged in.
    return remuneracao * (INSS + FGTS + RAT);
}

function calcularProvisoes(remuneracao: number, valores: any): DetailedBreakdown {
    const rates = valores.PROVISOES || { FERIAS: 0.1111, DECIMO_TERCEIRO: 0.0833, RESCISAO: 0.05 };
    const ferias = remuneracao * rates.FERIAS;
    const decimoTerceiro = remuneracao * rates.DECIMO_TERCEIRO;
    const rescisao = remuneracao * rates.RESCISAO;
    return { ferias, decimoTerceiro, rescisao };
}

function calcularItem(config: BackendConfigPayload, valores: ReturnType<typeof getValores>) {
    const Materials = Number(config.materiais) || 0;
    const Quantidade = Number(config.quantidade) || 1;
    const AdicionalCopaManual = Number(config.adicionalCopa) || 0;

    // 1. Base e Gratificações
    const salarioBase = getPisoSalarial(config.funcao, valores);
    const gratificacoes = valores.VALORES_BASE.GRATIFICACOES || 0;

    const adicionalCopaRule = (valores.VALORES_BASE as any).ADICIONAL_COPA || 0;
    let adicionalCopa = 0;
    if (config.copa) {
        adicionalCopa = adicionalCopaRule + AdicionalCopaManual;
        if (adicionalCopa === 0) {
            adicionalCopa = salarioBase * 0.20;
        }
    }

    // 2. Adicionais
    const adicionaisObj = calcularAdicionais(salarioBase, valores, config);
    const remuneracaoTotal = salarioBase + gratificacoes + adicionalCopa + adicionaisObj.total;

    // 3. Beneficios
    const diasTrabalhados = config.dias.length * 4.33;
    const beneficios = calcularBeneficios(diasTrabalhados, valores);

    // 4. Encargos Sociais
    const encargos = calcularEncargosSociais(remuneracaoTotal, valores);

    // 5. Provisões
    const provisoesObj = calcularProvisoes(remuneracaoTotal, valores);
    const totalProvisoes = provisoesObj.ferias + provisoesObj.decimoTerceiro + provisoesObj.rescisao;

    // 6. Insumos & Operacionais
    const custoExames = valores.CUSTOS_OPS?.examesMedicos || 0;
    const insumos = Materials;
    const custoOperacional = remuneracaoTotal + beneficios.total + encargos + totalProvisoes + insumos + custoExames;

    // 7. Lucro (USE CORRECT MARGIN FROM ALIAS)
    const margenLucroRate = valores.ALIQUOTAS.MARGEM_LUCRO || 0.08; // Fallback to 8% if missing, not 15%
    const lucro = custoOperacional * margenLucroRate;

    // 8. Impostos
    // Preço de Venda = (Custo + Lucro) / (1 - TaxaImpostos)
    const precoSemImpostos = custoOperacional + lucro;
    const totalImpostosRate = (valores.ALIQUOTAS.PIS || 0) + (valores.ALIQUOTAS.COFINS || 0) + (valores.ALIQUOTAS.ISS_PADRAO || 0);
    // Ensure rate is not >= 1
    const safeImpostos = Math.min(totalImpostosRate, 0.5);
    const precoFinalUnitario = precoSemImpostos / (1 - safeImpostos);
    const tributos = precoFinalUnitario - precoSemImpostos;

    const custoTotal = precoFinalUnitario * Quantidade;

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
        totalMensal: precoFinalUnitario
    };

    return {
        config,
        custoUnitario: precoFinalUnitario,
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
            const globalVals = getValores(parametros);
            const regras = (body.regrasCCT as RegraCCT[] && (body.regrasCCT as RegraCCT[]).length > 0) ? body.regrasCCT as RegraCCT[] : MOCK_REGRAS;
            const match = getMatchingRule(config, regras, globalVals);
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

        if (body.userData && body.userData.email) {
            const userData = body.userData;
            try {
                let lead = await prisma.lead.findFirst({
                    where: { email: userData.email }
                });

                if (lead) {
                    lead = await prisma.lead.update({
                        where: { id: lead.id },
                        data: {
                            nome: userData.nome,
                            empresa: userData.empresa,
                            whatsapp: userData.whatsapp,
                            cnpj: userData.cnpj
                        }
                    });
                } else {
                    lead = await prisma.lead.create({
                        data: {
                            nome: userData.nome || 'Anônimo',
                            email: userData.email,
                            empresa: userData.empresa || 'Não informada',
                            whatsapp: userData.whatsapp || '',
                            cnpj: userData.cnpj || ''
                        }
                    });
                }

                await prisma.proposta.create({
                    data: {
                        numeroSequencial: responseData.id,
                        leadId: lead.id,
                        servicos: JSON.stringify(responseData.servicos),
                        custoMensal: responseData.resumo.custoMensalTotal,
                        custoAnual: responseData.resumo.custoAnualTotal,
                        breakdown: JSON.stringify(responseData.resumo),
                        status: 'DRAFT'
                    }
                });
                console.log("Simulação salva com sucesso:", responseData.id);
            } catch (dbError) {
                console.error("Erro ao salvar simulação no banco:", dbError);
            }
        }

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Erro no cálculo:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Erro ao processar cálculo.' },
            { status: 500 }
        );
    }
}
