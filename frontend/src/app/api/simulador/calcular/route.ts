import { NextResponse } from 'next/server';
import { ParametrosCustos, RegraCCT } from '@/types/simulador';
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

interface DetailedBreakdown {
    ferias: number;
    decimoTerceiro: number;
    rescisao: number;
}


// --- 1. CORE LOGIC: Get Rules from DB & Match ---

async function fetchActiveRules(): Promise<RegraCCT[]> {
    const SAFETY_NET_RULES: RegraCCT[] = [{
        id: 'SAFETY_PR_PORTARIA',
        uf: 'PR',
        cidade: 'Curitiba',
        funcao: 'PORTARIA',
        dataBase: new Date().toISOString(),
        salarioPiso: 2415.00,
        piso: 2415.00,
        // @ts-ignore
        sindicato: 'SINDEPRESTEM',
        aliquotas: { inss: 0.20, fgts: 0.08, margemLucro: 0.08, pis: 0.0165, cofins: 0.076, iss: 0.05 },
        beneficios: { valeRefeicao: 25, valeTransporte: 12, cestaBasica: 6, uniforme: 25 },
        adicionais: {},
        cargos: [
            {
                nome: 'Porteiro 44h/12x36', piso: 2415.00, gratificacao: 0,
                // @ts-ignore
                adicionalCopa: 0
            },
            {
                nome: 'Porteiro 44h / 12x36', piso: 2415.00, gratificacao: 0,
                // @ts-ignore
                adicionalCopa: 0
            }
        ],
        provisoes: { ferias: 0.1111, decimoTerceiro: 0.0833, rescisao: 0.05 },
        gratificacoes: 0
    } as unknown as RegraCCT];

    try {
        const dbRules = await prisma.convencaoColetiva.findMany({
            orderBy: { createdAt: 'desc' }
        });

        if (!dbRules || dbRules.length === 0) return SAFETY_NET_RULES;

        // Map DB simplified schema to Application RegraCCT schema
        return dbRules.map(r => {
            const safeParse = (val: string, fallback: any) => {
                try {
                    return typeof val === 'string' ? JSON.parse(val) : val;
                } catch {
                    return fallback;
                }
            };

            const parsedBeneficios = safeParse(r.beneficios, {});
            const parsedAdicionais = safeParse(r.adicionais, {});

            const extractedAliquotas = parsedAdicionais.aliquotas || {};
            const extractedProvisoes = parsedAdicionais.provisoes || {};

            const extractedCargos = Array.isArray(parsedAdicionais.cargos) ? parsedAdicionais.cargos : [];

            // Map single-row cargo to list
            if (parsedAdicionais.cargo && typeof parsedAdicionais.cargo === 'string') {
                extractedCargos.push({
                    nome: parsedAdicionais.cargo,
                    piso: Number(r.piso) || 0,
                    gratificacao: 0,
                    adicionalCopa: 0
                });
            }

            return {
                id: r.id,
                uf: r.estado,
                cidade: '',
                funcao: r.funcao,
                dataBase: r.vigencia.toISOString(),
                salarioPiso: Number(r.piso),
                piso: Number(r.piso),
                // @ts-ignore
                sindicato: 'SINDEPRESTEM',

                aliquotas: extractedAliquotas,
                beneficios: parsedBeneficios,
                adicionais: parsedAdicionais,
                cargos: extractedCargos,
                provisoes: extractedProvisoes,
                custosOperacionais: parsedAdicionais.custosOperacionais || {},
                gratificacoes: 0
            } as unknown as RegraCCT;
        });
    } catch (e) {
        console.error("Failed to fetch rules from DB, returning safety net:", e);
        return SAFETY_NET_RULES;
    }
}


