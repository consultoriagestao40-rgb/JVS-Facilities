"use client";

import { useSimulador } from '@/context/SimuladorContext';
import { RegraCCT, RegraCCT as RegraCCTType } from '@/types/simulador';
import { useState, useEffect } from 'react';
import { Plus, Trash, Edit, Save, X, Search, FileText } from 'lucide-react';
import PlanilhaCustos from '@/components/common/PlanilhaCustos';
import { ItemResultado, BreakdownCustos } from '@/types/simulador';

const emptyRegra: RegraCCTType = {
    id: '',
    uf: 'PR',
    cidade: '',
    funcao: 'LIMPEZA',
    dataVigencia: new Date().toISOString().split('T')[0],
    salarioPiso: 1590.00,
    beneficios: {
        valeRefeicao: 25.00,
        tipoValeRefeicao: 'DIARIO',
        valeTransporte: 12.00,
        cestaBasica: 150.00,
        uniforme: 40.00,
        adicionalCopa: 120.00
    },
    configuracoesBeneficios: {
        descontoVT: 0.06,
        descontoVA: 0.20,
        vaSobreFerias: true
    },
    aliquotas: {
        inss: 0.20,
        fgts: 0.08,
        rat: 0.02,
        pis: 0.0165,
        cofins: 0.076,
        iss: 0.05,
        margemLucro: 0.15
    },
    custosOperacionais: {
        examesMedicos: 15.00,
        uniformeEpis: 30.00
    },
    adicionais: {
        insalubridade: false,
        grauInsalubridade: 0.20,
        baseInsalubridade: 'SALARIO_MINIMO',
        periculosidade: false
    },
    provisoes: {
        ferias: 0.1111, // 1/12 + 1/3
        decimoTerceiro: 0.0833, // 1/12
        rescisao: 0.05 // 5%
    }
};

