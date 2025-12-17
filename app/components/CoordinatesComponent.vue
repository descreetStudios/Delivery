<template>
	<div
		class="top-4 left-4 absolute bg-white/90 shadow backdrop-blur px-3 py-1 rounded text-xs"
	>
		<span v-if="lng !== null">
			{{ lng.toFixed(5) }}, {{ lat.toFixed(5) }}
		</span>
		<span v-else>
			—
		</span>
	</div>
</template>

<script setup>
const lng = ref(null);
const lat = ref(null);

const bindMap = (mapWrapper) => {
	const map = mapWrapper?.map;

	if (!map || typeof map.on !== "function") {
		console.warn("MapLibre instance not found", mapWrapper);
		return;
	}

	map.on("mousemove", (e) => {
		lng.value = e.lngLat.lng;
		lat.value = e.lngLat.lat;
	});
};

defineExpose({ bindMap });
</script>