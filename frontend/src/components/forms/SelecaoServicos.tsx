"use client";

import { useSimulador } from '@/context/SimuladorContext';
import { ServicoTipo } from '@/types/simulador';
import { Briefcase, Shield, User, Building, Wrench, Flower2, ChefHat } from 'lucide-react'; // Example icons
import clsx from 'clsx';

const SERVICES: { id: ServicoTipo; label: string; icon: any }[] = [
    { id: 'LIMPEZA', label: 'Limpeza e Conservação', icon: Building },
    { id: 'PORTARIA', label: 'Portaria e Controle', icon: User },
    { id: 'RECEPCAO', label: 'Recepção', icon: Briefcase },
    { id: 'SEGURANCA', label: 'Segurança Patrimonial', icon: Shield },
    { id: 'MANUTENCAO', label: 'Manutenção Predial', icon: Wrench },
    { id: 'JARDINAGEM', label: 'Jardinagem', icon: Flower2 },
    { id: 'COZINHA', label: 'Cozinha', icon: ChefHat },
];

export default function SelecaoServicos() {
    const { state, toggleServico, nextStep, prevStep } = useSimulador();

    const isSelected = (id: ServicoTipo) => state.servicosSelecionados.includes(id);
    const canProceed = state.servicosSelecionados.length > 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">Selecione os serviços que você precisa</h2>
                <p className="text-gray-500">Você pode selecionar múltiplos serviços.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SERVICES.map((service) => {
                    const Icon = service.icon;
                    const selected = isSelected(service.id);
                    return (
                        <div
                            key={service.id}
                            onClick={() => toggleServico(service.id)}
                            className={clsx(
                                "cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center justify-center gap-4 transition-all duration-200 hover:shadow-md",
                                selected
                                    ? "border-primary bg-green-50 text-primary"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-green-200"
                            )}
                        >
                            <Icon size={40} strokeWidth={1.5} />
                            <span className="font-medium text-center">{service.label}</span>
                            {selected && (
                                <div className="absolute top-2 right-2 text-primary">
                                    {/* Checkmark icon could go here */}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <button
                    onClick={prevStep}
                    className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2"
                >
                    &larr; Voltar
                </button>
                <button
                    onClick={nextStep}
                    disabled={!canProceed}
                    className={clsx(
                        "font-bold py-3 px-8 rounded-lg shadow transition-colors",
                        canProceed
                            ? "bg-primary hover:bg-green-600 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                >
                    Configurar Serviços &rarr;
                </button>
            </div>
        </div>
    );
}
