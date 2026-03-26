import { isEmpty } from "@nuxt/ui/runtime/utils/index.js";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to) => {
	const PAGES = ["/UserPage", "/RiderPage", "/TrackPage", "/TestPage", "/License"];

	if (!PAGES.includes(to.path) && !("/" == to.path)) {
		return navigateTo({ path: "/" });
	}
	if (["/RiderPage"].includes(to.path) && isEmpty(to.query) ){
		return navigateTo({ path: "/RiderPage", query: { courierId: "0000" } });
	}
});
