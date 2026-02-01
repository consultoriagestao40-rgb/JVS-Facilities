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

    /**
     * Calculates costs for a single service item
     */
    private async calcularItem(config: ConfiguracaoServico) {
        // 1. Fetch Rule from DB
        const regra = await this.getRegra(config.funcao, config.estado);

        // Parse JSON fields from Rule or use Fallbacks
        const beneficiosRule = regra ? JSON.parse(regra.beneficios) : {};
        const aliquotasRule = {};

        // 2. Determine Base Salary
        const salarioBase = regra?.piso || (config.funcao.toLowerCase().includes('limpeza') ? 1590 : 1412);

        // 3. Calculate Additionals
        const adicionaisVal = this.calcularAdicionais(salarioBase, config.adicionais);
        const remuneracaoTotal = salarioBase + adicionaisVal;

        // 4. Benefits
        const diasTrabalhados = 22; // Avg
        const beneficiosVal = this.calcularBeneficios(diasTrabalhados, beneficiosRule);

        // 5. Encargos (Standard 20% + 8% + 2% + Provisions)
        const encargosVal = this.calcularEncargos(remuneracaoTotal);

        // 6. Insumos
        const insumosVal = (config.materiais || 0);

        // Subtotal
        const custoOperacional = remuneracaoTotal + beneficiosVal + encargosVal + insumosVal;

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
            adicionais: adicionaisVal,
            beneficios: beneficiosVal,
            encargos: encargosVal,
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

    private calcularAdicionais(base: number, configAdicionais?: any): number {
        let total = 0;
        if (configAdicionais?.insalubridade) total += 1412 * 0.20;
        if (configAdicionais?.periculosidade) total += base * 0.30;
        return total;
    }

    private calcularBeneficios(dias: number, ruleBeneficios: any): number {
        const vr = Number(ruleBeneficios.valeRefeicao || 25) * dias;
        const vt = Number(ruleBeneficios.valeTransporte || 12) * dias;
        const cesta = Number(ruleBeneficios.cestaBasica || 150);
        const uniforme = Number(ruleBeneficios.uniforme || 25);
        const copa = Number(ruleBeneficios.adicionalCopa || 0); // HERE IS THE FIX

        return vr + vt + cesta + uniforme + copa;
    }

    private calcularEncargos(base: number): number {
        const rate = 0.30 + 0.35; // Encargos + Provisoes simple approx
        return base * rate;
    }
}
