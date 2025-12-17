<template>
	<div class="flex flex-col bg-gray-50 h-screen">
		<div class="flex-1">
			<MapComponent @map-loaded="onMapLoaded" />
		</div>
	</div>
</template>

<script setup>
const DEBUG = false;

const onMapLoaded = (map) => {
	if (DEBUG) console.log("Map instance:", map);
};
</script>