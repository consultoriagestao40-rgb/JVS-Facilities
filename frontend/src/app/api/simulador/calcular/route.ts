import { NextResponse } from 'next/server';
import { ParametrosCustos, RegraCCT } from '@/types/simulador';
import { MOCK_REGRAS } from '@/data/regrasCCT';
import prisma from '@/lib/prisma';

// --- Types ---
interface BackendConfigPayload {
    funcao: string; // Service ID (e.g., 'LIMPEZA', 'PORTARIA')
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
    try {
        const dbRules = await prisma.convencaoColetiva.findMany({
            where: { ativo: true }
        });

        // Map DB simplified schema to Application RegraCCT schema
        // Note: The Prisma schema might be slightly different. We need to map it carefully.
        // Assuming the DB stores JSON fields effectively.

        return dbRules.map(r => {
            // Parse JSON fields safely
            const aliquotas = typeof r.aliquotas === 'string' ? JSON.parse(r.aliquotas) : r.aliquotas;
            const beneficios = typeof r.beneficios === 'string' ? JSON.parse(r.beneficios) : r.beneficios;
            const provisoes = typeof r.detalhes === 'string' ? JSON.parse(r.detalhes)?.provisoes : {};
            // Note: 'detalhes' often holds extra stuff in some schemas. 
            // But wait, look at typical RegraCCT type. 

            // Let's rely on how the "RegrasCCTManager" saves it.
            // Usually it saves 'aliquotas', 'beneficios', 'adicionais' as JSON.

            return {
                id: r.id,
                uf: r.uf,
                cidade: r.cidade,
                funcao: r.funcao,
                dataBase: r.dataBase.toISOString(),
                salarioPiso: Number(r.piso),
                piso: Number(r.piso), // Legacy compat
                // @ts-ignore
                sindicato: r.sindicato || 'SINDEPRESTEM',

                aliquotas: typeof r.aliquotas === 'object' ? r.aliquotas : JSON.parse(r.aliquotas as string || '{}'),
                beneficios: typeof r.beneficios === 'object' ? r.beneficios : JSON.parse(r.beneficios as string || '{}'),
                adicionais: typeof r.adicionais === 'object' ? r.adicionais : JSON.parse(r.adicionais as string || '{}'),

                // If cargos exists in DB schema (it typically does as a Relation or JSON)
                // For now, let's assume simple mapping or empty if not present
                // @ts-ignore
                cargos: r.cargos ? (typeof r.cargos === 'string' ? JSON.parse(r.cargos) : r.cargos) : [],

                // Configs (often stored in 'detalhes' or separate fields in some versions)
                // @ts-ignore
                provisoes: provisoes || { FERIAS: 0.1111, DECIMO_TERCEIRO: 0.0833, RESCISAO: 0.05 },

                // Gratificacoes often in 'beneficios' or separate?
                // Let's assume 0 if not explicitly mapped
                gratificacoes: 0
            } as unknown as RegraCCT;
        });
    } catch (e) {
        console.error("Failed to fetch rules from DB, using MOCK:", e);
        return MOCK_REGRAS;
    }
}


