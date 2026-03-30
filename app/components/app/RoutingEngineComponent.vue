<template>
	<div />
</template>

<script setup>
import { useRoutingStore } from "@/stores/routingStore";
import { point, lineString } from "@turf/helpers";
import pointToLineDistance from "@turf/point-to-line-distance";

const { $DEBUG } = useNuxtApp();

const props = defineProps({
	mapInstance: {
		type: Object,
		default: () => null,
	},
});

const map = toRef(props, "mapInstance");
const routingStore = useRoutingStore();
const { code, routes, waypoints, currentGPS } = storeToRefs(routingStore);
const areRoutingDataLoaded = computed(() => code.value == "Ok");
const loaded = computed(() => !!map.value && areRoutingDataLoaded.value);

const initRoutingEngineComponent = () => {
	if ($DEBUG) console.log("Routing data: ", routingStore);

	drawRoutingPolyline();
	drawWaypoints();
};

const stopLoadingWatch = watch(
	() => loaded.value,
	(newVal) => {
		if (newVal) {
			initRoutingEngineComponent();
			nextTick(() => {
				if (stopLoadingWatch) stopLoadingWatch();
			});
		}
	},
	{ immediate: true },
);

const stopGPSWatch = watch(
	() => currentGPS.value,
	(newVal) => {
		checkPolylineFollowing(newVal);
	},
);

const drawRoutingPolyline = () => {
	const routeGeometry = routes.value?.[0]?.geometry;
	if (!routeGeometry) {
		console.error("Route geometry error", routes.value);
		return;
	}

	if ($DEBUG) console.log("Routing polyline: ", routeGeometry);

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
			geometry: routeGeometry,
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
	const waypointsLocations = [];

	for (let i = 0; i < waypoints.value?.length; i++) {
		waypointsLocations.push(waypoints.value?.[i]?.location);
	}

	const waypointsFeatures = waypointsLocations.map(coord => ({
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

const checkPolylineFollowing = async (currentGPSLocation) => {
	if (!loaded.value) return;

	const [lng, lat] = currentGPSLocation;
	const gps = point([lng, lat]);
	const route = lineString(routes.value?.[0]?.geometry.coordinates);
	const distance = pointToLineDistance(gps, route, {
		units: "meters",
	});

	if ($DEBUG) console.log("Distance", distance);

	if (distance >= 50) {
		await routingStore.syncRoutingData();
		drawRoutingPolyline();
		drawWaypoints();
	}
};

onUnmounted(() => {
	stopGPSWatch();
});

</script>