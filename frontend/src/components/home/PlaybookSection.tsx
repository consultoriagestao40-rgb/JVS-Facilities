import { CheckCircle2, ClipboardList, Clock, ShieldCheck, HardHat, FileText } from 'lucide-react';

const PlaybookSection = () => {
    const cards = [
        {
            icon: <Clock className="w-8 h-8 text-primary" />,
            title: "PIC: Implantação Premium em 30 dias",
            bullets: [
                "Kickoff executivo e alinhamento de expectativas",
                "Auditoria intensiva na semana 1",
                "Termo de aceite e plano de melhoria contínua"
            ]
        },
        {
            icon: <ClipboardList className="w-8 h-8 text-primary" />,
            title: "Checklists digitais (programado x realizado)",
            bullets: [
                "Rotinas por área, turno e criticidade",
                "Evidências: foto, horário e responsável",
                "Auditoria de conformidade e não conformidades"
            ]
        },
        {
            icon: <FileText className="w-8 h-8 text-primary" />,
            title: "SLA + relatório mensal automático",
            bullets: [
                "KPIs de qualidade, pessoas e atendimento",
                "Plano de ação com prazos e responsáveis",
                "Leitura executiva: 1 minuto (visão gerencial)"
            ]
        },
        {
            icon: <Clock className="w-8 h-8 text-primary" />, // Or another icon for attendance?
            title: "Ponto online + cobertura preditiva de faltas",
            bullets: [
                "Controle de presença e escalas em tempo real",
                "Banco de cobertura e acionamento rápido",
                "Redução de riscos operacionais por absenteísmo"
            ]
        },
        {
            icon: <HardHat className="w-8 h-8 text-primary" />,
            title: "Uniformes, EPIs e compliance",
            bullets: [
                "Padrão visual e postura profissional",
                "Controle de entrega e reposição de EPIs",
                "Documentação legal e rastreabilidade contratual"
            ]
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: "Governança com visitas executivas",
            bullets: [
                "Supervisor: checklist semanal ou quinzenal",
                "Gerente: visita preventiva mensal/quinzenal",
                "Diretor: relacionamento por categoria de cliente"
            ]
        }
    ];

    return (
        <section id="playbook" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                        Como garantimos um padrão acima do mercado
                    </h2>
                    <p className="text-lg text-gray-600">
                        Método operacional com gestão preditiva, rastreabilidade digital e governança executiva — do programado ao realizado.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {cards.map((card, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
                            <div className="mb-6 p-4 bg-green-50 rounded-xl w-fit">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 h-14 flex items-center">
                                {card.title}
                            </h3>
                            <ul className="space-y-3 flex-1">
                                {card.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                        <div className="mt-1.5 min-w-[6px] min-h-[6px] rounded-full bg-primary" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Microprova */}
                <div className="text-center mb-16">
                    <p className="text-xl md:text-2xl font-medium text-gray-800 italic">
                        "Facilities premium não é promessa: é método, governança e evidência de execução."
                    </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <a
                        href="/simulador"
                        className="w-full md:w-auto bg-primary hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-1 text-center"
                    >
                        Simular minha operação agora
                    </a>
                    <a
                        href="https://wa.me/5541999999999" // Replace with actual number if known, otherwise placeholder
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto bg-white hover:bg-gray-50 text-gray-700 font-bold text-lg px-8 py-4 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Falar com um especialista</span>
                    </a>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Atendemos Curitiba e Região Metropolitana.
                </p>
            </div>
        </section>
    );
};

export default PlaybookSection;
