<template>
	<div class="flex flex-col bg-root h-screen">
		<div class="flex-1">
			<MapComponent
				ref="mapRef"
				@map-loaded="onMapLoaded"
			/>
			<SearchComponent @select="onSearchSelect" />
			<CoordinatesComponent ref="coordsRef" />
			<RoutingEngineComponent
				:map-instance="mapInstance"
				:data={courierId}
			/>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "vue-router";

const DEBUG = false;

const route = useRoute();
const courierId = ref(route.query.courierId ?? null);

const mapRef = ref(null);
const coordsRef = ref(null);
const mapInstance = ref(null);
const onMapLoaded = (mapWrapper) => {
	if (DEBUG) console.log("Map wrapper instance:", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
	mapInstance.value=mapWrapper.map;
};

const onSearchSelect = (item) => {
	if (DEBUG) console.log("Search selected: ", item);
	if (DEBUG) console.log("Map component", mapRef.value);
	mapRef.value.moveToWithBounds(item.center, item.boundingbox);
	mapRef.value.highlight(mapInstance.value, item);
};
</script>
