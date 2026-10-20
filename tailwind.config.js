/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0B0F19',
        'space-card': '#111827',
        'hyper-cyan': '#00f2fe',
        'hyper-purple': '#4facfe',
      }
    },
  },
  plugins: [],
}