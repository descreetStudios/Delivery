<template>
	<div />
</template>

<script setup>
import { useRoutingStore } from "@/stores/routingStore";
import { point, lineString } from "@turf/helpers";
import pointToLineDistance from "@turf/point-to-line-distance";
import lineSlice from "@turf/line-slice";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import distance from "@turf/distance";

const { $DEBUG } = useNuxtApp();

const COLOR_AHEAD = "#0074D9";
const COLOR_PASSED = "#9E9E9E";
const POLYLINE_WIDTH = 5;

const props = defineProps({
	mapInstance: {
		type: Object,
		default: () => null,
	},
});

const map = toRef(props, "mapInstance");
const routingStore = useRoutingStore();
const { code, routes, waypoints, currentGPS, activeOrderId, passedPolyline } = storeToRefs(routingStore);
const areRoutingDataLoaded = computed(() => code.value == "Ok");
const loaded = computed(() => !!map.value && areRoutingDataLoaded.value);
const maxProgressOnRoute = ref(0);

const initRoutingEngineComponent = () => {
	if ($DEBUG) console.log("Routing data: ", routingStore);
	drawRoutingPolyline();
	drawWaypoints();

	if ($DEBUG) console.log("ActiveOrderId: ", activeOrderId.value);

	watch(
		() => activeOrderId.value,
		() => {
			deletePassedPolyline();
			deleteRoutingPolyline();
			deleteWaypoints();
			maxProgressOnRoute.value = 0;
			if ($DEBUG) console.log("Active order changed, redrawing route and waypoints.");
			const stopWatch = watch(
				() => code.value,
				(newCode) => {
					if (newCode == "Ok") {
						drawRoutingPolyline();
						drawWaypoints();
						stopWatch();
					}
				},
				{ immediate: true },
			);
		},
	);
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
	async (newVal) => {
		checkPolylineFollowing(newVal);
		await trackCurrentStep(newVal);
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
			"line-color": COLOR_AHEAD,
			"line-width": POLYLINE_WIDTH,
		},
	});
};

const drawPassedPolyline = () => {
	if (!map.value.getSource("passed_route")) {
		map.value.addSource("passed_route", {
			type: "geojson",
			data: {
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: passedPolyline.value,
				},
			},
		});

		map.value.addLayer({
			id: "passed_route",
			type: "line",
			source: "passed_route",
			paint: {
				"line-color": COLOR_PASSED,
				"line-width": POLYLINE_WIDTH,
			},
		});

	} else {
		map.value.getSource("passed_route").setData({
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: passedPolyline.value,
			},
		});
	}

	map.value.moveLayer("passed_route");
};


const deleteRoutingPolyline = () => {
	if (map.value.getSource("route")) {
		map.value.removeLayer("route");
		map.value.removeSource("route");
	}
};

const deletePassedPolyline = () => {
	passedPolyline.value = [];
	if (map.value.getSource("passed_route")) {
		map.value.removeLayer("passed_route");
		map.value.removeSource("passed_route");
	}
};

const deleteWaypoints = () => {
	if (map.value.getSource("waypoints")) {
		map.value.removeLayer("waypoints");
		map.value.removeSource("waypoints");
	}
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

const trackCurrentStep = async (currentGPSLocation) => {
	if (!loaded.value) return;

	const currentStep = routingStore.currentStep;
	if (!currentStep?.maneuver?.location) return;

	const [lng, lat] = currentGPSLocation;
	const maneuverCoords = currentStep.maneuver.location;
	const dist = distance(
		point([lng, lat]),
		point(maneuverCoords),
		{ units: "meters" },
	);

	if ($DEBUG) console.log("Distance to next maneuver:", dist.toFixed(0), "m");

	// If within 30 meters of the maneuver point, advance to next step
	if (dist < 30) {
		routingStore.advanceStep();
	}
};

const checkPolylineFollowing = async (currentGPSLocation) => {
	if (!loaded.value || !activeOrderId.value) return;

	const [lng, lat] = currentGPSLocation;
	const gps = point([lng, lat]);
	const route = lineString(routes.value?.[0]?.geometry.coordinates);
	const distanceToPolyline = pointToLineDistance(gps, route, {
		units: "meters",
	});
	if ($DEBUG) console.log("Distance", distanceToPolyline);

	if (distanceToPolyline >= 25) {
		await routingStore.syncRoutingData();
		drawRoutingPolyline();
		drawWaypoints();
	} else {
		const snapped = nearestPointOnLine(route, gps);
		const currentProgress = snapped.properties.location;

		if (currentProgress < maxProgressOnRoute.value - 25) {
			await routingStore.syncRoutingData();
			drawRoutingPolyline();
			drawWaypoints();
			return;
		}
	
		if (currentProgress > maxProgressOnRoute.value) {
			maxProgressOnRoute.value = currentProgress;
		}

		const routeCoords = routes.value[0].geometry.coordinates;
		const start = point(routeCoords[0]);
		const sliced = lineSlice(start, snapped, route);
		passedPolyline.value = sliced.geometry.coordinates;
		drawPassedPolyline();
	}
};

onUnmounted(() => {
	stopGPSWatch();
});

</script>