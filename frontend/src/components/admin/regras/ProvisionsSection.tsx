"use client";

import { RegraCCT as RegraCCTType } from '@/types/simulador';

interface ProvisionsSectionProps {
    regra: RegraCCTType;
    onChange: (section: keyof RegraCCTType | null, field: string, value: any) => void;
}

export default function ProvisionsSection({ regra, onChange }: ProvisionsSectionProps) {
    return (
        <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase">Provisões (%)</h4>
            {regra.provisoes && Object.entries(regra.provisoes).map(([key, val]) => (
                <div key={key} className="bg-gray-50 p-2 rounded border border-gray-100">
                    <label className="block text-xs font-bold text-gray-500 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.0001"
                            value={Number((Number(val) * 100).toFixed(4))}
                            onChange={e => onChange('provisoes', key, String(Number(e.target.value) / 100))}
                            className="w-full p-2 pr-8 border rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                    </div>
                </div>
            ))}

            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100 text-center">
                <span className="text-xs font-bold text-blue-800 uppercase block mb-1">Total Provisões</span>
                <span className="text-xl font-black text-blue-900">
                    {(Object.values(regra.provisoes || {}).reduce((acc, val) => acc + Number(val), 0) * 100).toFixed(2)}%
                </span>
            </div>
        </div>
    );
}
