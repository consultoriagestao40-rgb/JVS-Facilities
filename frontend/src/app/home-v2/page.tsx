import HeroV2 from "@/components/v2/HeroV2";
import ClientsShowcase from "@/components/v2/ClientsShowcase";
import SegmentsB2B from "@/components/v2/SegmentsB2B";
import ServicesFourPillars from "@/components/v2/ServicesFourPillars";
import Benefits from "@/components/home/Benefits";
import ComparisonTable from "@/components/home/ComparisonTable";
import StatsSection from "@/components/home/StatsSection";
import WhatsAppFloat from "@/components/common/WhatsAppFloat";
import { homeClientLogos } from "@/data/clientLogosHome";

/**
 * Home v2 — cópia de validação (reunião 04/08/2026).
 * Página original em `/` permanece intacta.
 *
 * Estrutura pedida: carteirada curta — clientes cedo, segmentos B2B,
 * 4 serviços, sem Playbook/Tech/Governance/Risk na primeira dobra.
 */
export default function HomeV2() {
    return (
        <main className="flex min-h-screen flex-col">
            <HeroV2 />
            <ClientsShowcase
                title="Clientes que confiam na JVS"
                subtitle=""
                eyebrow=""
                logos={homeClientLogos}
                tone="light"
            />
            <SegmentsB2B />
            <StatsSection />
            <ServicesFourPillars />
            <Benefits />
            <ComparisonTable />

            <section className="py-20 md:py-28 bg-jvs-bg-alt">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl text-white px-8 py-16 md:py-20 text-center shadow-2xl">
                        <img
                            src="/images/home/cta-bg.jpg"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
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
