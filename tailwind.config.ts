/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10823b",
        secondary: "#22c55e",
      },
    },
  },
  plugins: [],
}
