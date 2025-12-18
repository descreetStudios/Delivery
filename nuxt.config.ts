// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxt/image", "nuxt-maplibre"],
	vite: {
		plugins: [tailwindcss()],
	},
	css: ["~/assets/css/main.css"],
	image: {
		provider: "ipx",
		format: ["webp"],
	},
	runtimeConfig: {
		public: {
			apiBase: "http://localhost:8080",
			wsUrl: "ws://localhost:8080/ws/locations",
		},
	},
});
