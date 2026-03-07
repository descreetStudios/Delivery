<template>
	<div class="flex flex-col bg-root h-screen">
		<SidebarComponent />
		<MapComponent
			ref="mapRef"
			@map-loaded="onMapLoaded"
		/>
		<CoordinatesComponent ref="coordsRef" />
		<RoutingEngineComponent
			:map-instance="mapInstance"
			:data="{courierId}"
		/>
	</div>
</template>

<script setup>
import { useRoute } from "vue-router";

const DEBUG = false;

const route = useRoute();
const courierId = ref(route.query.courierId ?? null);

const coordsRef = ref(null);
const mapInstance = ref(null);
const onMapLoaded = (mapWrapper) => {
	if (DEBUG) console.log("Map wrapper instance:", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
	mapInstance.value=mapWrapper.map;
};
</script>
