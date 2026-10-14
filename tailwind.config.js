/** Tailwind v3 config */
export default {
  content: {
    relative: true,
    files: ["./index.html", "./*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  },
  theme: {
    extend: {
      colors: { blush: "#F8DCE5", rose: "#D99BAF", cream: "#FFF8F2", lilac: "#E8DDF5", ink: "#81566A" },
      fontFamily: {
        script: ["'Dancing Script'", "Caveat", "cursive"],
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

