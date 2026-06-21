/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B10",
        surface: "#16161D",
        surface2: "#1E1E27",
        marquee: "#F2B705",
        velvet: "#E63946",
        ink: "#F5F3EE",
        muted: "#9A97A3",
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        marquee: "0.08em",
      },
    },
  },
  plugins: [],
};
