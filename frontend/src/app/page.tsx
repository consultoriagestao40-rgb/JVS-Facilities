import Hero from '@/components/home/Hero';
import Benefits from '@/components/home/Benefits';
import Services from '@/components/home/Services';
import SocialProof from '@/components/home/SocialProof';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <Hero />
            <Benefits />
            <Services />
            <SocialProof />

            {/* CTA Final */}
            <div className="py-20 bg-primary text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                        Pronto para otimizar seus custos?
                    </h2>
                    <a
                        href="/simulador"
                        className="inline-block bg-white text-primary font-bold text-xl px-10 py-5 rounded-xl shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all"
                    >
                        SIMULAR AGORA
                    </a>
                </div>
            </div>
        </main>
    );
}
