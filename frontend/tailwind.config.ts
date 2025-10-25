import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        specialgothic: ['"Special Gothic Condensed One"', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        'booker-beige': '#f5efe1',
        'booker-green': '#2e4b30',
        'booker-green-dark': '#1a3a1c',
        'booker-green-light': '#3d5a3f',
        'booker-accent': '#4a6b4d',
        'booker-muted': '#6b7c6d',
      },
    },
  },
  plugins: [],
}

export default config
