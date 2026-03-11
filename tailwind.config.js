/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sirat-dark': '#1a302a',   // Deep Forest Green
        'sirat-gold': '#d4af37',   // Gold Accent
        'sirat-cream': '#fdfcf8',  // Cream Background
      },
    },
  },
  plugins: [
  require('@tailwindcss/typography'), ], 
  plugins: [require('@tailwindcss/typography')],
};

export default config; 




 
 