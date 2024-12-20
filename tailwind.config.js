/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ["./src/**/*.{html,ts}"], // Adjust to match your project structure
  theme: {
    extend: {
      fontFamily: {
        orbi: ["Orbitron", "sans-serif"],
        tmcandor: ["TMCandor", "sans-serif"],
      },
      colors: {
        primary: "#fa6432",       // Primary color
        secondary: "#00283c",     // Secondary color
        tertiary: "#ffffff",      // Tertiary color
        text: "#000a1e",          // Text color

        // Flattened background colors
        bgLight: "#dee1e4",       // Light background
        bgMuted: "#e8ebee",       // Muted background
        bgSoft: "#f2f5f8",        // Soft background
        bgLightest: "#F4F7F9",
      },
    },
  },
  plugins: [],
};
