"use client";

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import * as gtag from '@/lib/gtag';

interface WhatsAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    tier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE" | null;
}

const WHATSAPP_NUMBER = "5541992252968";

const SEGMENTOS = [
    "Condomínio Residencial",
    "Condomínio Corporativo",
    "Indústria",
    "Hospital / Clínica",
    "Varejo / Shopping",
    "Escola / Educação",
    "Outro"
];

const SERVICOS_OPTIONS = [
    "Limpeza Profissional",
    "Portaria / Controle de Acesso",
    "Recepção",
    "Jardinagem",
    "Manutenção Predial",
    "Zeladoria"
];

const JANELAS = ["Manhã", "Tarde", "Noite", "A combinar"];
const CRITICIDADES = ["Baixa", "Média", "Alta", "Crítica"];

export default function WhatsAppModal({ isOpen, onClose, tier }: WhatsAppModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        segmento: "",
        servicos: [] as string[],
        postos_turnos: "",
        dor_principal: "",
        criticidade: "",
        areas_criticas: "",
        janela_horario: ""
    });

    if (!isOpen || !tier) return null;

    const toggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            servicos: prev.servicos.includes(service)
                ? prev.servicos.filter(s => s !== service)
                : [...prev.servicos, service]
        }));
    };

    const handleSend = () => {
        setLoading(true);

        // Defaults
        const segmento = formData.segmento || "(a definir)";
        const servicos = formData.servicos.length > 0 ? formData.servicos.join(", ") : "(a definir)";
        const postos = formData.postos_turnos || "(a definir)";
        const dor = formData.dor_principal || "(a definir)";
        const criticidade = formData.criticidade || "(a definir)";
        const areas = formData.areas_criticas || "(a definir)";
        const janela = formData.janela_horario || "(a definir)";

        let message = "";

        switch (tier) {
            case "BRONZE":
                message = `Olá! Tenho interesse no pacote BRONZE (Essencial Controlado) de Facilities.
Meu segmento: ${segmento}
Cidade/Região: Curitiba/RMC
Serviços de interesse: ${servicos}
Quantidade de postos/turnos: ${postos}
Quero um diagnóstico rápido e uma proposta com governança (checklists digitais + relatório mensal).
Pode me informar os próximos passos e quais dados vocês precisam para estimar o escopo?`;
                break;

            case "PRATA":
                message = `Olá! Tenho interesse no pacote PRATA (Estabilidade e Performance).
Segmento: ${segmento}
Cidade/Região: Curitiba/RMC
Serviços: ${servicos}
Postos/turnos: ${postos}
Principal dor hoje: ${dor}
Quero agendar um diagnóstico para melhorar padrão e previsibilidade (programado x realizado + conformidade).
Qual a disponibilidade para uma reunião rápida ainda esta semana?`;
                break;

            case "OURO":
                message = `Olá! Tenho interesse no pacote OURO (Governança Preditiva) — foco em prevenção antes da reclamação.
Segmento: ${segmento}
Curitiba/RMC
Serviços: ${servicos}
Postos/turnos: ${postos}
Criticidade do ambiente: ${criticidade}
Quero uma proposta com SLA, checklists digitais com evidências e relatório mensal automático.
Podemos agendar um diagnóstico técnico? Tenho disponibilidade em ${janela}.`;
                break;

            case "DIAMANTE":
                message = `Olá! Tenho interesse no pacote DIAMANTE (Operação Crítica).
Segmento: ${segmento}
Curitiba/RMC
Serviços: ${servicos}
Postos/turnos: ${postos}
Áreas críticas / riscos: ${areas}
Preciso de uma proposta com governança executiva, rastreabilidade máxima e cobertura de faltas (reposição até 2 horas).
Quem é o responsável técnico para agendarmos o kickoff de diagnóstico?`;
                break;

            default: // Caso "GERAL" ou qualquer outro não mapeado
                message = `Olá! Gostaria de falar com um especialista sobre Facilities.
Segmento: ${segmento}
Serviços: ${servicos}
Postos/turnos: ${postos}
Gostaria de um diagnóstico personalizado para minha operação.`;
                break;
        }

        const encodedMessage = encodeURIComponent(message);
        // Use api.whatsapp.com/send which is often more reliable for text pre-filling on web
        const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

        // Track event
        console.log("whatsapp_click", { tier, ...formData });
        gtag.reportConversion();

        window.open(url, '_blank');
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <span className="text-green-400"><Send size={18} /></span>
                        Configurar Mensagem WhatsApp
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                        <p className="text-sm text-gray-600">
                            Você escolheu o pacote <strong className="text-primary">{tier}</strong>.
                            Preencha os dados abaixo para agilizar seu atendimento.
                        </p>
                    </div>

                    {/* Common Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
                        <select
                            value={formData.segmento}
                            onChange={e => setFormData({ ...formData, segmento: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">Selecione...</option>
                            {SEGMENTOS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Serviços de Interesse</label>
                        <div className="grid grid-cols-2 gap-2">
                            {SERVICOS_OPTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggleService(s)}
                                    className={`text-xs p-2 rounded border transition-colors text-left
                                        ${formData.servicos.includes(s)
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postos / Turnos</label>
                        <input
                            type="text"
                            placeholder="Ex: 2 Porteiros 12x36, 1 Limpeza 44h"
                            value={formData.postos_turnos}
                            onChange={e => setFormData({ ...formData, postos_turnos: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    {/* Conditional Fields */}
                    {tier === "PRATA" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Principal Dor Hoje</label>
                            <input
                                type="text"
                                placeholder="Ex: Faltas constantes, falta de supervisão..."
                                value={formData.dor_principal}
                                onChange={e => setFormData({ ...formData, dor_principal: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    )}

                    {tier === "OURO" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Criticidade do Ambiente</label>
                                <select
                                    value={formData.criticidade}
                                    onChange={e => setFormData({ ...formData, criticidade: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="">Selecione...</option>
                                    {CRITICIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Melhor Horário (Reunião)</label>
                                <select
                                    value={formData.janela_horario}
                                    onChange={e => setFormData({ ...formData, janela_horario: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="">Selecione...</option>
                                    {JANELAS.map(j => <option key={j} value={j}>{j}</option>)}
                                </select>
                            </div>
                        </>
                    )}

                    {tier === "DIAMANTE" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Áreas Críticas / Riscos</label>
                            <input
                                type="text"
                                placeholder="Ex: UTI, Centro Cirúrgico, Controle de Acesso..."
                                value={formData.areas_criticas}
                                onChange={e => setFormData({ ...formData, areas_criticas: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-green-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                        {tier === 'BRONZE' ? 'Chamar no WhatsApp' : 'Agendar Diagnóstico'}
                    </button>
                </div>
            </div>
        </div>
    );
}
