// tailwind.config.js (Sugestão de configuração)
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f392b', // Verde escuro do cartão
          light: '#22c55e', // Verde claro do +
          gray: '#374151', // Cinza do "Control"
        }
      }
    },
  },
  plugins: [],
}