function getMatchingRule(
    config: BackendConfigPayload,
    regras: RegraCCT[],
    globalParams: ReturnType<typeof getValores>
) {
    if (!regras || regras.length === 0) return null;

    const validRules = regras.filter(r => r.funcao.toUpperCase() === config.funcao.toUpperCase());

    let bestMatch: RegraCCT | null = null;
    let maxScore = -1;

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const r of validRules) {
        let score = 0;

        // 1. Location Match
        const rUf = r.uf?.toUpperCase() || '';
        const cUf = config.estado?.toUpperCase() || '';
        const rCidade = r.cidade?.toLowerCase() || '';
        const cCidade = config.cidade?.toLowerCase() || '';

        // Flexible State Match
        const stateMatch = rUf === cUf || (rUf.length > 2 && rUf.startsWith(cUf));
        if (!stateMatch) continue;
        score += 10;

        // City Match bonus
        if (rCidade && rCidade === cCidade) score += 10;
        else if (rCidade && rCidade !== cCidade) continue;

        // 2. Cargo Match
        const configCargo = (config as any).cargo;
        const ruleCargosList = r.cargos || [];

        let foundSpecific = false;

        if (configCargo) {
            const matchCargo = ruleCargosList.find(c => normalize(c.nome) === normalize(configCargo));
            if (matchCargo) {
                score += 5;
                foundSpecific = true;
            } else if (ruleCargosList.length === 0) {
                score += 1;
            } else {
                continue;
            }
        } else {
            score += 1;
        }

        if (score > maxScore) {
            maxScore = score;
            if (foundSpecific && configCargo) {
                const specificRole = ruleCargosList.find(c => normalize(c.nome) === normalize(configCargo));
                if (specificRole) {
                    bestMatch = {
                        ...r,
                        salarioPiso: specificRole.piso || r.salarioPiso,
                        gratificacoes: specificRole.gratificacao || r.gratificacoes,
                        // @ts-ignore
                        adicionalCopa: specificRole.adicionalCopa
                    };
                }
            } else {
                bestMatch = r;
            }
        }
    }

    if (!bestMatch) {
        // Second chance: Safety Net for PR if forced fallback required
        bestMatch = regras.find(r => r.id === 'SAFETY_PR_PORTARIA') || null;

        if (!bestMatch) {
            bestMatch = regras.find(r => (r.uf === 'PR' && r.funcao === config.funcao)) || null;
        }
    }

    return bestMatch;
}



// --- 2. CALCULATION HELPERS ---

