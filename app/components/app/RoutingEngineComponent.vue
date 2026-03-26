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
const waiting = ref(false);

const routingStore = useRoutingStore();
const routingData = shallowRef(routingStore.$state);
const unsubscribe = routingStore.$subscribe((mutation, state) => {
	routingData.value = state;
	if (!waiting.value) waitLoading();
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
	const waypoints = [];

	for (let i = 0; i < routingData.value?.waypoints?.length; i++) {
		waypoints.push(routingData.value?.waypoints?.[i]?.location);
	}

	const waypointsFeatures = waypoints.map(coord => ({
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: coord,
		},
	}));

	if ($DEBUG) console.log("waypointsFeatures: ", waypointsFeatures);

	//Remove older sources and layers
	if (map.value.getSource("waypoints")) {
		map.value.removeLayer("waypoints");
		map.value.removeSource("waypoints");
	}

	map.value.addSource("waypoints", {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: waypointsFeatures,
		},
	});

	map.value.addLayer({
		id: "waypoints",
		type: "circle",
		source: "waypoints",
		paint: {
			"circle-radius": 6,
			"circle-color": "#ff0000",
		},
	});
};

const waitLoading = () => {
	waiting.value = true;    
	const stopWatch = watch(
		() => map.value,
		(newVal, oldVal) => {
			if (checkMapStatus(newVal, oldVal) && routingData.value.code == "Ok") {
				drawRoutingPolyline();
				drawWaypoints();
				waiting.value = false;
				nextTick(() => {
					if (stopWatch) stopWatch();
				});
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
