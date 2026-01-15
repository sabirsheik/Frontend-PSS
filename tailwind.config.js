/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary : "#10823b",
        primary: "#22c55e",
      },
    },
  },
  plugins: [],
}
