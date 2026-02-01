"use client";

import { useSimulador } from '@/context/SimuladorContext';
import { RegraCCT, RegraCCT as RegraCCTType } from '@/types/simulador';
import { useState, useEffect } from 'react';
import { Plus, Trash, Edit, Save, X, Search } from 'lucide-react';

const emptyRegra: RegraCCTType = {
    id: '',
    uf: 'PR',
    cidade: '',
    funcao: 'LIMPEZA',
    dataVigencia: new Date().toISOString().split('T')[0],
    salarioPiso: 1590.00,
    beneficios: {
        valeRefeicao: 25.00,
        valeTransporte: 12.00,
        cestaBasica: 150.00,
        uniforme: 25.00
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
    adicionais: {
        insalubridade: false,
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

    // Sync from context on mount
    useEffect(() => {
        if (state.regrasCCT) {
            setRegras(state.regrasCCT);
        }
    }, [state.regrasCCT]);

    const handleSave = () => {
        const newRegras = [...regras];
        if (currentRegra.id) {
            // Edit
            const index = newRegras.findIndex(r => r.id === currentRegra.id);
            if (index >= 0) newRegras[index] = currentRegra;
        } else {
            // New
            newRegras.push({ ...currentRegra, id: `CCT-${Date.now()}` });
        }
        setRegras(newRegras);
        updateRegrasCCT(newRegras);
        setIsEditing(false);
        setCurrentRegra(emptyRegra);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta regra?')) {
            const newRegras = regras.filter(r => r.id !== id);
            setRegras(newRegras);
            updateRegrasCCT(newRegras);
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

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciador de Convenções Coletivas (CCT)</h2>
                <button
                    onClick={() => { setCurrentRegra(emptyRegra); setIsEditing(true); }}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nova Regra
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por Estado, Cidade ou Função..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </div>

            {/* List */}
            {!isEditing ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Local (UF/Cidade)</th>
                                <th className="p-4 font-semibold text-gray-600">Função</th>
                                <th className="p-4 font-semibold text-gray-600">Piso Salarial</th>
                                <th className="p-4 font-semibold text-gray-600">Vigência</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegras.map(regra => (
                                <tr key={regra.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-bold text-gray-800">{regra.uf}</span>
                                        <span className="text-gray-500 mx-2">-</span>
                                        {regra.cidade || '(Todas as Cidades)'}
                                    </td>
                                    <td className="p-4 badge"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">{regra.funcao}</span></td>
                                    <td className="p-4 font-mono text-gray-700">R$ {regra.salarioPiso.toFixed(2)}</td>
                                    <td className="p-4 text-sm text-gray-500">{new Date(regra.dataVigencia).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(regra)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(regra.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRegras.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">Nenhuma regra encontrada. Cadastre a primeira!</td>
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
                        </div>

                        {/* Benefícios */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm text-gray-500 uppercase">Benefícios (R$)</h4>
                            {Object.entries(currentRegra.beneficios).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input
                                        type="number"
                                        value={val}
                                        onChange={e => handleChange('beneficios', key, e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Alíquotas */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm text-gray-500 uppercase">Alíquotas (%)</h4>
                            {Object.entries(currentRegra.aliquotas).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={val}
                                        onChange={e => handleChange('aliquotas', key, e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancelar</button>
                        <button onClick={handleSave} className="px-8 py-2 bg-primary text-white rounded-lg hover:bg-green-600 font-bold flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            Salvar Regra
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
