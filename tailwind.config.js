/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        surface: "#0C0F0C",
        surface2: "#141813",
        line: "#212620",
        ink: "#F4F6F2",
        muted: "#7C8578",
        green: "#31E17A",
        greenSoft: "#8FF0B8",
        greenDim: "rgba(49,225,122,0.14)",
        greenDeep: "#0F5C36",
        coral: "#FF7A45",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        num: ["Bebas Neue", "sans-serif"],
      },
      borderRadius: { "2xl": "1rem", "3xl": "1.5rem" },
      boxShadow: {
        glow: "0 0 28px rgba(49,225,122,0.28)",
      },
    },
  },
  plugins: [],
};