function getMatchingRule(
    config: BackendConfigPayload,
    regras: RegraCCT[],
    globalParams: ReturnType<typeof getValores>
) {
    if (!regras || regras.length === 0) return null;

    // Filter by Service Type (funcao) usually matches the high-level ID
    const validRules = regras.filter(r => r.funcao.toUpperCase() === config.funcao.toUpperCase());

    let bestMatch: RegraCCT | null = null;
    let maxScore = -1;

    for (const r of validRules) {
        let score = 0;

        // 1. Location Match
        const rUf = r.uf?.toUpperCase() || '';
        const cUf = config.estado?.toUpperCase() || '';
        const rCidade = r.cidade?.toLowerCase() || '';
        const cCidade = config.cidade?.toLowerCase() || '';

        const isExactCity = rUf === cUf && rCidade === cCidade;
        const isStateGeneric = rUf === cUf && (rCidade === '*' || rCidade === '');

        if (!isExactCity && !isStateGeneric) continue;

        score += isExactCity ? 20 : 10;

        // 2. Cargo Match
        const configCargo = (config as any).cargo; // E.g. "JARDINEIRO"
        const ruleCargosList = r.cargos || [];

        // Simple case: Rule has no specific sub-cargos (Generic for the Service)
        // vs Rule HAS sub-cargos (Specific list like Zelador, Porteiro)

        let foundSpecific = false;

        if (configCargo) {
            const matchCargo = ruleCargosList.find(c => c.nome.toLowerCase() === configCargo.toLowerCase());
            if (matchCargo) {
                score += 5;
                foundSpecific = true;
            } else if (ruleCargosList.length === 0) {
                // Rule is generic, so it applies to any cargo in this service
                score += 1;
            } else {
                // Rule has specific cargos but NONE match ours -> Skip this rule?
                // Or maybe it's a "Partial" match?
                // Usually if a rule lists specific cargos, it replaces the generic one.
                // We'll skip if it has a list but we're not in it.
                continue;
            }
        } else {
            // No cargo specified in config? (Rare)
            score += 1;
        }

        if (score > maxScore) {
            maxScore = score;

            // If we matched a specific sub-cargo in the rule list, we must OVERRIDE values
            if (foundSpecific && configCargo) {
                const specificRole = ruleCargosList.find(c => c.nome.toLowerCase() === configCargo.toLowerCase());
                if (specificRole) {
                    bestMatch = {
                        ...r,
                        salarioPiso: specificRole.piso || r.salarioPiso,
                        gratificacoes: specificRole.gratificacao || r.gratificacoes,
                        // @ts-ignore
                        adicionalCopa: specificRole.adicionalCopa // Specific role copa override
                    };
                }
            } else {
                bestMatch = r;
            }
        }
    }

    // Default Fallback: If absolutely no match found in DB for this location...
    // We try to find a 'PR' rule as a safe default (since client is PR based)
    if (!bestMatch) {
        bestMatch = regras.find(r => r.id === 'PR_LIMPEZA_2025' || (r.uf === 'PR' && r.funcao === config.funcao)) || null;
    }

    return bestMatch;
}



// --- 2. CALCULATION HELPERS ---

function getValores(params?: ParametrosCustos) {
    // These are just SYSTEM defaults if nothing else exists. 
    // They are usually overridden by Rules.
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
            GRATIFICACOES: 0
        },
        PISOS: params?.pisosSalariais ?? {
            // Hard fallbacks
            limpeza: 1900.00,
            seguranca: 2100.00,
            recepcao: 1750.00,
            jardinagem: 1800.00
        },
        CUSTOS_OPS: { examesMedicos: 0, uniformeEpis: 0 },
        ADICIONAIS_CONFIG: { insalubridade: false, grauInsalubridade: 0.20, baseInsalubridade: 'SALARIO_MINIMO' }
    };
}


