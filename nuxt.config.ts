// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxt/image", "nuxt-maplibre", "@vueuse/nuxt"],
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
			apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080/api/locations",
			wsUrl: process.env.NUXT_PUBLIC_WS_URL || "ws://localhost:8080/ws/locations",
		},
	},
	// Enable CORS for development
	nitro: {
		devProxy: {
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
		},
	},
});
