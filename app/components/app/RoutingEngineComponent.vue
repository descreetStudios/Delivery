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
const areRoutingDataLoaded = computed(() => routingStore.code == "Ok");
const loaded = computed(() => !!map.value && areRoutingDataLoaded.value);

const initRoutingEngineComponent = () => {
	drawRoutingPolyline();
	drawWaypoints();
};

const stopWatch = watch(
	() => loaded.value,
	(newVal) => {
		if (newVal) {
			initRoutingEngineComponent();
			nextTick(() => {
				if (stopWatch) stopWatch();
			});
		}
	},
	{ immediate: true },
);

const drawRoutingPolyline = () => {

	if ($DEBUG) console.log("Routing data: ", routingStore);

	const route = routingStore?.routes?.[0]?.geometry;
	if (!route) {
		console.error("Route geometry error", routingStore);
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

const drawWaypoints = () => {
	const waypoints = [];

	for (let i = 0; i < routingStore?.waypoints?.length; i++) {
		waypoints.push(routingStore?.waypoints?.[i]?.location);
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

</script>

<style></style>
