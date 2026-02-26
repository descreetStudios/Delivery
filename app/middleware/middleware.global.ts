import { isEmpty } from "@nuxt/ui/runtime/utils/index.js";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, _from) => {
	const PAGES = ["/UserPage", "/RiderPage", "/TrackPage", "/TestPage"];

	if (!PAGES.includes(to.path)) {
		return navigateTo({ path: "/UserPage"});
	}
	if ("/RiderPage".includes(to.path) && isEmpty(to.query) ){
		return navigateTo({ path: "/RiderPage", query: { courierId: "0000" } });
	}
});
