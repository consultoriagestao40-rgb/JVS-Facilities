import Benefits from '@/components/home/Benefits';
import Services from '@/components/home/Services';
import SocialProof from '@/components/home/SocialProof';
import PlaybookSection from '@/components/home/PlaybookSection';
import GovernanceSection from '@/components/home/GovernanceSection';
import StatsSection from '@/components/home/StatsSection';
import TechFeatureSection from '@/components/home/TechFeatureSection';
import RiskMitigationSection from '@/components/home/RiskMitigationSection';
import ComparisonTable from '@/components/home/ComparisonTable';
import WhatsAppFloat from '@/components/common/WhatsAppFloat';
import { SimuladorProvider } from '@/context/SimuladorContext';
import SimuladorContainer from '@/components/simulador/SimuladorContainer';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function HomeSimulador() {
    return (
        <main className="flex min-h-screen flex-col">
            {/* Hero com o Simulador no topo */}
            <section className="relative bg-gradient-hero text-white overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-jvs-gold/10 rounded-full blur-[110px] pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-jvs-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-jvs-gold font-bold tracking-wider text-sm uppercase mb-3 block">
                            Simulador de Propostas
                        </span>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-4 leading-[1.1]">
                            Monte sua proposta de facilities em{' '}
                            <span className="text-jvs-gold">5 minutos</span>
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Configure os serviços, postos e turnos e receba uma estimativa transparente,
                            com governança por criticidade — do programado ao realizado.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border border-white/10">
                        <ErrorBoundary>
                            <SimuladorProvider>
                                <SimuladorContainer />
                            </SimuladorProvider>
                        </ErrorBoundary>
                    </div>
                </div>
            </section>

            <StatsSection />
            <PlaybookSection />
            <TechFeatureSection />
            <GovernanceSection />
            <RiskMitigationSection />
            <Benefits />
            <Services />
            <ComparisonTable />
            <SocialProof />

            {/* CTA Final */}
            <section className="py-20 md:py-28 bg-jvs-bg-alt">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl text-white px-8 py-16 md:py-20 text-center shadow-2xl">
                        <img
                            src="/images/home/cta-bg.jpg"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-jvs-gold/10 rounded-full blur-[90px] pointer-events-none"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-8 tracking-tight">
                                Pronto para otimizar seus custos?
                            </h2>
                            <a
                                href="/simulador"
                                className="inline-block bg-gradient-gold text-jvs-navy font-bold text-xl px-10 py-5 rounded-full shadow-2xl hover:scale-105 transform transition-all"
                            >
                                SIMULAR AGORA
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <WhatsAppFloat />
        </main>
    );
}
