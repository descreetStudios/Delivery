<template>
	<div>
		<!-- <h1>Ciao</h1>   -->
	</div>
</template>

<script setup>
const DEBUG = false;
const { getLocation } = useLocationApi();


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
	if (props.data.courierId=="0000" || props.data.courierId==null) return;
	const link = ref("");
	const location = await getLocation("courier"+props.data.courierId);
	if (location) {
		link.value = "https://router.project-osrm.org/route/v1/driving/" + location.longitude + "," + location.latitude + ";9.19,45.46;7.44,46.94?overview=full&geometries=geojson";
	}
	if(DEBUG) console.log(link.value);

	const response = await fetch(
		link.value,
	);
	const data = await response.json();

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
