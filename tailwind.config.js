/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A9B8C',
        secondary: '#7EC8B8',
        accent: '#F0F7F5',
        dark: '#2D5A4E',
        muted: '#8FA8A2',
      }
    },
  },
  plugins: [],
}
