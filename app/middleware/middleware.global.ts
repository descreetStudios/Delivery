import { isEmpty } from "@nuxt/ui/runtime/utils/index.js";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
	const PAGES = ["/UserPage", "/RiderPage", "/TrackPage", "/TestPage"];

	if (!PAGES.includes(to.path) && !("/" == from.path)) {
		return navigateTo({ path: "/" });
	}
	if (["/en/RiderPage"].includes(to.path) && isEmpty(to.query) ){
		return navigateTo({ path: "/en/RiderPage", query: { courierId: "0000" } });
	}
});
