<template>
	<div />
</template>

<script setup>
const { $DEBUG } = useNuxtApp();

const { $routingStore } = useNuxtApp();
const routingData = ref();

const props = defineProps({
	mapInstance: {
		type: Object,
		default: () => null,
	},
});

const drawRoutingPolyline = () => {

	if ($DEBUG) console.log(routingData.value);

	const route = routingData.value.routes[0].geometry;

	if ($DEBUG) console.log(route);

	watch(
		() => props.mapInstance,
		(newVal, oldVal) => {
			if (newVal && oldVal == null) {
				const map = newVal;
				if ($DEBUG) console.log("Map instance ready:", map);

				map.addSource("route", {
					type: "geojson",
					data: {
						type: "Feature",
						properties: {},
						geometry: route,
					},
				});

				map.addLayer({
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
			}
		},
		{ immediate: true },
	);
};


onMounted(async () => {
	const stopWatch = watch(
		() => $routingStore.code,
		(newVal, oldVal) => {
			if (newVal != oldVal) {
				if (newVal == "Ok") {
					if ($DEBUG) console.log("routingStore loaded!");
					routingData.value = $routingStore.$state;
					drawRoutingPolyline();
					stopWatch();
				}
				else if (newVal == "NotLoaded") return;
				else {
					console.error(newVal);
				}
			}
		},
		{ immediate: true },
	);
});
</script>

<style></style>
