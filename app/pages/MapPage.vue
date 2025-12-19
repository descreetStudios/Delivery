<template>
	<div class="flex flex-col bg-root h-screen">
		<div class="flex-1">
			<MapComponent
				ref="mapRef"
				@map-loaded="onMapLoaded"
			/>
			<SearchComponent @select="onSearchSelect" />
			<CoordinatesComponent ref="coordsRef" />
			<RoutingEngineComponent :map-instance="mapInstance" />
		</div>
	</div>
</template>

<script setup>
const DEBUG = false;

const mapRef = ref(null);
const coordsRef = ref(null);
const mapInstance = ref(null);
const onMapLoaded = (mapWrapper) => {
	if (DEBUG) console.log("Map wrapper instance:", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);

	mapInstance.value=mapWrapper.map;
	console.log(mapInstance.value);
};

const onSearchSelect = (item) => {
	if (DEBUG) console.log("Search selected: ", item);
	if (DEBUG) console.log("Map component", mapRef.value);
	mapRef.value.moveTo(item.center);
};
</script>