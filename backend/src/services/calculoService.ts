import { ConfiguracaoServico, BreakdownCustos, ResultadoSimulacao } from '../types/simulador';

export class CalculoService {

    // Mock constants based on average market values/Technical Doc examples
    private static readonly ALIQUOTAS = {
        INSS: 0.20,
        FGTS: 0.08,
        RAT: 0.02,
        PIS: 0.0165,
        COFINS: 0.076,
        ISS_PADRAO: 0.05,
        MARGEM_LUCRO: 0.15, // 15% Profit Margin
    };

    private static readonly VALORES_BASE = {
        SALARIO_MINIMO: 1412.00,
        VALE_REFEICAO_DIA: 25.00,
        VALE_TRANSPORTE_DIA: 12.00, // Average round trip
        CESTA_BASICA: 150.00,
        UNIFORME_MENSAL: 25.00, // Amortized
    };

    /**
     * Orchestrates the calculation for a full proposal request
     */
    public async calcularProposta(configs: ConfiguracaoServico[]): Promise<ResultadoSimulacao> {
        const servicosCalculados = configs.map(config => this.calcularItem(config));

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
     * Calculates costs for a single service item (e.g., 2 Cleaners)
     */
    private calcularItem(config: ConfiguracaoServico) {
        // 1. Determine Base Salary (Mock logic based on role)
        const salarioBase = this.getPisoSalarial(config.funcao);

        // 2. Calculate Additionals (Insalubridade, Night shift, etc.)
        const adicionais = this.calcularAdicionais(salarioBase, config.adicionais);
        const remuneracaoTotal = salarioBase + adicionais;

        // 3. Benefits (VR, VT, Cesta, Uniforme)
        const diasTrabalhados = config.dias.length * 4.33; // Average weeks/month
        const beneficios = this.calcularBeneficios(diasTrabalhados);

        // 4. Social Charges (Encargos on Salary + Additionals)
        const encargos = this.calcularEncargos(remuneracaoTotal);

        // 5. Inputs (Materials)
        const insumos = (config.materiais || 0);

        // Subtotal before Taxes and Profit
        const custoOperacional = remuneracaoTotal + beneficios + encargos + insumos;

        // 6. Profit Margin (Markup)
        const lucro = custoOperacional * CalculoService.ALIQUOTAS.MARGEM_LUCRO;

        // Price before taxes
        const precoSemImpostos = custoOperacional + lucro;

        // 7. Taxes (Gross up calculation to include taxes inside the final price)
        // Formula: Price = Cost / (1 - TaxRate)
        const totalImpostosRate = CalculoService.ALIQUOTAS.PIS + CalculoService.ALIQUOTAS.COFINS + CalculoService.ALIQUOTAS.ISS_PADRAO;
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
            totalMensal: precoFinal // Unitary total price
        };

        return {
            config,
            custoUnitario: precoFinal,
            custoTotal,
            detalhamento
        };
    }

    private getPisoSalarial(funcao: string): number {
        // Simplified lookup. In real app, this comes from DB/Parametrization
        const normalized = funcao.toLowerCase();
        if (normalized.includes('limpeza')) return 1590.00;
        if (normalized.includes('seguranca') || normalized.includes('vigilante')) return 2100.00;
        if (normalized.includes('recepcao')) return 1750.00;
        if (normalized.includes('jardineiro')) return 1800.00;
        return CalculoService.VALORES_BASE.SALARIO_MINIMO;
    }

    private calcularAdicionais(base: number, configAdicionais?: ConfiguracaoServico['adicionais']): number {
        let total = 0;
        if (configAdicionais?.insalubridade) total += CalculoService.VALORES_BASE.SALARIO_MINIMO * 0.20; // 20% on Min Wage
        if (configAdicionais?.periculosidade) total += base * 0.30; // 30% on Base Salary
        // Night shift logic would be more complex (hours calculation), skipping for MVP
        return total;
    }

    private calcularBeneficios(dias: number): number {
        const vr = dias * CalculoService.VALORES_BASE.VALE_REFEICAO_DIA;
        const vt = dias * CalculoService.VALORES_BASE.VALE_TRANSPORTE_DIA;
        // Discount 6% VT from employee (ignored for simplified cost to client, assumed full cost for safety)
        return vr + vt + CalculoService.VALORES_BASE.CESTA_BASICA + CalculoService.VALORES_BASE.UNIFORME_MENSAL;
    }

    private calcularEncargos(baseCalculo: number): number {
        const { INSS, FGTS, RAT } = CalculoService.ALIQUOTAS;
        // Add 13th, Vacation (1/3), Rescisão provision (~30% simplified)
        const provisionRate = 0.35;

        const basicCharges = baseCalculo * (INSS + FGTS + RAT);
        const provisions = baseCalculo * provisionRate;

        return basicCharges + provisions;
    }
}
