<template>
	<div />
</template>

<script setup>
const DEBUG = false;
const { getRoutingData } = useRoutingEngineApi();


const props = defineProps({
	mapInstance: {
		type: Object,
		default: () => null,
	},
	data: {
		type:
			{
				courierId: String,
			},
		default: () => null,
	},
});


onMounted(async () => {
	const data = await getRoutingData(props.data.courierId);

	const route = data.routes[0].geometry;

	if (DEBUG) console.log(route);
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