function getValores(params?: ParametrosCustos) {
    return {
        ALIQUOTAS: {
            INSS: params?.aliquotas.inss ?? 0.20,
            FGTS: params?.aliquotas.fgts ?? 0.08,
            RAT: params?.aliquotas.rat ?? 0.02,
            PIS: params?.aliquotas.pis ?? 0.0165,
            COFINS: params?.aliquotas.cofins ?? 0.076,
            ISS_PADRAO: params?.aliquotas.iss ?? 0.05,
            MARGEM_LUCRO: params?.aliquotas.margemLucro ?? 0.08,
        },
        VALORES_BASE: {
            SALARIO_MINIMO: params?.salarioMinimo ?? 1412.00,
            VALE_REFEICAO_DIA: params?.beneficios.valeRefeicao ?? 25.00,
            VALE_TRANSPORTE_DIA: params?.beneficios.valeTransporte ?? 12.00,
            CESTA_BASICA: params?.beneficios.cestaBasica ?? 6.00,
            UNIFORME_MENSAL: params?.beneficios.uniforme ?? 25.00,
            GRATIFICACOES: 0,
            ADICIONAL_COPA: 0,
            TIPO_VR: 'DIARIO'
        },
        BENEFICIOS_CONFIG: { descontoVT: 0.06, descontoVA: 0.20, vaSobreFerias: true },
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


function getValoresFinais(
    match: RegraCCT | null,
    global: ReturnType<typeof getValores>
) {
    if (!match) {
        return {
            ...global,
            PROVISOES: { FERIAS: 0.1111, DECIMO_TERCEIRO: 0.0833, RESCISAO: 0.05 }
        };
    }

    const parseNum = (val: any, def: number) => {
        const n = Number(val);
        return isNaN(n) ? def : n;
    };

    const aliq = match.aliquotas || {};
    const ben = match.beneficios || {};
    const prov = match.provisoes || {};

    return {
        ALIQUOTAS: {
            ...global.ALIQUOTAS,
            INSS: aliq.inss !== undefined ? Number(aliq.inss) : global.ALIQUOTAS.INSS,
            FGTS: aliq.fgts !== undefined ? Number(aliq.fgts) : global.ALIQUOTAS.FGTS,
            RAT: aliq.rat !== undefined ? Number(aliq.rat) : global.ALIQUOTAS.RAT,
            MARGEM_LUCRO: aliq.margemLucro !== undefined ? Number(aliq.margemLucro) : global.ALIQUOTAS.MARGEM_LUCRO,
            PIS: aliq.pis !== undefined ? Number(aliq.pis) : global.ALIQUOTAS.PIS,
            COFINS: aliq.cofins !== undefined ? Number(aliq.cofins) : global.ALIQUOTAS.COFINS,
            ISS_PADRAO: aliq.iss !== undefined ? Number(aliq.iss) : global.ALIQUOTAS.ISS_PADRAO,
        },
        VALORES_BASE: {
            ...global.VALORES_BASE,
            SALARIO_MINIMO: Number(match.salarioPiso),
            VALE_REFEICAO_DIA: parseNum(ben.valeRefeicao, global.VALORES_BASE.VALE_REFEICAO_DIA),
            TIPO_VR: ben.tipoValeRefeicao || 'DIARIO',
            VALE_TRANSPORTE_DIA: parseNum(ben.valeTransporte, global.VALORES_BASE.VALE_TRANSPORTE_DIA),
            CESTA_BASICA: parseNum(ben.cestaBasica, global.VALORES_BASE.CESTA_BASICA),
            UNIFORME_MENSAL: parseNum(match.custosOperacionais?.uniformeEpis || ben.uniforme, global.VALORES_BASE.UNIFORME_MENSAL),
            GRATIFICACOES: parseNum(match.gratificacoes, 0),
            ADICIONAL_COPA: parseNum((match as any).adicionalCopa, 0)
        },
        BENEFICIOS_CONFIG: match.configuracoesBeneficios || { descontoVT: 0.06, descontoVA: 0.20, vaSobreFerias: true },
        ADICIONAIS_CONFIG: match.adicionais || { insalubridade: false, grauInsalubridade: 0.20, baseInsalubridade: 'SALARIO_MINIMO' },
        CUSTOS_OPS: match.custosOperacionais || { examesMedicos: 0, uniformeEpis: 0 },
        PROVISOES: {
            FERIAS: prov.ferias !== undefined ? Number(prov.ferias) : 0.1111,
            DECIMO_TERCEIRO: prov.decimoTerceiro !== undefined ? Number(prov.decimoTerceiro) : 0.0833,
            RESCISAO: prov.rescisao !== undefined ? Number(prov.rescisao) : 0.05,
        },
        PISOS: {
            ...global.PISOS,
            [match.funcao.toLowerCase()]: Number(match.salarioPiso)
        }
    };
}


function calcularEncargosSociais(remuneracao: number, valores: ReturnType<typeof getValoresFinais>): number {
    const { INSS, FGTS, RAT } = valores.ALIQUOTAS;
    const aliquotaTotal = INSS + FGTS + RAT;
    return remuneracao * aliquotaTotal;
}

function calcularProvisoes(remuneracao: number, valores: ReturnType<typeof getValoresFinais>): DetailedBreakdown {
    const { FERIAS, DECIMO_TERCEIRO, RESCISAO } = valores.PROVISOES;
    return {
        ferias: remuneracao * FERIAS,
        decimoTerceiro: remuneracao * DECIMO_TERCEIRO,
        rescisao: remuneracao * RESCISAO
    };
}


function calcularItem(config: BackendConfigPayload, valores: ReturnType<typeof getValoresFinais>) {
    const Materials = Number(config.materiais) || 0;
    const Quantidade = Number(config.quantidade) || 1;
    const AdicionalCopaManual = Number(config.adicionalCopa) || 0;

    const salarioBase = valores.VALORES_BASE.SALARIO_MINIMO; // PISO from Rule
    const gratificacoes = valores.VALORES_BASE.GRATIFICACOES;

    let adicionalCopa = 0;
    if (config.copa) {
        const copaRule = (valores.VALORES_BASE as any).ADICIONAL_COPA || 0;
        adicionalCopa = copaRule + AdicionalCopaManual;
        if (adicionalCopa === 0) adicionalCopa = salarioBase * 0.20;
    }

    const timeToMn = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
    const calcNoturno = (ent: string, sai: string) => {
        let s = timeToMn(ent), e = timeToMn(sai);
        if (e < s) e += 1440;
        const blockStart = Math.max(s, 1320); // 22:00
        const blockEnd = Math.min(e, 1740);   // 05:00
        let mins = Math.max(0, blockEnd - blockStart);
        if (s < 1320 && e < 1320 && s < 300) mins += Math.max(0, Math.min(e, 300) - s);
        return (mins / 60) * 1.142857;
    }

    let insalubridade = 0, periculosidade = 0, noturno = 0, intrajornada = 0, dsr = 0;

    if (config.adicionais?.insalubridade) {
        const baseIns = valores.ADICIONAIS_CONFIG.baseInsalubridade === 'SALARIO_BASE' ? salarioBase : 1412;
        insalubridade = baseIns * (valores.ADICIONAIS_CONFIG.grauInsalubridade || 0.20);
    }
    if (config.adicionais?.periculosidade) periculosidade = salarioBase * 0.30;
    if (config.horarioEntrada && config.horarioSaida) {
        const horasNoturnas = calcNoturno(config.horarioEntrada, config.horarioSaida);
        const horaBase = salarioBase / 220;
        noturno = horaBase * 0.20 * horasNoturnas * 22;
    }
    if (config.intrajornada) intrajornada = (salarioBase / 220) * 1.5 * 22;
    const varDSR = noturno + intrajornada;
    if (varDSR > 0) dsr = varDSR / 6;

    const totalAdicionais = insalubridade + periculosidade + noturno + intrajornada + dsr;
    const remuneracaoTotal = salarioBase + gratificacoes + adicionalCopa + totalAdicionais;

    const diasMes = config.dias.length * 4.33;
    let vr = 0;
    if (valores.VALORES_BASE.TIPO_VR === 'MENSAL') vr = valores.VALORES_BASE.VALE_REFEICAO_DIA;
    else vr = diasMes * valores.VALORES_BASE.VALE_REFEICAO_DIA;

    const vt = diasMes * valores.VALORES_BASE.VALE_TRANSPORTE_DIA;
    const cesta = valores.VALORES_BASE.CESTA_BASICA;
    const uniforme = valores.VALORES_BASE.UNIFORME_MENSAL;
    const vaFerias = valores.BENEFICIOS_CONFIG.vaSobreFerias ? (vr / 12) : 0;

    const descVT = Math.min(vt, salarioBase * (valores.BENEFICIOS_CONFIG.descontoVT || 0.06));
    const descVA = (vr + vaFerias) * (valores.BENEFICIOS_CONFIG.descontoVA || 0.20);
    const totalBeneficios = (vr + vt + cesta + uniforme + vaFerias) - (descVT + descVA);

    const encargos = calcularEncargosSociais(remuneracaoTotal, valores);
    const provisoesBreakdown = calcularProvisoes(remuneracaoTotal, valores);
    const totalProvisoes = provisoesBreakdown.ferias + provisoesBreakdown.decimoTerceiro + provisoesBreakdown.rescisao;

    const exames = valores.CUSTOS_OPS.examesMedicos || 0;

    const custoOperacional = remuneracaoTotal + totalBeneficios + encargos + totalProvisoes + Materials + exames;

    const lucro = custoOperacional * valores.ALIQUOTAS.MARGEM_LUCRO;
    const precoSemImp = custoOperacional + lucro;

    const taxRate = (valores.ALIQUOTAS.PIS || 0) + (valores.ALIQUOTAS.COFINS || 0) + (valores.ALIQUOTAS.ISS_PADRAO || 0);
    const safeTax = Math.min(taxRate, 0.50);

    const precoFinal = precoSemImp / (1 - safeTax);
    const tributos = precoFinal - precoSemImp;

    const totalMensal = precoFinal * Quantidade;

    return {
        config,
        custoUnitario: precoFinal,
        custoTotal: totalMensal,
        detalhamento: {
            salarioBase,
            gratificacoes,
            aliquotas: valores.ALIQUOTAS,
            adicionais: {
                insalubridade, periculosidade, noturno, intrajornada, dsr, copa: adicionalCopa,
                total: totalAdicionais + adicionalCopa
            },
            beneficios: {
                valeRefeicao: vr, valeTransporte: vt, cestaBasica: cesta, uniforme,
                vaSobreFerias: vaFerias, descontoVA: -descVA, descontoVT: -descVT,
                total: totalBeneficios
            },
            encargos,
            provisoes: { ...provisoesBreakdown, total: totalProvisoes },
            custosOperacionais: { examesMedicos: exames, total: exames },
            insumos: Materials,
            tributos,
            lucro,
            totalMensal: precoFinal
        }
    };
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const configs = body.configs as BackendConfigPayload[];
        const parametros = body.parametros as ParametrosCustos | undefined;

        if (!configs || !Array.isArray(configs) || configs.length === 0) {
            return NextResponse.json({ error: 'Invalid Input' }, { status: 400 });
        }

        let regrasDB: RegraCCT[] = [];
        try {
            regrasDB = await fetchActiveRules();
        } catch (e) {
            console.error("Error fetching active rules, proceeding with empty rules:", e);
        }

        const globalVals = getValores(parametros);

        const servicosCalculados = configs.map(config => {
            const match = getMatchingRule(config, regrasDB, globalVals);
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

        if (body.userData?.email) {
            const userData = body.userData;
            try {
                let lead = await prisma.lead.findFirst({ where: { email: userData.email } });
                if (lead) {
                    lead = await prisma.lead.update({
                        where: { id: lead.id },
                        data: { nome: userData.nome, empresa: userData.empresa, whatsapp: userData.whatsapp, cnpj: userData.cnpj }
                    });
                } else {
                    lead = await prisma.lead.create({
                        data: { nome: userData.nome || 'A', email: userData.email, empresa: userData.empresa || '', whatsapp: userData.whatsapp || '', cnpj: userData.cnpj || '' }
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
            } catch (e) { console.error("Save Error", e); }
        }

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('API CALC ERROR:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
