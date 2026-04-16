<template>
	<div class="flex bg-bg-home h-full">
		<AppLoadingComponent
			v-if="!mapInstance"
			class="z-1000"
		/>
		<AppSidebarComponent>
			<template #header>
				<div class="z-200 flex flex-row items-center mr-5 ml-auto">
					<div class="flex justify-center items-center bg-bg-secondary-home rounded-full w-7 h-7 text-md">{{ order.items.length }}</div>
					<UButton
						icon="i-heroicons-shopping-cart"
						color="neutral"
						variant="ghost"
						class="mt-1 size-10 text-black cursor-pointer"
						@click="toggleCart"
					/>
				</div>
			</template>
			<template #sidebar>
				<AppSearchComponent
					v-if="!cartShown || width>=925"
					@select="onSearchSelect"
					@select-civic="onSearchCivicSelect"
				/>
				<hr
					v-if="!cartShown || width>=925"
					class="border-0.5 border-border-default w-full"
				>
				<h2
					v-if="restaurant != null && (!cartShown || width>=925)"
					class="text-black"
				><span class="font-bold">{{
					$t('UserPage.restaurant') }}:</span> {{ restaurant.label }}</h2>
				<div
					v-if="restaurant != null && (!cartShown || width>=925)"
					class="py-0.5 pr-0.5 border border-border-default rounded-lg"
				>
					<div
						class="gap-6 grid grid-cols-2 p-5 w-full h-fit md:max-h-132.5 overflow-hidden md:overflow-y-auto scrollbar-custom"
					>
						<AppFoodCardComponent
							name="Pizza margherita"
							:price="5.5"
							imgsrc="https://eu.ooni.com/cdn/shop/articles/20220211142754-margherita-9920_0483214a-7057-4277-9a3b-f2ab17c01e13.jpg?v=1737105958&width=2048"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Penne alla puttanesca"
							:price="9"
							imgsrc="https://articafood.it/wp-content/uploads/ambientate/penne-alla-puttanesca.webp"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Trenette al pesto"
							:price="9"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmuthcWkzYM27s3B2MySX5GyXmNkikC-6ca83VIeOyjwaBuJGgqlITRJsLLlyZjUSQC9NSXTY-pRpSQHBP3l57xT7gIXN-LrT3o810cg8T&s=10"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Bavette all'astice"
							:price="12"
							imgsrc="https://www.sedanoallegro.it/sites/default/files/ricette/thumbnails/0_64d2fjl0_menu_astice_180412.jpg"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Risotto al fumo"
							:price="10"
							imgsrc="https://blog.giallozafferano.it/pierobenigni/wp-content/uploads/2020/09/RAF2-scaled.jpg"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Braciola di maiale con patate"
							:price="10"
							imgsrc="https://www.burrofuso.com/wp-content/uploads/2014/07/braciole-patate-maialino.jpg"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Pollo alla cacciatora"
							:price="14"
							imgsrc="https://www.soniaperonaci.it/wp-content/uploads/2016/10/Pollo-alla-cacciatora-496x661.jpg"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Paillard di vitello"
							:price="11"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYOFYLiwovV55rfkExsGJjKIDmlQND965tJQ&s"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Salmone alla griglia con salsa al limone"
							:price="13"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6orMdnVk6GxJjYzt5ca0arTpETlRaNuEWfg&s"
							@send-item="order.items.push($event)"
						/>
						<AppFoodCardComponent
							name="Filetto al pepe verde"
							:price="15"
							imgsrc="https://www.ciociariaecucina.it/wp-content/uploads/2025/10/Filetto-al-Pepe-Verde.jpg"
							@send-item="order.items.push($event)"
						/>
					</div>
				</div>
				<div
					v-if="cartShown"
					:class="[
						// Mobile / Tablet
						'absolute top-0 left-0 w-full h-full',

						// Desktop
						'min-[925px]:fixed min-[925px]:left-105 min-[925px]:w-105 min-[925px]:h-150 min-[925px]:mt-2 min-[925px]:ml-5 min-[925px]:border min-[925px]:border-border-default min-[925px]:rounded-sm'
					]"
					class="z-200 flex flex-col items-center gap-2 bg-bg-home p-3"
				>
					<h1 class="top-0 flex text-black text-xl">Ordine</h1>
					<div class="mt-4 min-[925px]:mt-0 py-0.5 pr-0.5 border border-border-default rounded-lg">
						<div class="flex flex-col gap-3 p-3 w-90 h-121 overflow-y-auto scrollbar-custom">
							<AppOrderComponent
								v-for="(o, index) in order.items"
								:key="index"
								:name="o.name"
								:price="o.price"
								@delete-item="order.items.splice(index, 1)"
							/>
						</div>
					</div>
					<button
						:disabled="order.items.length === 0"
						class="bg-bg-secondary-home disabled:bg-gray-300 my-auto px-2 py-2 rounded-lg disabled:text-gray-600 text-center cursor-pointer disabled:cursor-not-allowed"
						@click="sendOrder"
					>
						Invia il tuo ordine ({{ totalPrice }}€)
					</button>
				</div>
				<div>
					<p class="text-black whitespace-nowrap">{{ $t('sidebar.riderQuestion') }}
						<NuxtLink to="/RiderPage">{{ $t('sidebar.ctaClick') }}</NuxtLink>
					</p>
				</div>
			</template>
		</AppSidebarComponent>
		<AppMapComponent
			ref="mapRef"
			:is-user-page="true"
			@map-loaded="onMapLoaded"
			@gps-change="onGPSChange"
		/>
		<AppCoordinatesComponent ref="coordsRef" />

		<!-- Order Status Modal -->
		<div
			v-if="showOrderStatus"
			class="top-0 left-0 z-1000 fixed flex justify-center items-center bg-black/30 backdrop-blur-sm w-full h-full"
			@click="closeOrderStatus"
		>
			<div
				class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 border border-gray-200 dark:border-gray-700 rounded-lg max-w-md"
				@click.stop
			>
				<h2 class="mb-4 font-bold text-gray-900 dark:text-white text-xl">
					{{ orderStatus?.assigned ? '✅ Order Assigned' : '⏳ Order Queued' }}
				</h2>
				<div class="space-y-2 text-gray-800 dark:text-gray-200">
					<p><span class="font-semibold">Order ID:</span> {{ orderStatus?.orderId }}</p>
					<p><span class="font-semibold">Status:</span> {{ orderStatus?.message }}</p>
					<p
						v-if="!orderStatus?.assigned"
						class="mt-2 text-gray-600 dark:text-gray-400 text-sm"
					>
						Your order will be assigned to the nearest available courier as soon as one becomes free.
					</p>
				</div>
				<button
					class="bg-blue-500 hover:bg-blue-600 mt-4 px-4 py-2 rounded-full w-full text-white transition-colors"
					@click="closeOrderStatus"
				>
					Close
				</button>
			</div>
		</div>

		<!-- Delivery Status Modal -->
		<div
			v-if="showDeliveryStatus"
			class="top-0 left-0 z-1000 fixed flex justify-center items-center bg-black/30 backdrop-blur-sm w-full h-full"
			@click="closeDeliveryStatus"
		>
			<div
				class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 border border-gray-200 dark:border-gray-700 rounded-lg max-w-md"
				@click.stop
			>
				<h2 class="mb-4 font-bold text-gray-900 dark:text-white text-xl">
					✅ Order Delivered
				</h2>
				<div class="space-y-2 text-gray-800 dark:text-gray-200">
					<p><span class="font-semibold">Order ID:</span> {{ deliveryStatus?.orderId }}</p>
					<p><span class="font-semibold">Status:</span> {{ deliveryStatus?.message }}</p>
				</div>
				<button
					class="bg-blue-500 hover:bg-blue-600 mt-4 px-4 py-2 rounded-full w-full text-white transition-colors"
					@click="closeDeliveryStatus"
				>
					Close
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";
import { useCourierTrackingStore } from "@/stores/courierTrackingStore";
import { useWindowSize } from "@vueuse/core";

