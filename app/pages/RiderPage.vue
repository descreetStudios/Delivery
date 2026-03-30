<template>
	<div class="flex flex-col bg-root h-screen">
		<AppLoadingComponent
			v-if="!mapInstance"
			class="z-1000"
		/>
		<AppSidebarComponent>
			<template #sidebar>
				<AppRoutingCardComponent />
				<div>
					<p class="text-text-primary whitespace-nowrap">{{ $t('sidebar.userQuestion') }}
						<NuxtLink to="/UserPage">{{ $t('sidebar.ctaClick') }}</NuxtLink>
					</p>
				</div>
			</template>
		</AppSidebarComponent>
		<AppMapComponent
			ref="mapRef"
			@map-loaded="onMapLoaded"
			@gps-change="onGPSChange"
		/>
		<AppCoordinatesComponent ref="coordsRef" />
		<AppRoutingEngineComponent :map-instance="mapInstance" />
	</div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRoutingStore } from "@/stores/routingStore";

const { $DEBUG } = useNuxtApp();

const routingStore = useRoutingStore();
const route = useRoute();
const courierId = ref(route.query.courierId ?? null);

const coordsRef = ref(null);
const mapInstance = ref(null);
const onMapLoaded = (mapWrapper) => {
	if ($DEBUG) console.log("Map wrapper instance: ", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
	mapInstance.value = mapWrapper.map;
	routingStore.syncRoutingData(courierId.value);
};
const onGPSChange = (coords) => {
	routingStore.syncGPS([coords.coords.latitude, coords.coords.longitude]);
};
</script>
