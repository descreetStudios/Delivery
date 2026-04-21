<template>
	<div class="flex flex-col bg-bg-root h-full">
		<AppLoadingComponent
			v-if="!mapInstance"
			class="z-1000"
		/>
		<AppSidebarComponent>
			<template #sidebar>
				<!-- Courier Status -->
				<div class="mb-2 p-4 rounded-lg w-full bg-text-tertiary">
					<h2 class="mb-2 font-bold text-white text-lg">{{$t('RiderPage.courier')}} {{ courierId }}</h2>

					<!-- Active Order -->
					<div v-if="activeOrder.items != 0">
						<p class="mb-1 font-semibold text-success text-sm">{{$t('RiderPage.order')}}</p>
						<p class="mb-1 text-white text-sm">{{$t('RiderPage.id')}} {{ activeOrder.orderId }}</p>
						<p class="mb-1 text-white text-sm"><span class="font-semibold">{{$t('RiderPage.items')}} </span></p>
						<ul class="mb-2 ml-2 text-white text-sm">
							<li
								v-for="(item, index) in activeOrder.items"
								:key="index"
							>
								{{ item.quantity }}x {{ item.name }} - €{{ (item.price * item.quantity).toFixed(2) }}
							</li>
						</ul>
						<p class="mb-3 font-bold text-white text-sm">{{$t('RiderPage.total')}}{{ activeOrder.totalPrice.toFixed(2)
						}}</p>
						<button
							class="bg-warning disabled:bg-gray-300 px-4 py-2 rounded-lg w-full text-white disabled:text-gray-600 cursor-pointer disabled:cursor-not-allowed"
							:disabled="orderMessageDisabled"
							@click="orderStatusHandler"
						>
							{{ orderMessage }}
						</button>
					</div>

					<!-- Waiting State -->
					<div v-else>
						<p class="text-white text-center">{{$t('RiderPage.waiting')}}</p>
					</div>
				</div>
				<AppRoutingCardComponent
					v-if="routingStore.code === 'Ok' && activeOrder.items != 0"
					class="border-border-default border-b"
				/>
				<div>
					<p class="text-text-primary whitespace-nowrap">{{ $t('sidebar.userQuestion') }}
						<NuxtLink
							class="font-bold text-text-tertiary"
							to="/UserPage"
						>{{ $t('sidebar.ctaClick') }}</NuxtLink>
					</p>
				</div>
			</template>
		</AppSidebarComponent>
		<div class="pl-17.5 border-border-default border-b">
			<AppRoutingCardComponent v-if="routingStore.code === 'Ok' && activeOrder.items != 0 && width <= 640" />
		</div>
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
import { useOrderStore } from "@/stores/orderStore";
import { point } from "@turf/helpers";
import { distance } from "@turf/distance";
import { useWindowSize } from "@vueuse/core";

useHead({
	title: "Rider",
});

const { $DEBUG } = useNuxtApp();

const routingStore = useRoutingStore();
const { currentGPS, waypoints, code } = storeToRefs(routingStore);
const orderStore = useOrderStore();
const route = useRoute();
const courierId = ref(route.query.courierId ?? null);
const orderMessage = ref("");
const orderMessageDisabled = ref(true);
const restaurantDist = ref(0);
const destinationDist = ref(0);
const { width } = useWindowSize();

const coordsRef = ref(null);
const mapInstance = ref(null);
const { orderId, restaurant, destination, associatedCourierId, status, items, totalPrice } = storeToRefs(orderStore);
const activeOrder = computed(() => ({
	orderId: orderId.value,
	restaurant: restaurant.value,
	destination: destination.value,
	associatedCourierId: associatedCourierId.value,
	status: status.value,
	items: items.value,
	totalPrice: totalPrice.value,
}));

const onMapLoaded = (mapWrapper) => {
	if ($DEBUG) console.log("Map wrapper instance: ", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
	mapInstance.value = mapWrapper.map;
	routingStore.setCourierId(courierId.value);
	routingStore.syncRoutingData();
};

const onGPSChange = async (coords) => {
	await routingStore.syncGeolocation(
		[coords.coords.longitude, coords.coords.latitude],
		coords.coords.heading);

	if (code.value != "Ok") return;

	restaurantDist.value = distance(
		point(currentGPS.value),
		point(waypoints.value[1].location),
		{ units: "meters" },
	);
	destinationDist.value = distance(
		point(currentGPS.value),
		point(waypoints.value[2].location),
		{ units: "meters" },
	);

	if (restaurantDist.value <= 50 && activeOrder.value.status == "FETCHING") {
		orderMessage.value = "Pickup order from restaurant";
		orderMessageDisabled.value = false;
	}
	else if (destinationDist.value <= 50 && activeOrder.value.status == "DELIVERING") {
		orderMessage.value = "Complete order";
		orderMessageDisabled.value = false;
	}
	else {
		if (activeOrder.value.status == "FETCHING")
			orderMessage.value = "Reach restaurant";
		if (activeOrder.value.status == "DELIVERING")
			orderMessage.value = "Reach order destination";
		orderMessageDisabled.value = true;
	}
};

const orderStatusHandler = async () => {
	try {
		await orderStore.changeOrderStatus();
		if (activeOrder.value.status == "COMPLETED")
			activeOrder.value = null;
	} catch (error) {
		console.error("Error completing order:", error);
	}
};

// Start polling on mount
onMounted(() => {
	// Set courier ID first, then start polling
	if (courierId.value && courierId.value !== "0" && courierId.value !== "0000") {
		routingStore.setCourierId(courierId.value);
		routingStore.startOrderPolling();
	} else {
		if ($DEBUG) console.warn("Invalid courier ID, not starting polling:", courierId.value);
	}
});


// Cleanup polling on unmount
onBeforeUnmount(() => {
	routingStore.stopOrderPolling();
});
</script>
