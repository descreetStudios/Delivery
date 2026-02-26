<template>
	<div class="flex flex-col bg-root h-screen">
		<SidebarComponent>
			<MapComponent
				ref="mapRef"
				@map-loaded="onMapLoaded"
			/>
			<SearchComponent
				@select="onSearchSelect"
				@select-civic="onSearchCivicSelect"
			/>
			<CoordinatesComponent ref="coordsRef" />
			<RoutingEngineComponent
				:map-instance="mapInstance"
				:data="{courierId}"
			/>
		</SidebarComponent>
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

const onSearchCivicSelect = (item) => {
	if (DEBUG) console.log("Search civic selected: ", item);
	if (DEBUG) console.log("Map component", mapRef.value);
	mapRef.value.moveToWithBounds(item.center, item.boundingbox);
	mapRef.value.highlightCivic(mapInstance.value, item);
};
</script>
