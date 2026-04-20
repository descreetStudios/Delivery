<template>
	<div class="flex bg-bg-root h-full">
		<AppLoadingComponent
			v-if="!mapInstance"
			class="z-1000"
		/>
		<AppSidebarComponent>
			<template #header>
				<div class="z-200 flex flex-row items-center mr-5 ml-auto">
					<div class="flex justify-center items-center bg-bg-secondary rounded-full w-7 h-7 text-md">{{ order.items.length }}</div>
					<UButton
						icon="i-heroicons-shopping-cart"
						color="neutral"
						variant="ghost"
						class="mt-1 size-10 text-text-primary cursor-pointer"
						@click="toggleCart"
					/>
				</div>
			</template>
			<template #sidebar>
				<AppSearchComponent
					v-if="!cartShown || width >= 925"
					@select="onSearchSelect"
					@select-civic="onSearchCivicSelect"
				/>
				<hr
					v-if="!cartShown || width >= 925"
					class="border-0.5 border-border-default w-full"
				>
				<h2
					v-if="restaurant != null && (!cartShown || width >= 925)"
					class="text-text-primary"
				><span
						class="font-bold"
					>
						{{ $t('UserPage.restaurant') }}:
					</span>
					{{ restaurant.label }}
				</h2>
				<div
					v-if="restaurant != null && (!cartShown || width >= 925)"
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
					class="z-200 flex flex-col items-center gap-2 bg-bg-root p-3"
				>
					<h1 class="top-0 flex text-text-primary text-xl">{{ $t('UserPage.order2') }}</h1>
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
						class="bg-bg-secondary disabled:bg-gray-300 my-auto px-2 py-2 rounded-lg disabled:text-gray-600 text-center cursor-pointer disabled:cursor-not-allowed"
						@click="sendOrder"
					>
						{{ $t('UserPage.submit') }}({{ totalPrice }}€)
					</button>
				</div>
				<div>
					<p class="text-text-primary whitespace-nowrap">{{ $t('sidebar.riderQuestion') }}
						<NuxtLink
							class="font-bold text-text-tertiary"
							to="/RiderPage"
						>{{ $t('sidebar.ctaClick') }}
						</NuxtLink>
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

		<AppStatusModalComponent
			v-model:visible="showOrderStatus"
			:title="orderStatus?.title"
			:order-id="orderStatus?.orderId"
			:message="orderStatus?.message"
			@click="closeOrderStatus"
		/>
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
const { t } = useI18n();

const orderId = computed(() => route.query.orderId ?? null);
const restaurant = ref(null);
const mapRef = ref(null);
const coordsRef = ref(null);
const mapInstance = ref(null);
const cartShown = ref(false);
const gpsCoords = ref({ latitude: 0, longitude: 0 });
const orderStatus = ref(null);
const showOrderStatus = ref(false);
const orderPollingInterval = ref(null);

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
		showOrderStatus.value = false;
		orderStatus.value = null;

		// Start polling for assignment
		startOrderStatusPolling(id);
	} catch (error) {
		console.log(error);
	}
};

const closeOrderStatus = () => {
	showOrderStatus.value = false;
	orderStatus.value = null;
};

const startOrderStatusPolling = (id) => {
	if ($DEBUG) console.log("startOrderStatusPolling called for order:", id);
	// Poll every 3 seconds to check if order is assigned to a courier
	orderPollingInterval.value = setInterval(async () => {
		try {
			const orderData = await orderStore.fetchOrder(id);
			if ($DEBUG) console.log("Polling order status:", orderData?.status, "assigned:", orderData?.associatedCourierId);

			if ((orderStatus.value && orderData) && orderStatus.value.status === orderData.status) return;

			// Check for status (COMPLETED)
			if (orderData && orderData.status === "COMPLETED") {
				orderStatus.value = {
					title: t("UserPage.delivered"),
					orderId: orderData.orderId,
					message: "Your order has been delivered to the delivery location!",
					status: orderData.status,
				};
				showOrderStatus.value = true;
				courierTrackingStore.stopTracking();
				stopOrderStatusPolling();
				return;
			}

			// Check for status (QUEUED)
			if (orderData && orderData.status === "QUEUED") {
				orderStatus.value = {
					title: t("UserPage.queued"),
					orderId: orderData.orderId,
					message: "Your order has been added to the queue!",
					status: orderData.status,
				};
				showOrderStatus.value = true;
				return;
			}

			// Check for status (DELIVERING)
			if (orderData && orderData.status === "DELIVERING") {
				orderStatus.value = {
					title: t("UserPage.delivering"),
					orderId: orderData.orderId,
					message: "Your order has been picked up from the pickup location!",
					status: orderData.status,
				};
				showOrderStatus.value = true;
				return;
			}

			// Check if assigned to courier
			if (orderData && orderData.associatedCourierId && orderData.associatedCourierId !== "0") {
				if ($DEBUG) console.log("Showing assigned status for order:", id);
				orderStatus.value = {
					title: t("UserPage.assigned"),
					orderId: orderData.orderId,
					message: "Your order has been assigned to a courier!",
					status: orderData.status,
				};
				showOrderStatus.value = true;

				// Start tracking the courier
				courierTrackingStore.startTracking(orderData.associatedCourierId);
				return;
			} else {
				if ($DEBUG) console.log("Already showed assigned status for order:", id);
			}
			// Continue polling to detect completion
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
		startOrderStatusPolling(orderId.value);
	}
});

onUnmounted(() => {
	stopOrderStatusPolling();
	courierTrackingStore.stopTracking();
});

// Watch courier location changes and update map
watch(
	() => courierTrackingStore.courierLocation,
	(newLocation) => {
		if (mapRef.value) {
			if (newLocation) {
				const coords = [newLocation.longitude, newLocation.latitude];
				if ($DEBUG) console.log("Updating courier pin on map:", coords);
				mapRef.value.showCourierPin(coords);
			}
			else {
				mapRef.value.hideCourierPin();
			}
		}
	},
	{ deep: true },
);
</script>
