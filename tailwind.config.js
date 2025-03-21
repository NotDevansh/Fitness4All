/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E293B",
        secondary: "#334155",
        accent: "#3B82F6",
      },
    },
  },
  plugins: [],
} 