useHead({
	title: "Order",
});

const { $DEBUG } = useNuxtApp();
const { width } = useWindowSize();
const orderStore = useOrderStore();
const courierTrackingStore = useCourierTrackingStore();
const router = useRouter();
const route = useRoute();

const orderId = computed(() => route.query.orderId ?? null);
const restaurant = ref(null);
const mapRef = ref(null);
const coordsRef = ref(null);
const mapInstance = ref(null);
const cartShown = ref(false);
const gpsCoords = ref({ latitude: 0, longitude: 0 });
const orderStatus = ref(null); // To track order status after submission
const showOrderStatus = ref(false); // To show order status modal
const orderPollingInterval = ref(null); // Interval for polling order status
const deliveryStatus = ref(null); // To track delivery status after completion
const showDeliveryStatus = ref(false); // To show delivery confirmation modal
const hasShownAssignedStatus = ref(false); // Track if we've already shown the assigned status

const totalPrice = computed(() => {
	return order.value.items.reduce((sum, item) => {
		return sum + item.price;
	}, 0);
});

const onMapLoaded = (mapWrapper) => {
	if ($DEBUG) console.log("Map wrapper instance: ", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
	mapWrapper.value = mapWrapper;
	mapInstance.value = mapWrapper.map;
};

const onGPSChange = (coords) => {
	if ($DEBUG) console.log("GPS coordinates changed: ", coords);
	gpsCoords.value.latitude = coords.coords.latitude;
	gpsCoords.value.longitude = coords.coords.longitude;
};

const order = ref({
	id: "0",
	restaurant: {},
	destination: {},
	items: [],
	total: 0,
});

const toggleCart = () => {
	cartShown.value = !cartShown.value;
};

const sendOrder = async () => {
	try {
		if (!restaurant.value) {
			return;
		}
		const orderCopy = JSON.parse(JSON.stringify(order.value));
		const [longitude, latitude] = restaurant.value.center;
		orderCopy.restaurant = { latitude, longitude };
		orderCopy.destination = { ...gpsCoords.value };
		orderCopy.total = orderCopy.items.reduce((sum, item) => sum + item.price, 0);

		if ($DEBUG) console.log("Sending order:", orderCopy);
		const id = await orderStore.submitOrder(orderCopy);
		orderCopy.id = id;
		router.replace({
			query: {
				...route.query,
				orderId: id,
			},
		});

		order.value.items = [];

		// Reset status flags for new order
		hasShownAssignedStatus.value = false;
		showOrderStatus.value = false;
		orderStatus.value = null;

		// Start polling for assignment - checkOrderStatus will be called by polling
		startOrderStatusPolling(id);
	} catch (error) {
		console.log(error);
	}
};

const closeOrderStatus = () => {
	showOrderStatus.value = false;
	orderStatus.value = null;
	// DON'T reset hasShownAssignedStatus here - it should stay true
	// so the modal doesn't show again on subsequent polls
};

const closeDeliveryStatus = () => {
	showDeliveryStatus.value = false;
	deliveryStatus.value = null;
};

const checkOrderStatus = async (id) => {
	try {
		const order = await orderStore.fetchOrder(id);
		if (order) {
			const isAssigned = order.associatedCourierId && order.associatedCourierId !== "0";
			orderStatus.value = {
				orderId: order.orderId,
				assigned: isAssigned,
				message: isAssigned
					? "Your order has been assigned to a courier!"
					: "Your order is waiting in the queue for a courier.",
				courierId: order.associatedCourierId,
			};

			// If assigned to courier, start tracking
			if (isAssigned && order.associatedCourierId) {
				courierTrackingStore.startTracking(order.associatedCourierId);
			}

			showOrderStatus.value = true;
		}
	} catch (error) {
		if ($DEBUG) console.error("Error checking order status:", error);
	}
};

const startOrderStatusPolling = (id) => {
	console.log("startOrderStatusPolling called for order:", id);
	// Poll every 3 seconds to check if order is assigned to a courier
	orderPollingInterval.value = setInterval(async () => {
		try {
			const orderData = await orderStore.fetchOrder(id);
			console.log("Polling order status:", orderData?.status, "assigned:", orderData?.associatedCourierId);

			// Check for delivery completion first
			if (orderData && orderData.status === "COMPLETED") {
				if (!deliveryStatus.value?.delivered) {
					deliveryStatus.value = {
						orderId: orderData.orderId,
						delivered: true,
						message: "Your order has been delivered to the delivery location!",
					};
					showDeliveryStatus.value = true;
					stopOrderStatusPolling();
				}
				return;
			}

			// Check if assigned to courier
			if (orderData && orderData.associatedCourierId && orderData.associatedCourierId !== "0") {
				// Order has been assigned to a courier
				if (!hasShownAssignedStatus.value) {
					console.log("Showing assigned status for order:", id);
					// Update status and show notification
					orderStatus.value = {
						orderId: orderData.orderId,
						assigned: true,
						message: "Your order has been assigned to a courier!",
						courierId: orderData.associatedCourierId,
					};
					showOrderStatus.value = true;
					hasShownAssignedStatus.value = true;

					// Start tracking the courier
					courierTrackingStore.startTracking(orderData.associatedCourierId);
				} else {
					console.log("Already showed assigned status for order:", id);
				}
				// Continue polling to detect completion
			}
		} catch (error) {
			// Silently handle 404 errors (order not found) without throwing
			if (error?.status === 404) {
				if ($DEBUG) console.warn("Order not found, stopping polling");
				stopOrderStatusPolling();
			} else if ($DEBUG) {
				console.error("Error polling order status:", error);
			}
		}
	}, 3000);
};

const stopOrderStatusPolling = () => {
	if (orderPollingInterval.value) {
		clearInterval(orderPollingInterval.value);
		orderPollingInterval.value = null;
	}
};

const onSearchSelect = (item) => {
	if ($DEBUG) console.log("Search selected: ", item);
	if ($DEBUG) console.log("Map component: ", mapRef.value);
	mapRef.value.moveToWithBounds(item.center, item.boundingbox);
	mapRef.value.highlight(mapInstance.value, item);
};

const onSearchCivicSelect = (item) => {
	if ($DEBUG) console.log("Search civic selected: ", item);
	if ($DEBUG) console.log("Map component: ", mapRef.value);
	mapRef.value.moveToWithBounds(item.center, item.boundingbox);
	mapRef.value.highlightCivic(mapInstance.value, item);
	restaurant.value = item;
};

onMounted(async () => {
	if (orderId.value !== "0000") {
		const order = await orderStore.fetchOrder(orderId.value);
		// If order exists and has a courier, start tracking
		if (order && order.associatedCourierId && order.associatedCourierId !== "0") {
			courierTrackingStore.startTracking(order.associatedCourierId);
		}
	}
});

onUnmounted(() => {
	stopOrderStatusPolling();
	courierTrackingStore.stopTracking();
	hasShownAssignedStatus.value = false;
});

// Watch courier location changes and update map
watch(
	() => courierTrackingStore.courierLocation,
	(newLocation) => {
		if (newLocation && mapRef.value) {
			const coords = [newLocation.longitude, newLocation.latitude];
			if ($DEBUG) console.log("Updating courier pin on map:", coords);
			mapRef.value.showCourierPin(coords);
		}
	},
	{ deep: true },
);
</script>
