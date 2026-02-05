import { CheckCircle2, Shield, Gem, Star, Zap, Clock, UserCheck, FileCheck } from 'lucide-react';
import Link from 'next/link';

const GovernanceSection = () => {
    const plans = [
        {
            tier: "BRONZE",
            badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
            title: "Essencial controlado",
            target: "Operações simples e baixo risco.",
            bullets: [
                "Supervisor: visita quinzenal com checklist",
                "Gerente: visita mensal (preventiva)",
                "Relatório mensal: versão enxuta + plano de ação",
                "Compliance e padrão: uniforme, EPI e documentação"
            ],
            cta: "Simular meu cenário",
            href: "/simulador",
            highlight: false
        },
        {
            tier: "PRATA",
            badgeColor: "bg-gray-100 text-gray-800 border-gray-200",
            title: "Estabilidade e performance",
            target: "Operações com fluxo moderado e risco médio.",
            bullets: [
                "Supervisor: visita semanal ou quinzenal (criticidade)",
                "Gerente: contato/visita quinzenal com pauta e ata",
                "Relatório mensal completo: KPIs + plano de ação",
                "Auditoria de conformidade e correções rápidas"
            ],
            cta: "Falar com especialista",
            href: "https://wa.me/5541999999999",
            highlight: false
        },
        {
            tier: "OURO",
            subtitle: "Mais escolhido",
            badgeColor: "bg-yellow-50 text-yellow-800 border-yellow-200",
            title: "Governança preditiva",
            target: "Ambientes exigentes, auditáveis ou alto fluxo.",
            bullets: [
                "Supervisor: auditoria semanal e gestão de desvios",
                "Gerente: visita mensal + contato quinzenal preditivo",
                "Relatório mensal automático: página executiva + evidências",
                "Acompanhamento antes da reclamação do cliente"
            ],
            cta: "Agendar diagnóstico",
            href: "https://wa.me/5541999999999",
            highlight: true,
            highlightText: "Mais escolhido",
            borderColor: "border-yellow-400 ring-1 ring-yellow-400"
        },
        {
            tier: "DIAMANTE",
            subtitle: "Operação crítica",
            badgeColor: "bg-blue-50 text-blue-900 border-blue-200",
            title: "Continuidade operacional",
            target: "Hospitais, áreas críticas e risco elevado.",
            bullets: [
                "Supervisor: semanal (ou mais, por criticidade)",
                "Gerente: visita quinzenal + canal prioritário",
                "Diretor: visita mensal (relacionamento e governança)",
                "Evidência e rastreabilidade máxima (programado x realizado)"
            ],
            cta: "Atendimento prioritário",
            href: "https://wa.me/5541999999999",
            highlight: true,
            highlightText: "Máxima criticidade",
            borderColor: "border-blue-500 ring-1 ring-blue-500"
        }
    ];

    const standards = [
        "Primeiro atendimento (retorno): até 1 hora útil",
        "Reposição de posto (cobertura de faltas): até 2 horas",
        "SLA de conformidade operacional: ≥ 80%",
        "Conformidade de checklist (programado x realizado): ≥ 85%",
        "Gestão com ponto focal: gerente como canal prioritário"
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">

                {/* Section 1: Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                        Escolha o nível de governança ideal para sua operação
                    </h2>
                    <h3 className="text-xl text-gray-600 mb-6">
                        Você não contrata apenas mão de obra: contrata método, rastreabilidade e gestão preditiva. <br className="hidden md:block" />
                        O nível de governança varia conforme a criticidade do ambiente.
                    </h3>
                    <p className="text-sm text-gray-500 font-medium bg-gray-50 inline-block px-4 py-2 rounded-full border border-gray-100">
                        Recomendado para: Hospitais, Indústrias, Varejo e Condomínios Corporativos em Curitiba e Região Metropolitana.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 items-start">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl p-6 transition-all duration-300 flex flex-col h-full
                                ${plan.highlight ? `shadow-xl scale-105 z-10 ${plan.borderColor}` : 'border border-gray-200 shadow-sm hover:shadow-md'}
                            `}
                        >
                            {plan.highlight && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold text-white rounded-full uppercase tracking-wider shadow-sm
                                    ${plan.tier === 'OURO' ? 'bg-yellow-500' : 'bg-blue-600'}
                                `}>
                                    {plan.highlightText}
                                </div>
                            )}

                            <div className={`text-xs font-bold px-2 py-1 rounded w-fit mb-4 border ${plan.badgeColor}`}>
                                {plan.tier}
                            </div>

                            <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                {plan.title}
                            </h4>

                            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                                <span className="font-semibold text-gray-700">Indicado para:</span> {plan.target}
                            </p>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                {plan.href.startsWith('/') ? (
                                    <Link
                                        href={plan.href}
                                        className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-colors
                                            ${plan.highlight
                                                ? 'bg-primary hover:bg-green-600 text-white shadow-lg shadow-green-100'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }
                                        `}
                                    >
                                        {plan.cta}
                                    </Link>
                                ) : (
                                    <a
                                        href={plan.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-colors
                                            ${plan.highlight
                                                ? 'bg-primary hover:bg-green-600 text-white shadow-lg shadow-green-100'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }
                                        `}
                                    >
                                        {plan.cta}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section 2: Minimum Standards */}
                <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Padrões mínimos garantidos (mensuráveis e reportados)
                            </h3>
                            <p className="text-gray-600">
                                Tudo que prometemos é acompanhado por checklist digital, evidências e relatório mensal.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {standards.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-gray-800 font-medium text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-xs text-gray-400 mb-8">
                            Obs.: Atendimento = retorno inicial. Resolução varia por tipo de ocorrência e escopo.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <Link
                                href="/simulador"
                                className="bg-primary hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-1 w-full md:w-auto text-center"
                            >
                                Simular minha operação agora
                            </Link>
                            <a
                                href="https://wa.me/5541999999999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white hover:bg-gray-100 text-gray-700 font-bold text-lg px-8 py-4 rounded-xl border border-gray-200 transition-colors w-full md:w-auto text-center flex items-center justify-center gap-2"
                            >
                                <span>Chamar no WhatsApp</span>
                            </a>
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Diagnóstico rápido e proposta com governança por criticidade.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default GovernanceSection;
