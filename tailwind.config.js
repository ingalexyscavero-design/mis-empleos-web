/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        marca: { DEFAULT: "#6d28d9", osc: "#5b21b6", claro: "#f5f3ff" },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        aparecer: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-16px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        pop: {
          "0%": { transform: "scale(.8)", opacity: 0 },
          "60%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        flotar: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        aparecer: "aparecer .4s cubic-bezier(.21,1.02,.73,1) both",
        slideIn: "slideIn .35s ease both",
        pop: "pop .35s cubic-bezier(.34,1.56,.64,1) both",
        shimmer: "shimmer 1.4s linear infinite",
        flotar: "flotar 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
