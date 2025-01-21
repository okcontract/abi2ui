/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/@okcontract/uic/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    }
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    themeRoot: ":root"
  }
};
