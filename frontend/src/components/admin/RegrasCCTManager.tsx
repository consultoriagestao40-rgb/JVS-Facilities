"use client";

import { useSimulador } from '@/context/SimuladorContext';
import { RegraCCT as RegraCCTType, ItemResultado } from '@/types/simulador';
import { useState, useEffect } from 'react';
import PlanilhaCustos from '@/components/common/PlanilhaCustos';

// Sub-components
import RuleHeader from './regras/RuleHeader';
import RuleTable from './regras/RuleTable';
import RuleForm from './regras/RuleForm';

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
        ferias: 0.1111,
        decimoTerceiro: 0.0833,
        rescisao: 0.05
    }
};

export default function RegrasCCTManager() {
    const { state, updateRegrasCCT } = useSimulador();
    const [regras, setRegras] = useState<RegraCCTType[]>(state.regrasCCT || []);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRegra, setCurrentRegra] = useState<RegraCCTType>(emptyRegra);
    const [searchTerm, setSearchTerm] = useState('');
    const [previewItem, setPreviewItem] = useState<ItemResultado | null>(null);

    // Initial Load
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
                    updateRegrasCCT(data);
                }
            } catch (error) {
                console.error("Failed to load rules", error);
            }
        }
        loadRegras();
    }, [state.regrasCCT]);

    const handleSave = async () => {
        try {
            const method = currentRegra.id ? 'PUT' : 'POST';
            const res = await fetch('/api/simulador/regras', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentRegra)
            });

            if (!res.ok) throw new Error('Failed to save rule');

            const updatedRulesRes = await fetch('/api/simulador/regras', { cache: 'no-store' });
            const updatedRules = await updatedRulesRes.json();

            setRegras(updatedRules);
            updateRegrasCCT(updatedRules);
            setIsEditing(false);
            setCurrentRegra(emptyRegra);
            alert('Regra salva com sucesso!');
        } catch (error) {
            console.error("Save Error:", error);
            alert('Erro ao salvar regra.');
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

    const handleChange = (section: keyof RegraCCTType | null, field: string, value: any) => {
        setCurrentRegra(prev => {
            if (!section) {
                const originalValue = prev[field as keyof RegraCCTType];
                const cleanValue = typeof originalValue === 'number' ? parseFloat(value) || 0 : value;
                return { ...prev, [field]: cleanValue };
            }
            return {
                ...prev,
                [section]: {
                    ...(prev[section] as any),
                    [field]: typeof (prev[section] as any)[field] === 'number' ? parseFloat(value) || 0 : value
                }
            };
        });
    };

    // Calculation Logic for Previews
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

        const ops = (regra.custosOperacionais?.examesMedicos || 0) + (regra.custosOperacionais?.uniformeEpis || 0);

        let insalubridade = 0;
        if (regra.adicionais.insalubridade) {
            const base = regra.adicionais.baseInsalubridade === 'SALARIO_MINIMO' ? 1412 : piso;
            insalubridade = base * (regra.adicionais.grauInsalubridade || 0.20);
        }

        const periculosidade = regra.adicionais.periculosidade ? (piso * 0.30) : 0;
        const copa = regra.beneficios.adicionalCopa || 0;

        return piso + gratificacoes + insalubridade + periculosidade + totalBen + totalEnc + totalProv + ops + copa;
    };

    const calculateEstimativePrice = (regra: RegraCCTType) => {
        const custoOperacional = calculateTotalCost(regra);
        const lucro = custoOperacional * regra.aliquotas.margemLucro;
        const taxRate = regra.aliquotas.pis + regra.aliquotas.cofins + regra.aliquotas.iss;
        return (custoOperacional + lucro) / (1 - taxRate);
    };

    const handleSimulateExtract = () => {
        const piso = currentRegra.salarioPiso;
        const gratificacoes = currentRegra.gratificacoes || 0;
        const ben = currentRegra.beneficios;
        const configBen = currentRegra.configuracoesBeneficios || { descontoVT: 0.06, descontoVA: 0.20, vaSobreFerias: true };
        const diasMes = 22;

        let custoVR = ben.tipoValeRefeicao === 'MENSAL' ? Number(ben.valeRefeicao) : Number(ben.valeRefeicao) * diasMes;
        const custoVT = Number(ben.valeTransporte) * diasMes;
        const vaFerias = configBen.vaSobreFerias ? (custoVR / 12) : 0;
        const descontoVT = Math.min(piso * configBen.descontoVT, custoVT);
        const descontoVA = (custoVR + vaFerias) * configBen.descontoVA;
        const copa = Number(ben.adicionalCopa || 0);

        const totalBen = (custoVR + custoVT + (ben.cestaBasica || 0) + (ben.uniforme || 0) + vaFerias) - (descontoVT + descontoVA);

        const encRate = currentRegra.aliquotas.inss + currentRegra.aliquotas.fgts + currentRegra.aliquotas.rat;
        const totalEnc = (piso + gratificacoes) * encRate;

        const prov = currentRegra.provisoes || { ferias: 0.1111, decimoTerceiro: 0.0833, rescisao: 0.05 };
        const totalProv = (piso + gratificacoes) * (Number(prov.ferias) + Number(prov.decimoTerceiro) + Number(prov.rescisao));

        const insalubridade = currentRegra.adicionais.insalubridade
            ? (currentRegra.adicionais.baseInsalubridade === 'SALARIO_MINIMO' ? 1412 : piso) * (currentRegra.adicionais.grauInsalubridade || 0.2)
            : 0;
        const periculosidade = currentRegra.adicionais.periculosidade ? (piso * 0.3) : 0;

        const totalOperacional = piso + gratificacoes + insalubridade + periculosidade + totalBen + totalEnc + totalProv + (currentRegra.custosOperacionais?.examesMedicos || 0) + (currentRegra.custosOperacionais?.uniformeEpis || 0) + copa;
        const lucro = totalOperacional * currentRegra.aliquotas.margemLucro;
        const taxRate = currentRegra.aliquotas.pis + currentRegra.aliquotas.cofins + currentRegra.aliquotas.iss;
        const totalMensal = (totalOperacional + lucro) / (1 - taxRate);

        const mockItem: ItemResultado = {
            config: { funcao: currentRegra.funcao, quantidade: 1, dias: ['Simulação'] },
            custoUnitario: totalMensal,
            custoTotal: totalMensal,
            detalhamento: {
                salarioBase: piso,
                gratificacoes: gratificacoes,
                adicionais: {
                    insalubridade,
                    periculosidade,
                    noturno: 0,
                    intrajornada: 0,
                    dsr: 0,
                    copa,
                    total: insalubridade + periculosidade + copa
                },
                beneficios: {
                    valeRefeicao: custoVR,
                    valeTransporte: custoVT,
                    cestaBasica: ben.cestaBasica || 0,
                    uniforme: ben.uniforme || 0,
                    vaSobreFerias: vaFerias,
                    descontoVT: -descontoVT,
                    descontoVA: -descontoVA,
                    total: totalBen
                },
                encargos: totalEnc,
                provisoes: {
                    ferias: (piso + gratificacoes) * Number(prov.ferias),
                    decimoTerceiro: (piso + gratificacoes) * Number(prov.decimoTerceiro),
                    rescisao: (piso + gratificacoes) * Number(prov.rescisao),
                    total: totalProv
                },
                custosOperacionais: {
                    examesMedicos: currentRegra.custosOperacionais?.examesMedicos || 0,
                    total: (currentRegra.custosOperacionais?.examesMedicos || 0) + (currentRegra.custosOperacionais?.uniformeEpis || 0)
                },
                insumos: 0,
                tributos: totalMensal - (totalOperacional + lucro),
                lucro: lucro,
                totalMensal: totalMensal
            }
        };

        setPreviewItem(mockItem);
    };

    const filteredRegras = regras.filter(r =>
        r.uf.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.funcao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[700px]">
            <div className="p-8">
                <RuleHeader
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onAddNew={() => {
                        setCurrentRegra(emptyRegra);
                        setIsEditing(true);
                    }}
                />

                {!isEditing ? (
                    <RuleTable
                        regras={filteredRegras}
                        onEdit={(regra) => {
                            setCurrentRegra(regra);
                            setIsEditing(true);
                        }}
                        onDelete={handleDelete}
                        calculateTotalCost={calculateTotalCost}
                        calculateEstimativePrice={calculateEstimativePrice}
                    />
                ) : (
                    <RuleForm
                        regra={currentRegra}
                        setRegra={setCurrentRegra}
                        onChange={handleChange}
                        onCancel={() => setIsEditing(false)}
                        onSave={handleSave}
                        onSimulate={handleSimulateExtract}
                    />
                )}
            </div>
            {previewItem && <PlanilhaCustos item={previewItem} onClose={() => setPreviewItem(null)} />}
        </div>
    );
}
