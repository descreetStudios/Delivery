<template>
	<div class="flex flex-col bg-root h-full">
		<AppLoadingComponent
			v-if="!mapInstance"
			class="z-1000"
		/>
		<AppSidebarComponent>
			<template #sidebar>
				<!-- Courier Status -->
				<div class="bg-bg-surface p-4 mb-2 border border-border-default rounded-lg">
					<h2 class="text-lg font-bold text-text-primary mb-2">🚚 Courier {{ courierId }}</h2>
					
					<!-- Active Order -->
					<div v-if="activeOrder">
						<p class="text-sm text-success font-semibold mb-1">✅ Order Assigned</p>
						<p class="text-sm text-text-secondary mb-1">Order ID: {{ activeOrder.orderId }}</p>
						<p class="text-sm text-text-primary mb-1"><span class="font-semibold">Items:</span></p>
						<ul class="text-sm text-text-primary ml-2 mb-2">
							<li v-for="(item, index) in activeOrder.items" :key="index">
								{{ item.quantity }}x {{ item.name }} - €{{ (item.price * item.quantity).toFixed(2) }}
							</li>
						</ul>
						<p class="text-sm text-text-primary font-bold mb-3">Total: €{{ activeOrder.totalPrice.toFixed(2) }}</p>
						<button
							class="bg-warning px-4 py-2 rounded-full text-white w-full"
							@click="completeOrder"
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

const routingStore = useRoutingStore();
const route = useRoute();
const courierId = ref(route.query.courierId ?? null);
const orderPollingInterval = ref(null);

const coordsRef = ref(null);
const mapInstance = ref(null);
const activeOrder = ref(null);

const onMapLoaded = (mapWrapper) => {
	coordsRef.value.bindMap(mapWrapper);
	mapInstance.value = mapWrapper.map;
	routingStore.setCourierId(courierId.value);
	routingStore.syncRoutingData();

	sendInitialLocation();
};

// Start polling on mount
onMounted(() => {
	routingStore.setCourierId(courierId.value);
	startOrderPolling();
});

const startOrderPolling = () => {
	if (orderPollingInterval.value) {
		clearInterval(orderPollingInterval.value);
	}

	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase || "http://localhost:8080/api";

	fetchAndSetActiveOrder(apiBase);
	orderPollingInterval.value = setInterval(async () => {
		await fetchAndSetActiveOrder(apiBase);
	}, 3000);
};

const fetchAndSetActiveOrder = async (apiBase) => {
	if (!courierId.value) return;
	try {
		const fullCourierId = courierId.value.startsWith("courier") ? courierId.value : "courier" + courierId.value;
		const order = await $fetch(`${apiBase}/orders/courier/${fullCourierId}/active`, {
			cache: "no-store",
		});
		activeOrder.value = order;
	} catch {
		activeOrder.value = null;
	}
};

const onGPSChange = async (coords) => {
	await routingStore.syncGeolocation([coords.coords.longitude, coords.coords.latitude], coords.coords.heading);
};

// Get user's current position and send to backend via WebSocket
const sendInitialLocation = async () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async (position) => {
			await routingStore.syncGeolocation(
				[position.coords.longitude, position.coords.latitude],
				position.coords.heading || 0
			);
		}, (error) => {
			console.error("Failed to get initial location:", error);
		}, { enableHighAccuracy: true });
	}
};

const completeOrder = async () => {
	try {
		const orderId = activeOrder.value.orderId;
		const fullCourierId = courierId.value.startsWith("courier") ? courierId.value : "courier" + courierId.value;
		const config = useRuntimeConfig();
		const apiBase = config.public.apiBase || "http://localhost:8080/api";

		await $fetch(`${apiBase}/orders/${orderId}/complete?courierId=${fullCourierId}`, {
			method: "PUT",
		});

		activeOrder.value = null;
		await fetchAndSetActiveOrder(apiBase);
	} catch (error) {
		console.error("Error completing order:", error);
	}
};

// Cleanup polling on unmount
onUnmounted(() => {
	if (orderPollingInterval.value) {
		clearInterval(orderPollingInterval.value);
	}
});
</script>
