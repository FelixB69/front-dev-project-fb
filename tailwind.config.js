/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1700px",
    },
    colors: {
      blue: "#26547C",
      pink: "#EF476F",
      orange: "#FFD166",
      green: "#06D6A0",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#FCFCFC",
      white: "#ffffff",
      red: "#FF0000",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "3xl": "1rem",
        "4xl": "2rem",
      },
      colors: {
        green: {
          DEFAULT: "#06D6A0",
          dark: "#059669", // Pour `border-green-dark`
          light: "#34D399", // Pour `bg-green-light`
        },
      },
    },
  },
  plugins: [],
};
