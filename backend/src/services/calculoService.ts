import { ConfiguracaoServico, BreakdownCustos, ResultadoSimulacao } from '../types/simulador';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CalculoService {

    // Helper to get rule from DB
    private async getRegra(funcao: string, estado: string) {
        // Find specific rule or fallback
        const regra = await prisma.convencaoColetiva.findFirst({
            where: {
                funcao: { equals: funcao },
                estado: { equals: estado }
            },
            orderBy: { createdAt: 'desc' }
        });
        return regra;
    }

    public async calcularProposta(configs: ConfiguracaoServico[]): Promise<ResultadoSimulacao> {
        const servicosCalculados = await Promise.all(configs.map(config => this.calcularItem(config)));

        const resumo = servicosCalculados.reduce((acc, item) => ({
            custoMensalTotal: acc.custoMensalTotal + item.custoTotal,
            custoAnualTotal: acc.custoAnualTotal + (item.custoTotal * 12),
            impostosTotal: acc.impostosTotal + item.detalhamento.tributos,
            lucroEstimado: acc.lucroEstimado + item.detalhamento.lucro
        }), { custoMensalTotal: 0, custoAnualTotal: 0, impostosTotal: 0, lucroEstimado: 0 });

        return {
            id: `PROP-${Date.now()}`,
            servicos: servicosCalculados,
            resumo
        };
    }

    public async salvarSimulacao(userData: any, configs: any, resultado: ResultadoSimulacao) {
        if (!userData || !userData.email) {
            console.log("Ignorando salvamento: UserData incompleto");
            return null;
        }

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

            const proposta = await prisma.proposta.create({
                data: {
                    numeroSequencial: `PROP-${Date.now()}`,
                    leadId: lead.id,
                    servicos: JSON.stringify(resultado.servicos),
                    custoMensal: resultado.resumo.custoMensalTotal,
                    custoAnual: resultado.resumo.custoAnualTotal,
                    breakdown: JSON.stringify(resultado.resumo),
                    status: 'DRAFT'
                }
            });

            return { lead, proposta };
        } catch (error) {
            console.error("Erro ao salvar simulação:", error);
            return null;
        }
    }

    public async getLeads() {
        return await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                propostas: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    private async calcularItem(config: ConfiguracaoServico) {
        const funcaoSearch = config.servicoId || config.funcao;
        const regra = await this.getRegra(funcaoSearch, config.estado);

        // Parse JSON fields
        const beneficiosRule = regra ? JSON.parse(regra.beneficios) : {};
        const provisoesRule = regra && (regra as any).provisoes ? JSON.parse((regra as any).provisoes) : { ferias: 0.1111, decimoTerceiro: 0.0833, rescisao: 0.05 };
        const aliquotasRule = regra && (regra as any).aliquotas ? JSON.parse((regra as any).aliquotas) : { inss: 0.20, fgts: 0.08, rat: 0.02, pis: 0.0165, cofins: 0.076, iss: 0.05, margemLucro: 0.15 };
        const configBeneficiosRule = regra && (regra as any).configuracoesBeneficios ? JSON.parse((regra as any).configuracoesBeneficios) : { descontoVT: 0.06, descontoVA: 0.20, vaSobreFerias: true };

        // Determine Base Salary
        let salarioBase = regra?.piso || (funcaoSearch.toLowerCase().includes('limpeza') ? 1590 : 1412);
        let gratificacoes = 0;
        let adicionalCopa = config.adicionalCopa || 0;

        // If specific cargo is selected, try to find it in the règle
        if (config.cargo && (regra as any).cargos) {
            const cargos = JSON.parse((regra as any).cargos);
            const selectedCargo = cargos.find((c: any) => c.nome === config.cargo);
            if (selectedCargo) {
                salarioBase = selectedCargo.piso;
                gratificacoes = selectedCargo.gratificacao || 0;
                if (!config.adicionalCopa) adicionalCopa = selectedCargo.adicionalCopa || 0;
            }
        }

        const diasTrabalhados = config.diasSemana ? config.diasSemana.length * 4.33 : 22;

        // 3. Adicionais
        const baseInsalubridade = (regra as any).adicionais && JSON.parse((regra as any).adicionais).baseInsalubridade === 'SALARIO_BASE' ? salarioBase : 1412;
        const grauInsalubridade = config.grauInsalubridade || 0;
        const insalubridade = baseInsalubridade * grauInsalubridade;

        const periculosidade = config.adicionalCopa ? 0 : (regra?.funcao.includes('SEGURANCA') ? salarioBase * 0.30 : 0);

        let intrajornada = 0;
        if (config.intrajornada) {
            const valorHora = (salarioBase + gratificacoes) / 220;
            intrajornada = valorHora * 1.5 * diasTrabalhados;
        }

        // Simplificação DSR
        const dsr = (intrajornada) * 0.20;

        const remuneracaoTotal = salarioBase + gratificacoes + insalubridade + periculosidade + intrajornada + dsr;

        // 4. Benefícios
        const vrCusto = beneficiosRule.tipoValeRefeicao === 'MENSAL' ? Number(beneficiosRule.valeRefeicao || 0) : Number(beneficiosRule.valeRefeicao || 25) * diasTrabalhados;
        const vtCusto = Number(beneficiosRule.valeTransporte || 12) * diasTrabalhados;
        const cesta = Number(beneficiosRule.cestaBasica || 150);
        const uniforme = Number(beneficiosRule.uniforme || 40);

        const vaFerias = configBeneficiosRule.vaSobreFerias ? (vrCusto / 12) : 0;
        const descVT = Math.min(salarioBase * (configBeneficiosRule.descontoVT || 0.06), vtCusto);
        const descVA = (vrCusto + vaFerias) * (configBeneficiosRule.descontoVA || 0.20);

        const totalBeneficios = vrCusto + vtCusto + cesta + uniforme + vaFerias - descVT - descVA;

        // 5. Encargos e Provisões
        const encRate = (aliquotasRule.inss || 0.20) + (aliquotasRule.fgts || 0.08) + (aliquotasRule.rat || 0.02);
        const encargosVal = (salarioBase + gratificacoes) * encRate;

        const provRate = (provisoesRule.ferias || 0.1111) + (provisoesRule.decimoTerceiro || 0.0833) + (provisoesRule.rescisao || 0.05);
        const provisoesVal = (salarioBase + gratificacoes) * provRate;

        const custosOps = (regra as any).custosOperacionais ? JSON.parse((regra as any).custosOperacionais) : { examesMedicos: 15, uniformeEpis: 30 };
        const totalOps = (custosOps.examesMedicos || 0) + (custosOps.uniformeEpis || 0);

        const insumosVal = (config.materiais || 0);

        // Subtotal (A + B + C + Copa)
        const custoOperacional = remuneracaoTotal + totalBeneficios + encargosVal + provisoesVal + totalOps + insumosVal + adicionalCopa;

        // 7. Lucro
        const margenLucro = aliquotasRule.margemLucro || 0.15;
        const lucro = custoOperacional * margenLucro;

        // 8. Taxes
        const taxRate = (aliquotasRule.pis || 0.0165) + (aliquotasRule.cofins || 0.076) + (aliquotasRule.iss || 0.05);
        const precoSemImpostos = custoOperacional + lucro;
        const precoFinal = precoSemImpostos / (1 - taxRate);
        const tributos = precoFinal - precoSemImpostos;

        const custoTotal = precoFinal * config.quantidade;

        const detalhamento: BreakdownCustos = {
            salarioBase,
            gratificacoes,
            adicionais: {
                insalubridade,
                periculosidade,
                noturno: 0,
                intrajornada,
                dsr,
                copa: adicionalCopa,
                total: insalubridade + periculosidade + intrajornada + dsr + adicionalCopa
            },
            beneficios: {
                valeRefeicao: vrCusto,
                valeTransporte: vtCusto,
                cestaBasica: cesta,
                uniforme: uniforme,
                vaSobreFerias: vaFerias,
                descontoVA: -descVA,
                descontoVT: -descVT,
                total: totalBeneficios
            },
            encargos: encargosVal,
            provisoes: {
                ferias: (salarioBase + gratificacoes) * (provisoesRule.ferias || 0.1111),
                decimoTerceiro: (salarioBase + gratificacoes) * (provisoesRule.decimoTerceiro || 0.0833),
                rescisao: (salarioBase + gratificacoes) * (provisoesRule.rescisao || 0.05),
                total: provisoesVal
            },
            custosOperacionais: {
                examesMedicos: custosOps.examesMedicos || 0,
                total: totalOps
            },
            insumos: insumosVal,
            tributos,
            lucro,
            totalMensal: precoFinal
        };

        return {
            config,
            custoUnitario: precoFinal,
            custoTotal,
            detalhamento
        };
    }
}

