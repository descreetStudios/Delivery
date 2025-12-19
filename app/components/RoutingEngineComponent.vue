<template>
	<div>
		<!-- <h1>Ciao</h1>   -->
	</div>
</template>

<script setup>
const DEBUG = false;

const props = defineProps({
	mapInstance: {
		type: Object,
		default: () => null,
	},
});
const response = await fetch(
	"https://router.project-osrm.org/route/v1/driving/9.5,45.3;9.19,45.46?overview=full&geometries=geojson",
);
const data = await response.json();

const route = data.routes[0].geometry;

if (DEBUG) console.log(route);

onMounted(() => {
	watch(
		() => props.mapInstance,
		(newVal, oldVal) => {
			if (newVal && oldVal == null) {
				const map = newVal;
				if (DEBUG) console.log("Map instance ready:", map);
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
});
</script>

<style></style>