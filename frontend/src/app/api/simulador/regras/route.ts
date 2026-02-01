import { NextResponse } from 'next/server';
import { RegraCCT } from '@/types/simulador';

const MOCK_DEFAULTS = {
    aliquotas: { inss: 0.20, fgts: 0.08, rat: 0.02, pis: 0.0165, cofins: 0.076, iss: 0.05, margemLucro: 0.15 },
    custosOperacionais: { examesMedicos: 15, uniformeEpis: 30 },
    adicionais: { insalubridade: false, grauInsalubridade: 0.20, baseInsalubridade: 'SALARIO_MINIMO' as const, periculosidade: false },
    provisoes: { ferias: 0.1111, decimoTerceiro: 0.0833, rescisao: 0.05 }
};

const MOCK_REGRAS: RegraCCT[] = [
    {
        id: '1',
        uf: 'PR',
        cidade: 'Curitiba',
        funcao: 'LIMPEZA',
        dataVigencia: '2025-01-01',
        salarioPiso: 1590.00,
        beneficios: { valeRefeicao: 25, valeTransporte: 12, cestaBasica: 150, uniforme: 25 },
        cargos: [
            { nome: 'Auxiliar de Limpeza', piso: 1590.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Líder de Limpeza', piso: 1950.00, gratificacao: 200, adicionalCopa: 0 }
        ],
        ...MOCK_DEFAULTS
    },
    {
        id: '2',
        uf: 'SP',
        cidade: 'São Paulo',
        funcao: 'LIMPEZA',
        dataVigencia: '2025-01-01',
        salarioPiso: 1850.00,
        beneficios: { valeRefeicao: 35, valeTransporte: 18, cestaBasica: 200, uniforme: 30 },
        cargos: [
            { nome: 'Auxiliar de Limpeza', piso: 1850.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Encarregado de Limpeza', piso: 2400.00, gratificacao: 350, adicionalCopa: 100 }
        ],
        ...MOCK_DEFAULTS
    },
    {
        id: '3',
        uf: 'SC',
        cidade: 'Florianópolis',
        funcao: 'LIMPEZA',
        dataVigencia: '2025-01-01',
        salarioPiso: 1700.00,
        beneficios: { valeRefeicao: 28, valeTransporte: 15, cestaBasica: 180, uniforme: 28 },
        cargos: [
            { nome: 'Auxiliar de Limpeza', piso: 1700.00, gratificacao: 0, adicionalCopa: 50 },
            { nome: 'Zelador', piso: 2100.00, gratificacao: 150, adicionalCopa: 0 }
        ],
        ...MOCK_DEFAULTS
    }
];

export async function GET() {
    return NextResponse.json(MOCK_REGRAS);
}
