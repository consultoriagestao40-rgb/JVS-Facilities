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
