import { Request, Response } from 'express';
import { CalculoService } from '../services/calculoService';
import { ConfiguracaoServico } from '../types/simulador';

export class SimuladorController {
    private calculoService: CalculoService;

    constructor() {
        this.calculoService = new CalculoService();
    }

    public calcular = async (req: Request, res: Response) => {
        try {
            const configs: ConfiguracaoServico[] = req.body.configs;

            if (!configs || !Array.isArray(configs) || configs.length === 0) {
                return res.status(400).json({
                    error: 'Invalid Input',
                    message: 'É necessário fornecer uma lista de configurações de serviço.'
                });
            }

            const resultado = await this.calculoService.calcularProposta(configs);

            return res.status(200).json(resultado);
        } catch (error) {
            console.error('Erro ao calcular proposta:', error);
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ocorreu um erro ao processar o cálculo da proposta.'
            });
        }
    }
}
