// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
	compatibilityDate: "2026-03-14",
	devtools: { enabled: true },
	modules: [
		"@nuxt/eslint",
		"@nuxt/image",
		"nuxt-maplibre",
		"@vueuse/nuxt",
		"@nuxt/ui",
		"@pinia/nuxt",
		"@nuxtjs/i18n",
	],

	vite: {
		optimizeDeps: {
			include: [
				"@vue/devtools-core",
				"@vue/devtools-kit",
				"@indoorequal/vue-maplibre-gl",
			],
		},
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

	i18n: {
		strategy: "no_prefix",
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: "i18n_redirected",
			redirectOn: "root",
			fallbackLocale: "en",
			alwaysRedirect: true,
		},
		locales: [
			{ code: "it", iso: "it-IT", file: "it.json", name: "Italiano" },
			{ code: "en", iso: "en-US", file: "en.json", name: "English" },
			{ code: "es", iso: "es-ES", file: "es.json", name: "Español" },
		],



	},


});