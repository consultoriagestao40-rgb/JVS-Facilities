"use client";

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PortfolioCarouselProps {
    images: string[];
}

export default function PortfolioCarousel({ images }: PortfolioCarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                        const idx = itemRefs.current.findIndex((el) => el === entry.target);
                        if (idx !== -1) setActiveIndex(idx);
                    }
                });
            },
            { root: track, threshold: [0.6] }
        );

        itemRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [images.length]);

    const scrollToIndex = (index: number) => {
        itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    };

    const scrollByCards = (direction: 1 | -1) => {
        const nextIndex = Math.min(Math.max(activeIndex + direction, 0), images.length - 1);
        scrollToIndex(nextIndex);
    };

    return (
        <div className="relative">
            <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {images.map((img, i) => (
                    <div
                        key={i}
                        ref={(el) => { itemRefs.current[i] = el; }}
                        data-carousel-item
                        className="snap-start shrink-0 w-[80%] sm:w-[45%] lg:w-[30%] aspect-square overflow-hidden rounded-2xl border border-jvs-border shadow-sm hover:shadow-lg transition-all group relative"
                    >
                        <img
                            src={img}
                            alt={`Trabalho Realizado ${i + 1}`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-jvs-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-jvs-navy/70 backdrop-blur-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            0{i + 1}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
                <button
                    type="button"
                    onClick={() => scrollByCards(-1)}
                    aria-label="Trabalhos anteriores"
                    className="w-12 h-12 rounded-full border border-jvs-border bg-white text-jvs-navy flex items-center justify-center hover:bg-jvs-navy hover:text-jvs-gold hover:border-jvs-navy transition-colors shadow-sm shrink-0"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Ir para trabalho ${i + 1}`}
                            onClick={() => scrollToIndex(i)}
                            className="p-1"
                        >
                            <span
                                className={`block h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-jvs-gold' : 'w-1.5 bg-jvs-border hover:bg-jvs-navy/30'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => scrollByCards(1)}
                    aria-label="Próximos trabalhos"
                    className="w-12 h-12 rounded-full border border-jvs-border bg-white text-jvs-navy flex items-center justify-center hover:bg-jvs-navy hover:text-jvs-gold hover:border-jvs-navy transition-colors shadow-sm shrink-0"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
