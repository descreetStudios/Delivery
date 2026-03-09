import { useRoutingStore } from "@/stores/routingStore";

export default defineNuxtPlugin((nuxtApp) => {
	const routingStore = useRoutingStore();

	nuxtApp.provide("routingStore", routingStore);
});