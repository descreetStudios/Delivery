<template>
	<div class="flex flex-col bg-root h-full">
		<AppLoadingComponent
			v-if="!mapInstance"
			class="z-1000"
		/>
		<AppSidebarComponent>
			<template #sidebar>
				<!-- Courier Status -->
				<div class="bg-bg-surface mb-2 p-4 border border-border-default rounded-lg">
					<h2 class="mb-2 font-bold text-text-primary text-lg">🚚 Courier {{ courierId }}</h2>

					<!-- Active Order -->
					<div v-if="activeOrder.items!=0">
						<p class="mb-1 font-semibold text-success text-sm">✅ Order Assigned</p>
						<p class="mb-1 text-text-secondary text-sm">Order ID: {{ activeOrder.orderId }}</p>
						<p class="mb-1 text-text-primary text-sm"><span class="font-semibold">Items:</span></p>
						<ul class="mb-2 ml-2 text-text-primary text-sm">
							<li
								v-for="(item, index) in activeOrder.items"
								:key="index"
							>
								{{ item.quantity }}x {{ item.name }} - €{{ (item.price * item.quantity).toFixed(2) }}
							</li>
						</ul>
						<p class="mb-3 font-bold text-text-primary text-sm">Total: €{{ activeOrder.totalPrice.toFixed(2)
						}}</p>
						<button
							class="bg-warning px-4 py-2 rounded-full w-full text-white"
							@click="completeOrderHandler"
						>
							✅ Complete Order
						</button>
					</div>

					<!-- Waiting State -->
					<div v-else>
						<p class="text-text-primary text-center">⏳ Waiting for orders...</p>
					</div>
				</div>
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
import { useOrderStore } from "@/stores/orderStore";

const { $DEBUG } = useNuxtApp();

const routingStore = useRoutingStore();
const orderStore = useOrderStore();
const route = useRoute();
const courierId = ref(route.query.courierId ?? null);

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

// Start polling on mount
onMounted(() => {
	routingStore.startOrderPolling();
});

const onGPSChange = async (coords) => {
	await routingStore.syncGeolocation([coords.coords.longitude, coords.coords.latitude], coords.coords.heading);
};

const completeOrderHandler = async () => {
	try {
		orderStore.completeOrder(courierId.value);
		activeOrder.value = null;
	} catch (error) {
		console.error("Error completing order:", error);
	}
};

// Cleanup polling on unmount
onBeforeUnmount(() => {
	routingStore.stopOrderPolling();
});
</script>