export default function RegrasCCTManager() {
    const { state, updateRegrasCCT } = useSimulador();
    const [regras, setRegras] = useState<RegraCCTType[]>(state.regrasCCT || []);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRegra, setCurrentRegra] = useState<RegraCCTType>(emptyRegra);
    const [searchTerm, setSearchTerm] = useState('');
    const [previewItem, setPreviewItem] = useState<ItemResultado | null>(null);

    const handleSimulateExtract = () => {
        // Construct a mock ItemResultado based on current rule values
        const diasMes = 22; // Avg
        const piso = currentRegra.salarioPiso;
        const gratificacoes = currentRegra.gratificacoes || 0;

        // Beneficios
        const ben = currentRegra.beneficios;
        const configBen = currentRegra.configuracoesBeneficios || { descontoVT: 0.06, descontoVA: 0.20, vaSobreFerias: true };

        // Logica VR (Fixo vs Diario)
        let custoVR = 0;
        if (ben.tipoValeRefeicao === 'MENSAL') {
            custoVR = Number(ben.valeRefeicao);
        } else {
            custoVR = Number(ben.valeRefeicao) * diasMes;
        }

        const custoVT = Number(ben.valeTransporte) * diasMes;
        const cesta = Number(ben.cestaBasica);
        const uniforme = Number(ben.uniforme);

        // Descontos
        // VA Ferias
        const vaFerias = configBen.vaSobreFerias ? (custoVR / 12) : 0;

        // Descontos
        // VT 6% do Piso (não inclui gratificações legalmente, mas depende da CCT. Padrão é salário base)
        const descontoVT = Math.min(piso * configBen.descontoVT, custoVT);

        // Discount VA (Includes VA on Vacation)
        const descontoVA = (custoVR + vaFerias) * configBen.descontoVA;

        const copa = Number(ben.adicionalCopa || 0);
        const totalBen = (custoVR + custoVT + cesta + uniforme + vaFerias) - (descontoVT + descontoVA);

        const detailBen = {
            valeRefeicao: custoVR,
            valeTransporte: custoVT,
            cestaBasica: cesta,
            uniforme: uniforme,
            vaSobreFerias: vaFerias,
            // adicionalCopa: copa, // Removed from Benefits
            descontoVT: -descontoVT,
            descontoVA: -descontoVA,
            total: totalBen
        };

        // Encargos (INSS + FGTS + RAT)
        const encRate = currentRegra.aliquotas.inss + currentRegra.aliquotas.fgts + currentRegra.aliquotas.rat;
        // Encargos incidem sobre TOTAL REMUNERAÇÃO (Piso + Gratificacoes)
        const totalEnc = (piso + gratificacoes) * encRate;

        // Provisoes
        const prov = currentRegra.provisoes || { ferias: 0.1111, decimoTerceiro: 0.0833, rescisao: 0.05 };
        // Provisões também sobre Total Remuneração
        const totalProv = (piso + gratificacoes) * (Number(prov.ferias) + Number(prov.decimoTerceiro) + Number(prov.rescisao));

        const detailProv = {
            ferias: (piso + gratificacoes) * Number(prov.ferias),
            decimoTerceiro: (piso + gratificacoes) * Number(prov.decimoTerceiro),
            rescisao: (piso + gratificacoes) * Number(prov.rescisao),
            total: totalProv
        };

        const totalOperacional = piso + gratificacoes + totalBen + totalEnc + totalProv + copa;

        // Lucro
        const lucro = totalOperacional * currentRegra.aliquotas.margemLucro;

        // Impostos (Gross Up Approximation)
        const taxRate = currentRegra.aliquotas.pis + currentRegra.aliquotas.cofins + currentRegra.aliquotas.iss;

        // Simple approx for preview: T = Revenue * TaxRate. Revenue = Cost + Profit + Taxes.
        // Revenue = (Cost + Profit) / (1 - TaxRate)
        const baseCalculo = totalOperacional + lucro;
        const receitaBruta = baseCalculo / (1 - taxRate);
        const impostos = receitaBruta * taxRate;

        const totalMensal = receitaBruta;

        const mockItem: ItemResultado = {
            config: {
                funcao: currentRegra.funcao,
                quantidade: 1,
                horarioEntrada: '08:00',
                horarioSaida: '17:00',
                dias: ['Preview']
            },
            custoUnitario: totalMensal,
            custoTotal: totalMensal,
            detalhamento: {
                salarioBase: piso,
                gratificacoes: gratificacoes,
                adicionais: {
                    insalubridade: 0,
                    periculosidade: 0,
                    noturno: 0,
                    intrajornada: 0,
                    dsr: 0,
                    copa: copa, // Added here
                    total: copa // Copa is the only add-on in generic preview
                },
                beneficios: detailBen,
                encargos: totalEnc,
                provisoes: detailProv,
                custosOperacionais: {
                    examesMedicos: currentRegra.custosOperacionais?.examesMedicos || 0,
                    total: (currentRegra.custosOperacionais?.examesMedicos || 0) + (currentRegra.custosOperacionais?.uniformeEpis || 0)
                },
                insumos: 0,
                tributos: impostos,
                lucro: lucro,
                totalMensal: totalMensal
            }
        };

        setPreviewItem(mockItem);
    };

    // Sync from API on mount ONLY if Context is empty (Preserve Admin Changes)
    useEffect(() => {
        if (state.regrasCCT && state.regrasCCT.length > 0) {
            setRegras(state.regrasCCT);
            return;
        }

        async function loadRegras() {
            try {
                const res = await fetch('/api/simulador/regras', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setRegras(data);
                    // Init Context
                    updateRegrasCCT(data);
                }
            } catch (error) {
                console.error("Failed to load rules", error);
            }
        }
        loadRegras();
    }, [state.regrasCCT]); // Add dependency for safety

    const handleSave = async () => {
        try {
            const method = currentRegra.id ? 'PUT' : 'POST';
            const res = await fetch('/api/simulador/regras', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentRegra)
            });

            if (!res.ok) throw new Error('Failed to save rule');

            // Reload all rules to ensure sync with DB
            const updatedRulesRes = await fetch('/api/simulador/regras', { cache: 'no-store' });
            const updatedRules = await updatedRulesRes.json();

            setRegras(updatedRules);
            updateRegrasCCT(updatedRules);
            setIsEditing(false);
            setCurrentRegra(emptyRegra);
            alert('Regra salva com sucesso!');
        } catch (error) {
            console.error("Save Error:", error);
            alert('Erro ao salvar regra. Tente novamente.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta regra?')) {
            try {
                const res = await fetch('/api/simulador/regras', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });

                if (!res.ok) throw new Error('Failed to delete');

                const newRegras = regras.filter(r => r.id !== id);
                setRegras(newRegras);
                updateRegrasCCT(newRegras);
            } catch (error) {
                console.error("Delete Error:", error);
                alert('Erro ao excluir regra.');
            }
        }
    };

    const handleEdit = (regra: RegraCCTType) => {
        setCurrentRegra(regra);
        setIsEditing(true);
    };

    const handleChange = (section: keyof RegraCCTType | null, field: string, value: any) => {
        setCurrentRegra(prev => {
            // Helper to parse numbers if needed
            const parseValue = (val: any) => {
                const num = parseFloat(val);
                return isNaN(num) ? val : num;
            };

            if (!section) {
                // Determine if we should parse based on the current type or field name
                const originalValue = prev[field as keyof RegraCCTType];
                const cleanValue = typeof originalValue === 'number' ? parseFloat(value) || 0 : value;

                return { ...prev, [field]: cleanValue };
            }

            // Handle nested
            return {
                ...prev,
                [section]: {
                    ...(prev[section] as any),
                    [field]: parseFloat(value) || value
                }
            };
        });
    };

    const filteredRegras = regras.filter(r =>
        r.uf.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.funcao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calculateTotalCost = (regra: RegraCCTType) => {
        const piso = regra.salarioPiso;
        const gratificacoes = regra.gratificacoes || 0;

        const totalBen = Object.values(regra.beneficios)
            .filter((v): v is number => typeof v === 'number')
            .reduce((acc, val) => acc + val, 0);

        const encRate = regra.aliquotas.inss + regra.aliquotas.fgts + regra.aliquotas.rat;
        const totalEnc = (piso + gratificacoes) * encRate;

        const provRate = Object.values(regra.provisoes || {}).reduce((acc, val) => acc + Number(val), 0);
        const totalProv = (piso + gratificacoes) * provRate;

        // Custos Operacionais
        const ops = (regra.custosOperacionais?.examesMedicos || 0) + (regra.custosOperacionais?.uniformeEpis || 0);

        // Insalubridade (Estimativa Simples)
        let insalubridade = 0;
        if (regra.adicionais.insalubridade) {
            const base = regra.adicionais.baseInsalubridade === 'SALARIO_MINIMO' ? 1412 : piso;
            insalubridade = base * (regra.adicionais.grauInsalubridade || 0.20);
        }

        return piso + gratificacoes + insalubridade + totalBen + totalEnc + totalProv + ops;
    };

    const calculateEstimativePrice = (regra: RegraCCTType) => {
        const custoOperacional = calculateTotalCost(regra);
        const lucro = custoOperacional * regra.aliquotas.margemLucro;
        const taxRate = regra.aliquotas.pis + regra.aliquotas.cofins + regra.aliquotas.iss;

        // Gross Up: (Custeio + Lucro) / (1 - Impostos)
        const receitaBruta = (custoOperacional + lucro) / (1 - taxRate);
        return receitaBruta;
    };



    return (
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Gerenciador de Regras (CCT)
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">v2.1 (Atualizado)</span>
                </h2>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por Cidade ou Função..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setCurrentRegra(emptyRegra);
                            setIsEditing(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Regra
                    </button>
                </div>
            </div>

            {/* List */}
            {!isEditing ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Local (UF/Cidade)</th>
                                <th className="p-4 font-semibold text-gray-600">Função</th>
                                <th className="p-4 font-semibold text-gray-600">Cargo</th>
                                <th className="p-4 font-semibold text-gray-600">Piso (R$)</th>
                                <th className="p-4 font-semibold text-gray-600">Adicional (R$)</th>
                                <th className="p-4 font-semibold text-gray-600">Remun. Total (PDF)</th>
                                <th className="p-4 font-semibold text-gray-600">Preço Venda (Final)</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegras.flatMap(regra => {
                                // Helper to render a row
                                const renderRow = (
                                    key: string,
                                    cargoLabel: string,
                                    piso: number,
                                    gratificacao: number,
                                    isSubItem: boolean
                                ) => {
                                    // Calculate specifics for this row
                                    // We temporarily create a 'proxy' rule to calculate cost for this specific cargo
                                    const proxyRegra = {
                                        ...regra,
                                        salarioPiso: piso,
                                        gratificacoes: gratificacao
                                    };
                                    const custoTotal = calculateTotalCost(proxyRegra);
                                    const precoVenda = calculateEstimativePrice(proxyRegra);
                                    const totalRemuneracao = piso + gratificacao;

                                    return (
                                        <tr key={key} className={`border-b hover:bg-gray-50 transition-colors ${isSubItem ? 'bg-gray-50/50' : ''}`}>
                                            <td className="p-4">
                                                <span className="font-bold text-gray-800">{regra.uf}</span>
                                                <span className="text-gray-500 mx-2">-</span>
                                                {regra.cidade || '(Todas)'}
                                            </td>
                                            <td className="p-4 badge"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">{regra.funcao}</span></td>
                                            <td className="p-4 text-sm text-gray-700 font-medium">
                                                {cargoLabel}
                                            </td>
                                            <td className="p-4 font-mono text-gray-700">R$ {piso.toFixed(2)}</td>
                                            <td className="p-4 font-mono text-gray-700">R$ {gratificacao.toFixed(2)}</td>
                                            <td className="p-4 font-mono font-bold text-gray-900 bg-yellow-50 border-x border-yellow-100">R$ {totalRemuneracao.toFixed(2)}</td>
                                            <td className="p-4 font-mono font-bold text-green-700">R$ {precoVenda.toFixed(2)}</td>
                                            <td className="p-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(regra)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Editar Regra Completa"><Edit className="w-4 h-4" /></button>
                                                {!isSubItem && <button onClick={() => handleDelete(regra.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash className="w-4 h-4" /></button>}
                                            </td>
                                        </tr>
                                    );
                                };

                                // If the Rule has specific Cargos defined (Table from CCT)
                                if (regra.cargos && regra.cargos.length > 0) {
                                    return regra.cargos.map((c, idx) =>
                                        renderRow(
                                            `${regra.id}_${idx}`,
                                            c.nome,
                                            c.piso,
                                            c.gratificacao || 0,
                                            true
                                        )
                                    );
                                }

                                // Fallback for rules without specific cargos (Generic)
                                return [renderRow(regra.id, regra.cargo || 'Padrão (Genérico)', regra.salarioPiso, regra.gratificacoes || 0, false)];
                            })}

                            {filteredRegras.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400">Nenhuma regra encontrada. Cadastre a primeira!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Edit Form */
                <div className="bg-gray-50 p-6 rounded-xl border animate-fade-in">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="font-bold text-lg text-gray-700">{currentRegra.id ? 'Editar Regra' : 'Nova Regra de CCT'}</h3>
                        <button onClick={() => setIsEditing(false)}><X className="w-6 h-6 text-gray-400" /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm text-gray-500 uppercase">Localização & Função</h4>
                            <div>
                                <label className="block text-sm font-medium mb-1">Estado (UF)</label>
                                <select
                                    value={currentRegra.uf}
                                    onChange={e => handleChange(null, 'uf', e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="PR">Paraná (PR)</option>
                                    <option value="SP">São Paulo (SP)</option>
                                    <option value="SC">Santa Catarina (SC)</option>
                                    {/* Add others as needed */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cidade (Deixe em branco para Todo Estado)</label>
                                <input
                                    type="text"
                                    value={currentRegra.cidade}
                                    onChange={e => handleChange(null, 'cidade', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Ex: Curitiba"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Função</label>
                                <select
                                    value={currentRegra.funcao}
                                    onChange={e => handleChange(null, 'funcao', e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="LIMPEZA">Limpeza</option>
                                    <option value="PORTARIA">Portaria</option>
                                    <option value="RECEPCAO">Recepção</option>
                                    <option value="JARDINAGEM">Jardinagem</option>
                                    <option value="SEGURANCA">Segurança</option>
                                    <option value="MANUTENCAO">Manutenção</option>
                                    <option value="COZINHA">Cozinha</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Piso Salarial (R$)</label>
                                <input
                                    type="number"
                                    value={currentRegra.salarioPiso}
                                    onChange={e => handleChange(null, 'salarioPiso', e.target.value)}
                                    className="w-full p-2 border rounded font-bold text-green-700"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium mb-1">Piso Padrão (Fallback)</label>
                                <input
                                    type="number"
                                    value={currentRegra.salarioPiso}
                                    onChange={e => handleChange(null, 'salarioPiso', e.target.value)}
                                    className="w-full p-2 border rounded font-bold text-gray-600 bg-gray-50"
                                />
                            </div>

                            <hr className="border-gray-200" />
                            <h4 className="font-bold text-sm text-gray-500 uppercase">Custos Operacionais (Mensal)</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Exames Médicos</label>
                                    <input
                                        type="number"
                                        value={currentRegra.custosOperacionais?.examesMedicos || 0}
                                        onChange={e => handleChange('custosOperacionais', 'examesMedicos', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Uniformes/EPIs</label>
                                    <input
                                        type="number"
                                        value={currentRegra.custosOperacionais?.uniformeEpis || 0}
                                        onChange={e => handleChange('custosOperacionais', 'uniformeEpis', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-200" />
                            <h4 className="font-bold text-sm text-gray-500 uppercase">Adicionais</h4>
                            <div className="space-y-2 bg-yellow-50 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={currentRegra.adicionais.insalubridade}
                                        onChange={e => handleChange('adicionais', 'insalubridade', e.target.checked)}
                                        id="chkInsalubridade"
                                    />
                                    <label htmlFor="chkInsalubridade" className="font-medium">Insalubridade</label>
                                </div>

                                {currentRegra.adicionais.insalubridade && (
                                    <div className="ml-6 space-y-2">
                                        <div className="flex gap-2">
                                            <div className="w-1/2">
                                                <label className="text-xs block text-gray-600">Grau (%):</label>
                                                <select
                                                    value={currentRegra.adicionais.grauInsalubridade}
                                                    onChange={e => handleChange('adicionais', 'grauInsalubridade', Number(e.target.value))}
                                                    className="w-full p-1 border rounded text-sm"
                                                >
                                                    <option value={0.10}>10% (Mínimo)</option>
                                                    <option value={0.20}>20% (Médio)</option>
                                                    <option value={0.40}>40% (Máximo)</option>
                                                </select>
                                            </div>
                                            <div className="w-1/2">
                                                <label className="text-xs block text-gray-600">Base:</label>
                                                <select
                                                    value={currentRegra.adicionais.baseInsalubridade}
                                                    onChange={e => {
                                                        setCurrentRegra(prev => ({
                                                            ...prev,
                                                            adicionais: { ...prev.adicionais, baseInsalubridade: e.target.value as any }
                                                        }))
                                                    }}
                                                    className="w-full p-1 border rounded text-sm"
                                                >
                                                    <option value="SALARIO_MINIMO">Salário Mínimo</option>
                                                    <option value="SALARIO_BASE">Piso Salarial</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Benefícios e Provisões (Coluna do Meio) */}
                        <div className="space-y-6">
                            {/* Benefícios */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-gray-500 uppercase">Benefícios (R$)</h4>

                                {/* Vale Refeição Special Logic */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Vale Refeição / Alimentação</label>
                                    <div className="flex gap-2 mb-2">
                                        <select
                                            value={currentRegra.beneficios.tipoValeRefeicao}
                                            onChange={e => {
                                                setCurrentRegra(prev => ({
                                                    ...prev,
                                                    beneficios: { ...prev.beneficios, tipoValeRefeicao: e.target.value as any }
                                                }));
                                            }}
                                            className="p-2 border rounded text-sm bg-gray-50"
                                        >
                                            <option value="DIARIO">R$ / Dia</option>
                                            <option value="MENSAL">R$ / Mês (Fixo)</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={currentRegra.beneficios.valeRefeicao}
                                            onChange={e => handleChange('beneficios', 'valeRefeicao', e.target.value)}
                                            className="w-full p-2 border rounded"
                                            placeholder="Valor"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={currentRegra.configuracoesBeneficios?.vaSobreFerias ?? true}
                                            onChange={e => handleChange('configuracoesBeneficios', 'vaSobreFerias', e.target.checked)}
                                            id="vaFerias"
                                        />
                                        <label htmlFor="vaFerias" className="text-xs text-gray-600">Pagar s/ Férias (Provisionar)</label>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <label className="text-xs text-gray-600">Desc. no VA (%):</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={Number((currentRegra.configuracoesBeneficios?.descontoVA ?? 0.20) * 100).toFixed(2)}
                                            onChange={e => handleChange('configuracoesBeneficios', 'descontoVA', String(Number(e.target.value) / 100))}
                                            className="w-16 p-1 border rounded text-xs"
                                        />
                                    </div>
                                </div>

                                {/* Vale Transporte */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Vale Transporte (Diário)</label>
                                    <input
                                        type="number"
                                        value={currentRegra.beneficios.valeTransporte}
                                        onChange={e => handleChange('beneficios', 'valeTransporte', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        <label className="text-xs text-gray-600">Desc. Legal (% do Salário):</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={Number((currentRegra.configuracoesBeneficios?.descontoVT ?? 0.06) * 100).toFixed(2)}
                                            onChange={e => handleChange('configuracoesBeneficios', 'descontoVT', String(Number(e.target.value) / 100))}
                                            className="w-16 p-1 border rounded text-xs"
                                        />
                                    </div>
                                </div>

                                {/* Outros Beneficios */}
                                {Object.entries(currentRegra.beneficios).map(([key, val]) => {
                                    if (['valeRefeicao', 'tipoValeRefeicao', 'valeTransporte', 'adicionalCopa'].includes(key)) return null;
                                    return (
                                        <div key={key}>
                                            <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                            <input
                                                type="number"
                                                value={val}
                                                onChange={e => handleChange('beneficios', key, e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                    );
                                })}

                                {/* Adicional de Copa */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Adicional de Copa (Fixo/Mês)</label>
                                    <input
                                        type="number"
                                        value={currentRegra.beneficios.adicionalCopa || 0}
                                        onChange={e => handleChange('beneficios', 'adicionalCopa', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Valor fixo mensal (Ex: PR = 120,00)</p>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Provisões */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-gray-500 uppercase">Provisões (%)</h4>
                                {currentRegra.provisoes && Object.entries(currentRegra.provisoes).map(([key, val]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={Number((Number(val) * 100).toFixed(4))} // Display as % rounded
                                            onChange={e => handleChange('provisoes', key, String(Number(e.target.value) / 100))}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Alíquotas */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm text-gray-500 uppercase">Alíquotas (%)</h4>
                            {Object.entries(currentRegra.aliquotas).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={Number((Number(val) * 100).toFixed(4))} // Display as % rounded
                                        onChange={e => handleChange('aliquotas', key, String(Number(e.target.value) / 100))}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            ))}
                        </div>


                    </div>

                    {/* Cargos & Salários (Full Width Section) */}
                    <div className="mt-8 mb-8">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 p-1 rounded">📋</span>
                                Tabela de Cargos & Salários da Categoria
                            </h4>

                            <div className="bg-gray-50 p-4 rounded border border-gray-100 mb-4">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-[2]">
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Nome do Cargo</label>
                                        <input
                                            id="newCargoName"
                                            type="text"
                                            placeholder="Ex: Zelador Líder"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Piso Salarial (R$)</label>
                                        <input
                                            id="newCargoPiso"
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Gratificação (R$)</label>
                                        <input
                                            id="newCargoGratificacao"
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Adicional Copa (R$)</label>
                                        <input
                                            id="newCargoCopa"
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nameInput = document.getElementById('newCargoName') as HTMLInputElement;
                                            const pisoInput = document.getElementById('newCargoPiso') as HTMLInputElement;
                                            const gratInput = document.getElementById('newCargoGratificacao') as HTMLInputElement;
                                            const copaInput = document.getElementById('newCargoCopa') as HTMLInputElement;

                                            const nome = nameInput.value;
                                            const piso = parseFloat(pisoInput.value);
                                            const gratificacao = parseFloat(gratInput.value) || 0;
                                            const adicionalCopa = parseFloat(copaInput.value) || 0;

                                            if (nome && piso) {
                                                const newCargos = [...(currentRegra.cargos || []), { nome, piso, gratificacao, adicionalCopa }];
                                                setCurrentRegra(prev => ({ ...prev, cargos: newCargos }));
                                                nameInput.value = '';
                                                pisoInput.value = '';
                                                gratInput.value = '';
                                                copaInput.value = '';
                                            }
                                        }}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold shadow transition-all h-[50px] flex items-center"
                                    >
                                        ADICIONAR
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-hidden border rounded-lg shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                                        <tr>
                                            <th className="p-4 font-bold border-b">Cargo</th>
                                            <th className="p-4 font-bold border-b">Piso Salarial</th>
                                            <th className="p-4 font-bold border-b">Gratificação</th>
                                            <th className="p-4 font-bold border-b">Adc. Copa</th>
                                            <th className="p-4 font-bold border-b w-20 text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(currentRegra.cargos || []).length === 0 && (
                                            <tr><td colSpan={5} className="p-8 text-center text-gray-400 bg-white italic">Nenhum cargo específico cadastrado nesta categoria.</td></tr>
                                        )}
                                        {(currentRegra.cargos || []).map((c, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50 transition-colors bg-white">
                                                <td className="p-4 font-medium text-gray-800">{c.nome}</td>
                                                <td className="p-4 font-mono text-green-700 font-bold">R$ {c.piso.toFixed(2)}</td>
                                                <td className="p-4 font-mono text-gray-600">{c.gratificacao ? `R$ ${c.gratificacao.toFixed(2)}` : '-'}</td>
                                                <td className="p-4 font-mono text-gray-600">{c.adicionalCopa ? `R$ ${c.adicionalCopa.toFixed(2)}` : '-'}</td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => {
                                                            const newCargos = [...(currentRegra.cargos || [])];
                                                            newCargos.splice(idx, 1);
                                                            setCurrentRegra(prev => ({ ...prev, cargos: newCargos }));
                                                        }}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all"
                                                        title="Remover Cargo"
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 bg-yellow-50 p-2 rounded border border-yellow-100 inline-block">
                                ℹ️ Se o cliente selecionar um cargo que não esteja nesta lista, o sistema usará o <strong>Piso Padrão</strong> definido acima.
                            </p>
                        </div>
                    </div>

                    {/* Resumo/Totais */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-wrap gap-6 justify-between items-center text-sm text-blue-800">
                        <div>
                            <span className="block font-bold uppercase text-xs opacity-70">Total Benefícios</span>
                            <span className="text-lg font-bold">
                                R$ {Object.values(currentRegra.beneficios)
                                    .filter((v): v is number => typeof v === 'number')
                                    .reduce((acc, val) => acc + val, 0).toFixed(2)}
                            </span>
                        </div>
                        <div>
                            <span className="block font-bold uppercase text-xs opacity-70">Total Provisões</span>
                            <span className="text-lg font-bold">
                                {(Object.values(currentRegra.provisoes || {}).reduce((acc, val) => acc + Number(val), 0) * 100).toFixed(2)}%
                            </span>
                        </div>
                        <div>
                            <span className="block font-bold uppercase text-xs opacity-70">Custo Base Estimado (Colaborador)</span>
                            <span className="text-lg font-bold">
                                {/* Piso + Beneficios + Encargos (29.68%) + Provisões */}
                                R$ {(
                                    currentRegra.salarioPiso +
                                    Object.values(currentRegra.beneficios)
                                        .filter((v): v is number => typeof v === 'number')
                                        .reduce((acc, val) => acc + val, 0) +
                                    (currentRegra.salarioPiso * (currentRegra.aliquotas.inss + currentRegra.aliquotas.fgts + currentRegra.aliquotas.rat)) +
                                    (currentRegra.salarioPiso * Object.values(currentRegra.provisoes || {}).reduce((acc, val) => acc + Number(val), 0))
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                        <button
                            onClick={handleSimulateExtract}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-bold flex items-center gap-2"
                        >
                            <FileText className="w-5 h-5" />
                            Simular Extrato
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancelar</button>
                        <button onClick={handleSave} className="px-8 py-2 bg-primary text-white rounded-lg hover:bg-green-600 font-bold flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            Salvar Regra
                        </button>
                    </div>
                </div>
            )}
            {previewItem && <PlanilhaCustos item={previewItem} onClose={() => setPreviewItem(null)} />}
        </div>
    );
}
