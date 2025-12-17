<template>
	<div class="relative w-full h-full">
		<ClientOnly>
			<MglMap
				ref="mapInstance"
				:center="mapCenter"
				:zoom="mapZoom"
				:map-style="mapStyle"
				@map:load="handleMapLoad"
			>
				<MglNavigationControl position="top-right" />
				<MglFullscreenControl position="top-right" />
				<MglGeolocateControl position="top-right" />
				<MglScaleControl position="bottom-left" />
			</MglMap>
		</ClientOnly>
	</div>
</template>

<script setup>
const props = defineProps({
	center: {
		type: Array,
		default: () => [-1.559482, 47.21322],
	},
	zoom: {
		type: Number,
		default: 13,
	},
	styleUrl: {
		type: String,
		default: "https://tiles.openfreemap.org/styles/liberty",
	},
});

const mapInstance = ref(null);
const mapCenter = ref(props.center);
const mapZoom = ref(props.zoom);
const mapStyle = ref(props.styleUrl);

const emit = defineEmits(["map-loaded", "map-click"]);

const handleMapLoad = (map) => {
	console.log("Loaded Map Component");
	emit("map-loaded", map);
};

defineExpose({
	getMap: () => mapInstance.value,
	flyTo: (center, zoom = 13) => {
		if (mapInstance.value) {
			mapInstance.value.flyTo({ center, zoom });
		}
	},
	setCenter: (newCenter) => {
		mapCenter.value = newCenter;
	},
	setZoom: (newZoom) => {
		mapZoom.value = newZoom;
	},
});
</script>
