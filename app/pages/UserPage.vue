<template>
	<div class="flex bg-root h-screen">
		<AppSidebarComponent>
			<template #sidebar>
				<AppSearchComponent
					@select="onSearchSelect"
					@select-civic="onSearchCivicSelect"
				/>
				<hr class="border-0.5 border-border-default w-full">
				<h2 class="text-text-primary"><span class="font-bold">Ristorante:</span> {{ ristorante }}</h2>
				<div
					v-if="ristorante"
					class="py-0.5 pr-0.5 border border-border-default rounded-lg"
				>
					<div class="gap-6 grid grid-cols-2 p-5 w-full max-h-132.5 overflow-y-auto scrollbar-custom">
						<AppFoodCardComponent
							name="Pizza margherita"
							imgsrc="https://eu.ooni.com/cdn/shop/articles/20220211142754-margherita-9920_0483214a-7057-4277-9a3b-f2ab17c01e13.jpg?v=1737105958&width=2048"
						/>
						<AppFoodCardComponent
							name="Penne alla puttanesca" 
							imgsrc="https://articafood.it/wp-content/uploads/ambientate/penne-alla-puttanesca.webp"
						/>
						<AppFoodCardComponent
							name="Trenette al pesto"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmuthcWkzYM27s3B2MySX5GyXmNkikC-6ca83VIeOyjwaBuJGgqlITRJsLLlyZjUSQC9NSXTY-pRpSQHBP3l57xT7gIXN-LrT3o810cg8T&s=10"
						/>
						<AppFoodCardComponent
							name="Bavette all'astice"
							imgsrc="https://www.sedanoallegro.it/sites/default/files/ricette/thumbnails/0_64d2fjl0_menu_astice_180412.jpg"
						/>
						<AppFoodCardComponent
							name="Risotto al fumo"
							imgsrc="https://blog.giallozafferano.it/pierobenigni/wp-content/uploads/2020/09/RAF2-scaled.jpg"
						/>
						
						<AppFoodCardComponent
							name="Braciola di maiale con patate"
							imgsrc="https://www.burrofuso.com/wp-content/uploads/2014/07/braciole-patate-maialino.jpg"
						/>
						<AppFoodCardComponent
							name="Pollo alla cacciatora"
							imgsrc="https://www.soniaperonaci.it/wp-content/uploads/2016/10/Pollo-alla-cacciatora-496x661.jpg"
						/>
						<AppFoodCardComponent
							name="Paillard di vitello"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYOFYLiwovV55rfkExsGJjKIDmlQND965tJQ&s"
						/>
						<AppFoodCardComponent
							name="Salmone alla griglia con salsa al limone"
							imgsrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6orMdnVk6GxJjYzt5ca0arTpETlRaNuEWfg&s"
						/>
						<AppFoodCardComponent
							name="Filetto al pepe verde"
							imgsrc="https://www.ciociariaecucina.it/wp-content/uploads/2025/10/Filetto-al-Pepe-Verde.jpg"
						/>
					</div>
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
const onMapLoaded = (mapWrapper) => {
	if ($DEBUG) console.log("Map wrapper instance: ", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
	mapInstance.value = mapWrapper.map;
};

const onSearchSelect = (item) => {
	if ($DEBUG) console.log("Search selected: ", item);
	if ($DEBUG) console.log("Map component: ", mapRef.value);
	mapRef.value.moveToWithBounds(item.center, item.boundingbox);
	mapRef.value.highlight(mapInstance.value, item);
};

const onSearchCivicSelect = (item) => {
	console.log("Search civic selected: ", item);
	if ($DEBUG) console.log("Map component: ", mapRef.value);
	mapRef.value.moveToWithBounds(item.center, item.boundingbox);
	mapRef.value.highlightCivic(mapInstance.value, item);
	ristorante.value = item.label;
};
</script>
