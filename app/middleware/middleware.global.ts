import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
export default defineNuxtRouteMiddleware((to, _from) => {
	if (to.path != "/MapPage") {
		return navigateTo({ path: "/MapPage", query: { CourierId: "0000" } });
	}
});
