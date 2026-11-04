/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          navy: "#0a2540",
          navyDark: "#06182c",
          cobalt: "#1d4ed8",
          cobaltLight: "#3b82f6",
          emerald: "#059669",
          emeraldLight: "#10b981",
          slate: "#f8fafc",
          surface: "#ffffff",
          border: "#e2e8f0"
        }
      },
      fontFamily: {
        sans: ['"Sarabun"', '"Prompt"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
