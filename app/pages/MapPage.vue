<template>
	<div class="flex flex-col bg-gray-50 h-screen">
		<div class="flex-1">
			<MapComponent @map-loaded="onMapLoaded" />
			<SearchComponent />
			<CoordinatesComponent ref="coordsRef" />
		</div>
	</div>
</template>

<script setup>
const DEBUG = false;

const coordsRef = ref(null);

const onMapLoaded = (mapWrapper) => {
	if (DEBUG) console.log("Map wrapper instance:", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
};
</script>