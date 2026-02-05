"use client";

import { useState, useEffect } from 'react';

export default function DebugPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkHealth();
    }, []);

    const checkHealth = async () => {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            setStatus(data);
        } catch (error) {
            setStatus({ error: String(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 font-mono">
            <h1 className="text-2xl font-bold mb-4">Diagnostic Tool</h1>

            {loading ? (
                <div>Testing connection...</div>
            ) : (
                <div className="space-y-4">
                    <div className={`p-4 border rounded ${status?.database === 'Connected' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
                        <h2 className="font-bold">Database Status</h2>
                        <p>{status?.database || 'Unknown'}</p>
                    </div>

                    <div className="p-4 bg-gray-100 border rounded">
                        <h2 className="font-bold">Environment Variables</h2>
                        <ul className="list-disc pl-5">
                            <li>
                                <strong>DATABASE_URL:</strong> {status?.env?.DATABASE_URL ? '✅ Present' : '❌ MISSING'}
                            </li>
                            <li>
                                <strong>NODE_ENV:</strong> {status?.env?.NODE_ENV}
                            </li>
                        </ul>
                    </div>

                    <div className="p-4 bg-gray-50 border rounded text-xs">
                        <pre>{JSON.stringify(status, null, 2)}</pre>
                    </div>

                    <button
                        onClick={checkHealth}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry Connection
                    </button>
                </div>
            )}
        </div>
    );
}