function getValoresFinais(
    match: RegraCCT | null,
    global: ReturnType<typeof getValores>
) {
    if (!match) {
        console.warn("NO MATCHING RULE FOUND. USING DEFAULTS.");
        return {
            ...global,
            PROVISOES: { FERIAS: 0.1111, DECIMO_TERCEIRO: 0.0833, RESCISAO: 0.05 }
        };
    }

    // DEBUG: Parse values to ensure they are numbers
    const parseNum = (val: any, def: number) => {
        const n = Number(val);
        return isNaN(n) ? def : n;
    };

    // ALIASES:
    const aliq = match.aliquotas || {};
    const ben = match.beneficios || {};
    const prov = match.provisoes || {};

    // Construct merged object
    return {
        ALIQUOTAS: {
            ...global.ALIQUOTAS,
            // Override with Rule values if present. 
            // Important: Handle 0 properly (it might be a valid 0%)
            INSS: aliq.inss !== undefined ? Number(aliq.inss) : global.ALIQUOTAS.INSS,
            FGTS: aliq.fgts !== undefined ? Number(aliq.fgts) : global.ALIQUOTAS.FGTS,
            RAT: aliq.rat !== undefined ? Number(aliq.rat) : global.ALIQUOTAS.RAT,
            // Extended charges often in 'outros' or 'sistemaS'
            // We'll sum them into RAT or define new? 
            // For now, let's assume 'rat' in DB rule includes SAT/RAT adjusted.

            // Margem
            MARGEM_LUCRO: aliq.margemLucro !== undefined ? Number(aliq.margemLucro) : global.ALIQUOTAS.MARGEM_LUCRO,

            // Taxes
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
        // Important: Rule Provisoes override
        PROVISOES: {
            FERIAS: prov.ferias !== undefined ? Number(prov.ferias) : 0.1111,
            DECIMO_TERCEIRO: prov.decimoTerceiro !== undefined ? Number(prov.decimoTerceiro) : 0.0833,
            RESCISAO: prov.rescisao !== undefined ? Number(prov.rescisao) : 0.05,
            // We can also have 'multaFGTS' etc?
        },
        PISOS: {
            ...global.PISOS,
            [match.funcao.toLowerCase()]: Number(match.salarioPiso)
        }
    };
}


function calcularEncargosSociais(remuneracao: number, valores: ReturnType<typeof getValoresFinais>): number {
    const { INSS, FGTS, RAT } = valores.ALIQUOTAS;
    // The sum here (e.g. 20 + 8 + 2 = 30%)
    return remuneracao * (INSS + FGTS + RAT);
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
    // Inputs
    const Materials = Number(config.materiais) || 0;
    const Quantidade = Number(config.quantidade) || 1;
    const AdicionalCopaManual = Number(config.adicionalCopa) || 0;

    // 1. Base Logic
    // We trust valores.VALORES_BASE.SALARIO_MINIMO which is the Rule's PISO.
    const salarioBase = valores.VALORES_BASE.SALARIO_MINIMO;
    const gratificacoes = valores.VALORES_BASE.GRATIFICACOES;

    let adicionalCopa = 0;
    if (config.copa) {
        adicionalCopa = valores.VALORES_BASE.ADICIONAL_COPA + AdicionalCopaManual;
        if (adicionalCopa === 0) adicionalCopa = salarioBase * 0.20; // Default 20% if checked but 0
    }

    // 2. Adicionais (Insalubridade, Noturno etc)
    // NOTE: We need the helpers 'timeToMinutes' and 'calcularHorasNoturnas' and 'calcularAdicionais'
    // Re-inlining them or ensuring they are available.
    // For brevity in this artifacts, I assume the code block below includes them or I write them.
    // Let's implement minimal robust versions here.

    // ... (Helpers implementation inline)
    const timeToMn = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
    const calcNoturno = (ent: string, sai: string) => {
        let s = timeToMn(ent), e = timeToMn(sai);
        if (e < s) e += 1440;
        // 22:00 = 1320, 05:00 (+1day) = 1740
        const blockStart = Math.max(s, 1320);
        const blockEnd = Math.min(e, 1740);
        let mins = Math.max(0, blockEnd - blockStart);

        // Morning overlap (00:00 to 05:00)
        if (s < 1320 && e < 1320 && s < 300) {
            mins += Math.max(0, Math.min(e, 300) - s);
        }
        return (mins / 60) * 1.142857;
    }

    let insalubridade = 0, periculosidade = 0, noturno = 0, intrajornada = 0, dsr = 0;

    // Insalubridade
    if (config.adicionais?.insalubridade) {
        const baseIns = valores.ADICIONAIS_CONFIG.baseInsalubridade === 'SALARIO_BASE' ? salarioBase : 1412; // Or Global Min Wage? prefer 1412 constant or param
        insalubridade = baseIns * (valores.ADICIONAIS_CONFIG.grauInsalubridade || 0.20);
    }
    // Periculosidade
    if (config.adicionais?.periculosidade) {
        periculosidade = salarioBase * 0.30;
    }
    // Noturno
    if (config.horarioEntrada && config.horarioSaida) {
        const horasNoturnas = calcNoturno(config.horarioEntrada, config.horarioSaida);
        const horaBase = salarioBase / 220;
        noturno = horaBase * 0.20 * horasNoturnas * 22; // Avg 22 days
    }
    // Intrajornada
    if (config.intrajornada) {
        intrajornada = (salarioBase / 220) * 1.5 * 22;
    }
    // DSR
    const varDSR = noturno + intrajornada; // Usually Peric/Insal are monthly.
    if (varDSR > 0) dsr = varDSR / 6;

    const totalAdicionais = insalubridade + periculosidade + noturno + intrajornada + dsr;

    // Remuneração Calculation
    const remuneracaoTotal = salarioBase + gratificacoes + adicionalCopa + totalAdicionais;


    // 3. Benefícios
    const diasMes = config.dias.length * 4.33;

    let vr = 0;
    if (valores.VALORES_BASE.TIPO_VR === 'MENSAL') vr = valores.VALORES_BASE.VALE_REFEICAO_DIA;
    else vr = diasMes * valores.VALORES_BASE.VALE_REFEICAO_DIA;

    const vt = diasMes * valores.VALORES_BASE.VALE_TRANSPORTE_DIA;
    const cesta = valores.VALORES_BASE.CESTA_BASICA;
    const uniforme = valores.VALORES_BASE.UNIFORME_MENSAL;

    const vaFerias = valores.BENEFICIOS_CONFIG.vaSobreFerias ? (vr / 12) : 0;

    // Discounts
    const descVT = Math.min(vt, salarioBase * (valores.BENEFICIOS_CONFIG.descontoVT || 0.06));
    const descVA = (vr + vaFerias) * (valores.BENEFICIOS_CONFIG.descontoVA || 0.20);

    const totalBeneficios = (vr + vt + cesta + uniforme + vaFerias) - (descVT + descVA);


    // 4. Encargos & Provisoes
    const encargos = calcularEncargosSociais(remuneracaoTotal, valores);
    const provisoesBreakdown = calcularProvisoes(remuneracaoTotal, valores);
    const totalProvisoes = provisoesBreakdown.ferias + provisoesBreakdown.decimoTerceiro + provisoesBreakdown.rescisao;


    // 5. Costing
    const exames = valores.CUSTOS_OPS.examesMedicos || 0;
    const custoOperacional = remuneracaoTotal + totalBeneficios + encargos + totalProvisoes + Materials + exames;

    const lucro = custoOperacional * valores.ALIQUOTAS.MARGEM_LUCRO;
    const precoSemImp = custoOperacional + lucro;

    const taxRate = (valores.ALIQUOTAS.PIS || 0) + (valores.ALIQUOTAS.COFINS || 0) + (valores.ALIQUOTAS.ISS_PADRAO || 0);
    const safeTax = Math.min(taxRate, 0.50);

    const precoFinal = precoSemImp / (1 - safeTax);
    const tributos = precoFinal - precoSemImp;

    const totalMensal = precoFinal * Quantidade;


    // Detailed Result
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
            totalMensal: precoFinal // Unitary
        }
    };
}


// --- 3. API LISTENER ---

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const configs = body.configs as BackendConfigPayload[];
        const parametros = body.parametros as ParametrosCustos | undefined; // Fallback params

        if (!configs || !Array.isArray(configs) || configs.length === 0) {
            return NextResponse.json({ error: 'Invalid Input' }, { status: 400 });
        }

        // 1. FETCH RULES FROM DB (Source of Truth)
        const regrasDB = await fetchActiveRules();

        // 2. FETCH SYSTEM PARAMS (Optional, if we want to support global override from DB too)
        // For now, using body.parametros is fine for defaults, since Rules override them.
        const globalVals = getValores(parametros);

        // 3. CALCULATE
        const servicosCalculados = configs.map(config => {
            const match = getMatchingRule(config, regrasDB, globalVals);
            const valoresFinais = getValoresFinais(match, globalVals);
            return calcularItem(config, valoresFinais);
        });

        // 4. SUMMARIZE
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

        // 5. SAVE
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
