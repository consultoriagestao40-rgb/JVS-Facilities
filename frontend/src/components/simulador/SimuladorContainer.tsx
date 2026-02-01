"use client";

import { useSimulador } from '@/context/SimuladorContext';
import CadastroInicial from '@/components/forms/CadastroInicial';
import SelecaoServicos from '@/components/forms/SelecaoServicos';
import ConfiguracaoServicos from '@/components/forms/ConfiguracaoServicos';
import ComposicaoCustos from '@/components/forms/ComposicaoCustos';
import ResumoProposta from '@/components/simulador/ResumoProposta';

export default function SimuladorContainer() {
    const { state } = useSimulador();

    const renderStep = () => {
        switch (state.step) {
            case 1:
                return <CadastroInicial />;
            case 2:
                return <SelecaoServicos />;
            case 3:
                return <ConfiguracaoServicos />;
            case 4:
                return <ComposicaoCustos />;
            case 5:
                return <ResumoProposta />;
            default:
                return <CadastroInicial />;
        }
    };

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(state.step / 5) * 100}%` }}
                ></div>
            </div>

            {/* Step Indicator */}
            <div className="flex justify-between mb-8 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className={state.step >= 1 ? "text-primary" : ""}>1. Dados</span>
                <span className={state.step >= 2 ? "text-primary" : ""}>2. Serviços</span>
                <span className={state.step >= 3 ? "text-primary" : ""}>3. Configuração</span>
                <span className={state.step >= 4 ? "text-primary" : ""}>4. Custos</span>
                <span className={state.step >= 5 ? "text-primary" : ""}>5. Proposta</span>
            </div>

            {renderStep()}
        </div>
    );
}
