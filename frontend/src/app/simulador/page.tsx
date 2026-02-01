"use client";

import { SimuladorProvider } from '@/context/SimuladorContext';
import SimuladorContainer from '@/components/simulador/SimuladorContainer';

import ErrorBoundary from '@/components/ErrorBoundary';

export default function SimuladorPage() {
    return (
        <ErrorBoundary>
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-heading font-bold mb-8 text-center text-gray-800">Simulador de Propostas</h1>

                <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
                    <SimuladorProvider>
                        <SimuladorContainer />
                    </SimuladorProvider>
                </div>
            </div>
        </ErrorBoundary>
    );
}
