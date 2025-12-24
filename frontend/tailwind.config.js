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
                display: ['Outfit', 'Space Grotesk', 'sans-serif'],
                heading: ['Sora', 'sans-serif'],
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
                'gradient': 'gradient 6s linear infinite',
                'scroll': 'scroll 20s linear infinite',
                'cursor': 'cursor .75s step-end infinite',
                'scan': 'scan 4s linear infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'loading-bar': 'loading-bar 1.5s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.5s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'scale-in': 'scale-in 0.3s ease-out',
                'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #6366f1' },
                    '100%': { boxShadow: '0 0 25px #06b6d4, 0 0 50px #6366f1' },
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
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'bounce-subtle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
                'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            backgroundSize: {
                '300%': '300%',
                'auto': 'auto',
            },
            backdropBlur: {
                xs: '2px',
            },
            transitionDuration: {
                '400': '400ms',
            },
        },
    },
    plugins: [],
}
