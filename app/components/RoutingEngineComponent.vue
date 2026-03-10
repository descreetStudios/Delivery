<template>
	<div />
</template>

<script setup>
const { $DEBUG } = useNuxtApp();

const { $routingStore } = useNuxtApp();
const routingData = computed(() => $routingStore.$state);

const props = defineProps({
	mapInstance: {
		type: Object,
		default: () => null,
	},
});

const map = toRef(props, "mapInstance");

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

const checkStoreStatus = (newVal, oldVal) => {
	if (newVal != oldVal) {
		if (newVal == "Ok") {
			if ($DEBUG) console.log("$routingStore loaded!");
			return true;
		}
		else if (newVal == "NotLoaded") return false;
		else {
			throw new Error(newVal);
		}
	}
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

onMounted(async () => {
	const stopWatch = watch(
		() => [map.value, routingData.value.code],
		([mapNewVal, codeNewVal], oldVals = []) => {
			const [mapOldVal, codeOldVal] = oldVals;
			try {
				if (checkMapStatus(mapNewVal, mapOldVal) && checkStoreStatus(codeNewVal, codeOldVal)) {
					drawRoutingPolyline();
					stopWatch();
				}
			} catch (err) {
				console.error(err.message);
			}
		},
		{ immediate: true },
	);
});
</script>

<style></style>
