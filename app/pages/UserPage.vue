<template>
	<div class="flex bg-root h-screen">
		<AppSidebarComponent>
			<template #header>
				<UButton
					icon="i-heroicons-shopping-cart"
					color="neutral"
					variant="ghost"
					class="flex justify-center items-center ml-auto pr-5 size-17 text-text-primary"
					@click="toggleCart"
				/>
			</template>
			<template #sidebar>
				<AppSearchComponent
					@select="onSearchSelect"
					@select-civic="onSearchCivicSelect"
				/>
				<hr class="border-0.5 border-border-default w-full">
				<h2
					v-if="ristorante"
					class="text-text-primary"
				><span class="font-bold">{{$t('UserPage.restaurant')}}:</span> {{ ristorante }}</h2>
				<div
					v-if="ristorante"
					class="py-0.5 pr-0.5 border border-border-default rounded-lg"
				>
					<div class="gap-6 grid grid-cols-2 p-5 w-full max-h-132.5 overflow-y-auto scrollbar-custom">
						<AppFoodCardComponent
							name="Pizza margherita"
							:price="5.5"
							imgsrc="https://eu.ooni.com/cdn/shop/articles/20220211142754-margherita-9920_0483214a-7057-4277-9a3b-f2ab17c01e13.jpg?v=1737105958&width=2048"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Penne alla puttanesca"
							:price="9"
							imgsrc="https://articafood.it/wp-content/uploads/ambientate/penne-alla-puttanesca.webp"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Trenette al pesto"
							:price="9"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmuthcWkzYM27s3B2MySX5GyXmNkikC-6ca83VIeOyjwaBuJGgqlITRJsLLlyZjUSQC9NSXTY-pRpSQHBP3l57xT7gIXN-LrT3o810cg8T&s=10"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Bavette all'astice"
							:price="12"
							imgsrc="https://www.sedanoallegro.it/sites/default/files/ricette/thumbnails/0_64d2fjl0_menu_astice_180412.jpg"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Risotto al fumo"
							:price="10"
							imgsrc="https://blog.giallozafferano.it/pierobenigni/wp-content/uploads/2020/09/RAF2-scaled.jpg"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Braciola di maiale con patate"
							:price="10"
							imgsrc="https://www.burrofuso.com/wp-content/uploads/2014/07/braciole-patate-maialino.jpg"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Pollo alla cacciatora"
							:price="14"
							imgsrc="https://www.soniaperonaci.it/wp-content/uploads/2016/10/Pollo-alla-cacciatora-496x661.jpg"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Paillard di vitello"
							:price="11"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYOFYLiwovV55rfkExsGJjKIDmlQND965tJQ&s"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Salmone alla griglia con salsa al limone"
							:price="13"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6orMdnVk6GxJjYzt5ca0arTpETlRaNuEWfg&s"
							@send-order="orders.push($event)"
						/>
						<AppFoodCardComponent
							name="Filetto al pepe verde"
							:price="15"
							imgsrc="https://www.ciociariaecucina.it/wp-content/uploads/2025/10/Filetto-al-Pepe-Verde.jpg"
							@send-order="orders.push($event)"
						/>
					</div>
				</div>
				<div
					v-if="cartShown"
					class="top-0 left-105 fixed flex flex-col items-center gap-2 bg-bg-surface mt-2 ml-5 p-3 border border-border-default rounded-sm w-105 h-150"
				>
					<h1 class="top-0 flex text-text-primary text-xl">Ordine</h1>
					<div class="py-0.5 pr-0.5 border border-border-default rounded-lg">
						<div class="flex flex-col gap-3 p-3 w-90 h-121 overflow-y-auto scrollbar-custom">
							<AppOrderComponent
								v-for="(order, index) in orders"
								:key="index"
								:name="order.name"
								:price="order.price"
								@delete-order="orders.splice(index, 1)"
							/>
						</div>
					</div>
					<button
						:disabled="orders.length === 0"
						class="bg-warning disabled:bg-gray-300 my-auto px-2 py-2 border border-border-default rounded-full disabled:text-gray-600 text-center disabled:cursor-not-allowed surface"
						@click="sendOrder"
					>
						Invia il tuo ordine
					</button>
				</div>
				<div>
					<p class="text-text-primary whitespace-nowrap">{{ $t('sidebar.riderQuestion') }}
						<NuxtLink to="/RiderPage">{{ $t('sidebar.ctaClick') }}</NuxtLink>
					</p>
				</div>
			</template>
		</AppSidebarComponent>
		<AppMapComponent
			ref="mapRef"
			@map-loaded="onMapLoaded"
		/>
		<AppCoordinatesComponent ref="coordsRef" />
	</div>
</template>

<script setup>
const { $DEBUG } = useNuxtApp();

const ristorante = ref(null);

const mapRef = ref(null);
const coordsRef = ref(null);
const mapInstance = ref(null);
const cartShown = ref(false);
const onMapLoaded = (mapWrapper) => {
	if ($DEBUG) console.log("Map wrapper instance: ", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
	mapInstance.value = mapWrapper.map;
};

const orders = ref([]);

const toggleCart = () => {
	cartShown.value = !cartShown.value;
};

const sendOrder = () => {
	console.log("Sending order: ", orders.value);
	// Here you would typically send the order to your backend or an API
	// For this example, we'll just clear the cart and log the order
	orders.value = [];
	alert("Ordine inviato!");
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
	ristorante.value = item.label;
};
</script>
