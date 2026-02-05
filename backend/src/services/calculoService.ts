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

    /**
     * Orchestrates the calculation for a full proposal request
     */
    public async calcularProposta(configs: ConfiguracaoServico[]): Promise<ResultadoSimulacao> {
        // We need to async map
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
            // 1. Create or Update Lead
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

            // 2. Create Proposta
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
            return null; // Don't crash
        }
    }

    public async getLeads() {
        return await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                propostas: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    /**
     * Calculates costs for a single service item
     */
    /**
     * Calculates costs for a single service item
     */
    private async calcularItem(config: ConfiguracaoServico) {
        // 1. Fetch Rule from DB
        const regra = await this.getRegra(config.funcao, config.estado);

        // Parse JSON fields from Rule or use Fallbacks
        const beneficiosRule = regra ? JSON.parse(regra.beneficios) : {};
        // Placeholder for future aliquotas logic
        const aliquotasRule = {};

        // 2. Determine Base Salary
        const salarioBase = regra?.piso || (config.funcao.toLowerCase().includes('limpeza') ? 1590 : 1412);

        // 3. Calculate Additionals
        const adicionaisObj = this.calcularAdicionais(salarioBase, config.adicionais);
        const remuneracaoTotal = salarioBase + adicionaisObj.total;

        // 4. Benefits
        const diasTrabalhados = 22; // Avg
        const beneficiosObj = this.calcularBeneficios(diasTrabalhados, beneficiosRule, salarioBase);

        // 5. Encargos (Standard 20% + 8% + 2% + Provisions)
        const encargosVal = this.calcularEncargos(remuneracaoTotal);

        // 6. Insumos
        const insumosVal = (config.materiais || 0);

        // Subtotal
        const custoOperacional = remuneracaoTotal + beneficiosObj.total + encargosVal + insumosVal;

        // 7. Profit (15% default)
        const margenLucro = 0.15;
        const lucro = custoOperacional * margenLucro;

        // 8. Taxes (16.25%)
        const impostosRate = 0.1625; // 1.65 + 7.6 + 5 + 2 (approx)
        const precoSemImpostos = custoOperacional + lucro;
        const precoFinal = precoSemImpostos / (1 - impostosRate);
        const tributos = precoFinal - precoSemImpostos;

        const custoTotal = precoFinal * config.quantidade;

        const detalhamento: BreakdownCustos = {
            salarioBase,
            adicionais: adicionaisObj, // detailed object
            beneficios: beneficiosObj, // detailed object
            encargos: encargosVal,
            insumos: insumosVal,
            tributos,
            lucro,
            totalMensal: precoFinal,
            provisoes: { // Mock breakdown for provisions embedded in encargos for now just to satisfy type
                ferias: 0, decimoTerceiro: 0, rescisao: 0, total: 0
            }
        };

        return {
            config,
            custoUnitario: precoFinal,
            custoTotal,
            detalhamento
        };
    }

    private calcularAdicionais(base: number, configAdicionais?: any) {
        let insalubridade = 0;
        let periculosidade = 0;

        if (configAdicionais?.insalubridade) insalubridade = 1412 * 0.20;
        if (configAdicionais?.periculosidade) periculosidade = base * 0.30;

        return {
            insalubridade,
            periculosidade,
            noturno: 0,
            intrajornada: 0,
            dsr: 0,
            total: insalubridade + periculosidade
        };
    }

    private calcularBeneficios(dias: number, ruleBeneficios: any, salarioBase: number) {
        const vr = Number(ruleBeneficios.valeRefeicao || 25) * dias;
        const vt = Number(ruleBeneficios.valeTransporte || 12) * dias;
        const cesta = Number(ruleBeneficios.cestaBasica || 150);
        const uniforme = Number(ruleBeneficios.uniforme || 25);
        const copa = Number(ruleBeneficios.adicionalCopa || 0);
        const vaFerias = (Number(ruleBeneficios.vaSobreFerias || 0) > 0) ? (vr / 12) : 0; // Approx logic if boolean

        // Discounts
        const descVT = salarioBase * 0.06; // 6% of base
        const descVA = 0; // Assuming 0 for now as it varies

        const total = vr + vt + cesta + uniforme + copa + vaFerias - descVT - descVA;

        return {
            valeRefeicao: vr,
            valeTransporte: vt,
            cestaBasica: cesta,
            uniforme: uniforme,
            adicionalCopa: copa,
            vaSobreFerias: vaFerias,
            descontoVA: -descVA,
            descontoVT: -descVT,
            total
        };
    }



    private calcularEncargos(base: number): number {
        const rate = 0.30 + 0.35; // Encargos + Provisoes simple approx
        return base * rate;
    }
}
