import { NextResponse } from 'next/server';
import { RegraCCT } from '@/types/simulador';

// Mock Data - In a real app this would come from a DB
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
        ]
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
        ]
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
        ]
    }
];

export async function GET() {
    return NextResponse.json(MOCK_REGRAS);
}
