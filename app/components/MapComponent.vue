<template>
	<div class="relative w-full h-full">
		<ClientOnly>
			<MglMap
				ref="mapWrapperInstance"
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
const DEBUG = false;

const props = defineProps({
	center: {
		type: Array,
		default: () => [9.18969, 45.46409],
	},
	zoom: {
		type: Number,
		default: 15,
	},
	styleUrl: {
		type: String,
		default: "https://tiles.openfreemap.org/styles/liberty",
	},
});

const mapWrapperInstance = ref(null);
const mapCenter = ref(props.center);
const mapZoom = ref(props.zoom);
const mapStyle = ref(props.styleUrl);

const emit = defineEmits(["map-loaded", "map-click"]);

const handleMapLoad = (mapWrapper) => {
	if (DEBUG) console.log("Loaded Map Component");
	emit("map-loaded", mapWrapper);

	// TODO: Make this dynamically working with settings
	mapWrapper.map.setProjection({
		type: ["interpolate", ["linear"], ["zoom"], 0, "globe", 12, "mercator"],
	});
};

defineExpose({
	getMapWrapper: () => mapWrapperInstance.value,
	moveTo: (center, zoom = 16) => {
		if (mapWrapperInstance.value && mapWrapperInstance.value.map) {
			if (DEBUG) console.log("Wrapper: ", mapWrapperInstance.value);
			mapWrapperInstance.value.map.flyTo({ center, zoom });
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
