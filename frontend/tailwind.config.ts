import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#10B981", // Verde Principal
                secondary: "#3B82F6", // Azul Secundário
                neutral: "#6B7280",
                success: "#10B981",
                error: "#EF4444",
                warning: "#F59E0B",
                info: "#3B82F6",
                jvs: {
                    navy: "#0E2240",
                    "navy-light": "#1E3A63",
                    gold: "#C5A059",
                    "gold-light": "#DFCE9F",
                    "bg-alt": "#F4F7FA",
                    text: "#1E293B",
                    muted: "#64748B",
                    border: "#E2E8F0",
                },
            },
            backgroundImage: {
                "gradient-hero": "linear-gradient(135deg, #0E2240 0%, #1A365D 100%)",
                "gradient-gold": "linear-gradient(90deg, #C5A059 0%, #E5C483 100%)",
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
                heading: ['var(--font-poppins)'],
            }
        },
    },
    plugins: [],
};
export default config;
