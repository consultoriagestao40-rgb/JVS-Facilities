"use client";

import React from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <h2 className="text-xl font-bold mb-2">Algo deu errado na renderização!</h2>
                    <pre className="bg-white p-4 rounded border text-sm overflow-auto">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        onClick={() => {
                            sessionStorage.clear();
                            window.location.reload();
                        }}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Limpar Memória e Recarregar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
