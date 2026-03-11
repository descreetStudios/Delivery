<template>
	<div />
</template>

<script setup>
import { useRoutingStore } from "@/stores/routingStore";

const { $DEBUG } = useNuxtApp();

const props = defineProps({
	mapInstance: {
		type: Object,
		default: () => null,
	},
});

const map = toRef(props, "mapInstance");

const routingStore = useRoutingStore();
const routingData = shallowRef(routingStore.$state);
const unsubscribe = routingStore.$subscribe((mutation, state) => {
	routingData.value = state;
	if (state.code == "Ok" && map.value) {
		drawRoutingPolyline();
		drawWaypoints();
	}
	else waitMapLoading();
});

const drawRoutingPolyline = () => {

	if ($DEBUG) console.log("Routing data: ", routingData.value);

	const route = routingData.value?.routes?.[0]?.geometry;
	if (!route) {
		console.error("Route geometry error", routingData.value);
		return;
	}

	if ($DEBUG) console.log("Routing polyline: ", route);

	//Remove older sources and layers
	if (map.value.getSource("route")) {
		map.value.removeLayer("route");
		map.value.removeSource("route");
	}

	map.value.addSource("route", {
		type: "geojson",
		data: {
			type: "Feature",
			properties: {},
			geometry: route,
		},
	});

	map.value.addLayer({
		id: "route",
		type: "line",
		source: "route",
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
		paint: {
			"line-color": "#0074D9",
			"line-width": 4,
		},
	});
};

const checkMapStatus = (newVal, oldVal) => {
	if (newVal) {
		if (oldVal == null && $DEBUG) {
			console.log("Map instance ready: ", map.value);
		}
		if (map.value.isStyleLoaded()) return true;
		return false;
	}
	return false;
};

const drawWaypoints = () => {
	const waypoints = routingData.value?.waypoints?.[0]?.geometry; //TODO: Change this!

	console.log(waypoints);

	//Remove older sources and layers
	if (map.value.getSource("waypoints")) {
		map.value.removeLayer("waypoints");
		map.value.removeSource("waypoints");
	}

	map.value.addSource("waypoints", {
		type: "geojson",
		data: {
			type: "Feature",
			properties: {},
			geometry: waypoints,
		},
	});

	//TODO: add the waypoints layer
};

const waitMapLoading = () => {
	const stopWatch = watch(
		() => map.value,
		(newVal, oldVal) => {
			if (checkMapStatus(newVal, oldVal)) {
				drawRoutingPolyline();
				drawWaypoints();
				stopWatch();
			}
		},
		{ immediate: true },
	);
};

onUnmounted(() => {
	unsubscribe();
});
</script>

<style></style>
