import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
export default defineNuxtRouteMiddleware((to, _from) => {
	const pages = ["/MapPage", "/TrackPage", "/TestPage"];

	if (!pages.includes(to.path)) {
		return navigateTo({ path: "/MapPage", query: { courierId: "0000" } });
	}
});
