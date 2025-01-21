import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
	plugins: [wasm(), topLevelAwait(), svelte()],
	server: {
		port: 5000,
	},
	preview: { port: 5000 },
});
