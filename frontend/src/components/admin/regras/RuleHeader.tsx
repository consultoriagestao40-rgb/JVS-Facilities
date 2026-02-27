"use client";

import { Plus, Search } from 'lucide-react';

interface RuleHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onAddNew: () => void;
}

export default function RuleHeader({ searchTerm, onSearchChange, onAddNew }: RuleHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Gerenciador de Regras (CCT)
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">
                    v2.2 (Refatorado)
                </span>
            </h2>
            <div className="flex gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por Cidade ou Função..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <button
                    onClick={onAddNew}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Nova Regra
                </button>
            </div>
        </div>
    );
}
