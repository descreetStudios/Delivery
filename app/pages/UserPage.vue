<template>
	<div class="flex bg-root h-screen">
		<AppSidebarComponent>
			<template #sidebar>
				<AppSearchComponent
					@select="onSearchSelect"
					@select-civic="onSearchCivicSelect"
				/>
				<hr class="border-0.5 border-border-default w-full">
				<h2 class="text-text-primary">Ristorante: {{ ristorante }}</h2>
				<div class="py-0.5 pr-0.5 border border-border-default rounded-lg">
					<div class="gap-6 grid grid-cols-2 p-5 w-full max-h-132.5 overflow-y-auto scrollbar-custom">
						<AppFoodCardComponent />
						<AppFoodCardComponent />
						<AppFoodCardComponent />
						<AppFoodCardComponent />
						<AppFoodCardComponent />
						<AppFoodCardComponent />
						<AppFoodCardComponent />
						<AppFoodCardComponent />
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
