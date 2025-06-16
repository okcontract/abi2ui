/** @type {import('tailwindcss').Config} */

module.exports = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/@okcontract/uic/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui"],
				heading: ["IBM Plex Sans", "sans-serif"],
				mono: ["JetBrains Mono", "monospace"],
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	daisyui: {
		themes: [
			{
				light: {
					...require("daisyui/src/theming/themes").light,
					primary: "#F19AA0",
					secondary: "#C698F9",
					accent: "#f0abfc",
					neutral: "#260E33",
					info: "#B15AF6",
					success: "#b0ec9c",
					warning: "#fbbf24",
					error: "#A986B8",
					base: "#fffffa",
				},
			},
			{
				night: {
					...require("daisyui/src/theming/themes").night,
					primary: "#235aff", //blue
					secondary: "#dfe7ff", // light blue
					accent: "#fc3a3a", // red
					neutral: "#4e5562", //
					info: "#3ab0f9", // turqoise
					success: "#6ed779", // green
					warning: "#ffb92c", // gold
					error: "#fc3a3a", // dc6fd6 purple
					"base-100": "#ffffff",
					"base-200": "#e8e8e8",
					"base-300": "#e1e1e1", //c6c4c4
				},
			},
		],
		darkTheme: "night",
		base: true,
		styled: true,
		utils: true,
		prefix: "",
		themeRoot: ":root",
	},
};
