"use client";

import { RegraCCT as RegraCCTType, ItemResultado } from '@/types/simulador';
import { X, Save, FileText } from 'lucide-react';
import BasicInfoSection from './BasicInfoSection';
import BenefitsSection from './BenefitsSection';
import ProvisionsSection from './ProvisionsSection';
import TaxesSection from './TaxesSection';
import CargoTableSection from './CargoTableSection';

interface RuleFormProps {
    regra: RegraCCTType;
    setRegra: React.Dispatch<React.SetStateAction<RegraCCTType>>;
    onCancel: () => void;
    onSave: () => void;
    onSimulate: () => void;
    onChange: (section: keyof RegraCCTType | null, field: string, value: any) => void;
}

export default function RuleForm({
    regra,
    setRegra,
    onCancel,
    onSave,
    onSimulate,
    onChange
}: RuleFormProps) {
    return (
        <div className="bg-gray-50 p-6 rounded-xl border animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="font-bold text-lg text-gray-700">
                    {regra.id ? 'Editar Regra' : 'Nova Regra de CCT'}
                </h3>
                <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Column 1: Basic Info */}
                <BasicInfoSection regra={regra} onChange={onChange} />

                {/* Column 2: Benefits */}
                <BenefitsSection regra={regra} onChange={onChange} />

                {/* Column 3: Provisions & Taxes */}
                <div className="space-y-8">
                    <ProvisionsSection regra={regra} onChange={onChange} />
                    <TaxesSection regra={regra} onChange={onChange} />
                </div>
            </div>

            {/* Full Width: Cargo Table */}
            <CargoTableSection regra={regra} setRegra={setRegra} />

            {/* Summary & Actions */}
            <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t pt-8">
                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg flex gap-8 items-center">
                    <div className="text-center">
                        <span className="block text-[10px] uppercase font-bold opacity-80 mb-1">Custo Base p/ Colab.</span>
                        <span className="text-xl font-black">
                            R$ {(
                                regra.salarioPiso +
                                Object.values(regra.beneficios)
                                    .filter((v): v is number => typeof v === 'number')
                                    .reduce((acc, val) => acc + val, 0) +
                                (regra.salarioPiso * (regra.aliquotas.inss + regra.aliquotas.fgts + regra.aliquotas.rat)) +
                                (regra.salarioPiso * Object.values(regra.provisoes || {}).reduce((acc, val) => acc + Number(val), 0))
                            ).toFixed(2)}
                        </span>
                    </div>
                    <div className="w-px h-10 bg-white/20"></div>
                    <div className="text-center">
                        <span className="block text-[10px] uppercase font-bold opacity-80 mb-1">Margem</span>
                        <span className="text-xl font-black">{(regra.aliquotas.margemLucro * 100).toFixed(1)}%</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onSimulate}
                        className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 font-bold flex items-center gap-2 transition-all"
                    >
                        <FileText className="w-5 h-5" />
                        Simular Extrato
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 text-gray-500 hover:text-gray-800 font-bold transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        className="px-10 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-black shadow-lg hover:shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-1"
                    >
                        <Save className="w-5 h-5" />
                        SALVAR REGRA
                    </button>
                </div>
            </div>
        </div>
    );
}
