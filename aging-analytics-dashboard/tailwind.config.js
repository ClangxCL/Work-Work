/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#17191c',
        paper: '#ffffff',
        mist: '#f2f2f3',
        fog: '#fafafb',
        slate: '#5f6370', // Updated from #777b86 for high readability
        ash: '#6b6f7a',   // Updated from #979799 for visible badges
        smoke: '#a3a6af', // Only for placeholders
        peach: '#fbe1d1',
        sienna: '#5d2a1a',
        border: '#ececec',
      },
      fontFamily: {
        sans: ["'Inter'", "'Noto Sans Thai'", 'system-ui', 'sans-serif'],
        serif: ["'Source Serif 4'", "'Noto Serif Thai'", 'Georgia', 'serif'],
        signifier: ["'Source Serif 4'", "'Noto Serif Thai'", 'Georgia', 'serif'],
        sohne: ["'Inter'", "'Noto Sans Thai'", 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: '1.6' }],
        sm: ['var(--text-sm)', { lineHeight: '1.6' }],
        base: ['var(--text-base)', { lineHeight: '1.6' }],
        lg: ['var(--text-lg)', { lineHeight: '1.4' }],
        xl: ['var(--text-xl)', { lineHeight: '1.4' }],
        '2xl': ['var(--text-2xl)', { lineHeight: '1.4' }],
        '3xl': ['var(--text-2xl)', { lineHeight: '1.4' }],
        '4xl': ['var(--text-2xl)', { lineHeight: '1.4' }],
        stat: ['var(--text-stat)', { lineHeight: '1.1' }],
      },
      borderRadius: {
        cards: '24px',
        inputs: '16px',
        elevated: '20px',
        pill: '9999px',
      },
      boxShadow: {
        elevated: '0 0 0 1px rgba(4,23,43,0.05), 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        subtle: 'oklab(0 0 0 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 4px 24px 0px',
      }
    },
  },
  plugins: [],
}
