<template>
	<div class="flex flex-col bg-root h-screen">
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
			@gps-change="handleGPSChange"
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
const handleGPSChange = (e)=>{
	routingStore.syncGPS([e.coords.latitude, e.coords.longitude]);
};
</script>
