/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                background: '#05050A',
                surface: '#0A0B14',
                'surface-light': '#0F111A',
                primary: '#6366f1',
                accent: '#06b6d4',
                glass: 'rgba(255, 255, 255, 0.05)',
                glassBorder: 'rgba(255, 255, 255, 0.1)',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'gradient': 'gradient 8s linear infinite',
                'scroll': 'scroll 20s linear infinite',
                'cursor': 'cursor .75s step-end infinite',
                'scan': 'scan 4s linear infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'loading-bar': 'loading-bar 1.5s ease-in-out infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #6366f1' },
                    '100%': { boxShadow: '0 0 20px #06b6d4' },
                },
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                cursor: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                scan: {
                    '0%': { top: '0%', opacity: 0 },
                    '10%': { opacity: 1 },
                    '90%': { opacity: 1 },
                    '100%': { top: '100%', opacity: 0 },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'loading-bar': {
                    '0%': { transform: 'translateX(-100%)' },
                    '50%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
                'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            },
            backgroundSize: {
                '300%': '300%',
            },
        },
    },
    plugins: [],
}
