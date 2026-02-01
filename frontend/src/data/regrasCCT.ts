
import { RegraCCT } from '@/types/simulador';

const MOCK_DEFAULTS = {
    aliquotas: { inss: 0.20, fgts: 0.08, rat: 0.02, pis: 0.0165, cofins: 0.076, iss: 0.05, margemLucro: 0.15 },
    custosOperacionais: { examesMedicos: 15, uniformeEpis: 30 },
    adicionais: { insalubridade: false, grauInsalubridade: 0.20, baseInsalubridade: 'SALARIO_MINIMO' as const, periculosidade: false },
    provisoes: { ferias: 0.1111, decimoTerceiro: 0.0833, rescisao: 0.05 }
};

// Mock Data - Based on Provided CCT PR Table and others
export const MOCK_REGRAS: RegraCCT[] = [
    // --- PARANÁ (PR) ---
    {
        id: 'PR_LIMPEZA_2025',
        uf: 'PR',
        cidade: 'Curitiba',
        funcao: 'LIMPEZA',
        dataVigencia: '2025-01-01',
        salarioPiso: 1900.00, // Servente 44h reference
        beneficios: { valeRefeicao: 25, valeTransporte: 12, cestaBasica: 150, uniforme: 40 },
        cargos: [
            { nome: 'Servente 44h', piso: 1900.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Servente 40h', piso: 1727.27, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Servente 36h', piso: 1554.55, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Copeira 44h', piso: 1961.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Servente c/ Acúmulo de Função', piso: 1900.00, gratificacao: 131.00, adicionalCopa: 0 },
            { nome: 'Copeira c/ Acúmulo de Função', piso: 1961.00, gratificacao: 70.00, adicionalCopa: 0 },
            { nome: 'Encarregada (3-10 func)', piso: 2191.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Encarregada (11-20 func)', piso: 2279.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Encarregada (>20 func)', piso: 2404.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Supervisor 44h', piso: 3023.00, gratificacao: 302.00, adicionalCopa: 0 },
            { nome: 'Varredor (até 200k hab)', piso: 1969.00, gratificacao: 648.40, adicionalCopa: 0 }, // Assuming Adic. is gratificacao
            { nome: 'Auxiliar de Serviços Gerais', piso: 1900.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Lavadores 44h', piso: 1900.00, gratificacao: 324.20, adicionalCopa: 0 }
        ],
        ...MOCK_DEFAULTS
    },
    {
        id: '4',
        uf: 'PR',
        cidade: 'Curitiba',
        funcao: 'PORTARIA',
        dataVigencia: '2025-01-01',
        salarioPiso: 2415.00, // Porteiro 44h ref
        beneficios: { valeRefeicao: 28, valeTransporte: 12, cestaBasica: 150, uniforme: 0 },
        cargos: [
            { nome: 'Porteiro 44h / 12x36', piso: 2415.00, gratificacao: 86.00, adicionalCopa: 0 },
            { nome: 'Porteiro SDF', piso: 1869.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Garagista 44h / 12x36', piso: 2141.00, gratificacao: 43.00, adicionalCopa: 0 },
            { nome: 'Controlador de Acesso 44h', piso: 2177.00, gratificacao: 43.00, adicionalCopa: 0 },
            { nome: 'Vigia / Guardião 44h', piso: 2141.00, gratificacao: 43.00, adicionalCopa: 0 }
        ],
        ...MOCK_DEFAULTS
    },
    {
        id: '6',
        uf: 'PR',
        cidade: 'Curitiba',
        funcao: 'JARDINAGEM',
        dataVigencia: '2025-01-01',
        salarioPiso: 2029.00,
        beneficios: { valeRefeicao: 25, valeTransporte: 12, cestaBasica: 150, uniforme: 30 },
        cargos: [
            { nome: 'Jardineiro 44h', piso: 2029.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Operador de Máquina Costal/Roçadeira', piso: 2404.00, gratificacao: 0, adicionalCopa: 0 },
            { nome: 'Poda de Árvores', piso: 2404.00, gratificacao: 0, adicionalCopa: 0 }
        ],
        ...MOCK_DEFAULTS
    },
    {
        id: '7',
        uf: 'PR',
        cidade: 'Curitiba',
        funcao: 'RECEPCAO',
        dataVigencia: '2025-01-01',
        salarioPiso: 2141.00,
        beneficios: { valeRefeicao: 25, valeTransporte: 12, cestaBasica: 150, uniforme: 50 },
        cargos: [
            { nome: 'Recepcionista 44h / 12x36', piso: 2141.00, gratificacao: 43.00, adicionalCopa: 0 },
            { nome: 'Ascensorista / Telefonista 36h', piso: 1998.00, gratificacao: 0, adicionalCopa: 0 }
        ],
        ...MOCK_DEFAULTS
    },
    {
        id: '8', // MANUTENCAO
        uf: 'PR',
        cidade: 'Curitiba',
        funcao: 'MANUTENCAO',
        dataVigencia: '2025-01-01',
        salarioPiso: 2141.00,
        beneficios: { valeRefeicao: 25, valeTransporte: 12, cestaBasica: 150, uniforme: 40 },
        cargos: [
            { nome: 'Bombeiro Hidráulico 44h', piso: 2141.00, gratificacao: 43.00, adicionalCopa: 0 },
            { nome: 'Auxiliar de Manutenção Predial', piso: 1900.00, gratificacao: 0, adicionalCopa: 0 }
        ],
        ...MOCK_DEFAULTS
    },

    // --- OTHER STATES (SÃO PAULO / SANTA CATARINA) ---
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
    },
    {
        id: '5',
        uf: 'SP',
        cidade: 'São Paulo',
        funcao: 'PORTARIA',
        dataVigencia: '2025-01-01',
        salarioPiso: 2100.00,
        beneficios: { valeRefeicao: 35, valeTransporte: 18, cestaBasica: 200, uniforme: 0 },
        cargos: [
            { nome: 'Porteiro Controlador', piso: 2100.00, gratificacao: 100, adicionalCopa: 0 },
            { nome: 'Vigia', piso: 2000.00, gratificacao: 0, adicionalCopa: 0 }
        ],
        ...MOCK_DEFAULTS
    }
];
