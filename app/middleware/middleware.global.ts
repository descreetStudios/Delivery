import { isEmpty } from "@nuxt/ui/runtime/utils/index.js";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, _from) => {
	const PAGES = ["/en/UserPage", "/en/RiderPage", "/en/TrackPage", "/en/TestPage"];

	if (!PAGES.includes(to.path)) {
		return navigateTo({ path: "/en/UserPage"});
	}
	if ("/en/RiderPage".includes(to.path) && isEmpty(to.query) ){
		return navigateTo({ path: "/en/RiderPage", query: { courierId: "0000" } });
	}
});
