<template>
	<div class="flex bg-root h-screen">
		<SidebarComponent>
			<template #sidebar>
				<SearchComponent
					@select="onSearchSelect"
					@select-civic="onSearchCivicSelect"
				/>
				<div class="items-center gap-5 grid grid-cols-4 p-5 border border-border-default rounded-2xl w-full">
					<FoodCardComponent />
					<FoodCardComponent />
					<FoodCardComponent />
					<FoodCardComponent />
				</div>
				<div>
					<p class="whitespace-nowrap">Hey, are you a rider?
						<NuxtLink to="/RiderPage">Click here!</NuxtLink>
					</p>
				</div>
			</template>
		</SidebarComponent>
		<MapComponent
			ref="mapRef"
			@map-loaded="onMapLoaded"
		/>
		<CoordinatesComponent ref="coordsRef" />
	</div>
</template>

<script setup>
const DEBUG = false;

const mapRef = ref(null);
const coordsRef = ref(null);
const mapInstance = ref(null);
const onMapLoaded = (mapWrapper) => {
	if (DEBUG) console.log("Map wrapper instance:", mapWrapper);
	coordsRef.value.bindMap(mapWrapper);
	mapInstance.value = mapWrapper.map;
};

const onSearchSelect = (item) => {
	if (DEBUG) console.log("Search selected: ", item);
	if (DEBUG) console.log("Map component", mapRef.value);
	mapRef.value.moveToWithBounds(item.center, item.boundingbox);
	mapRef.value.highlight(mapInstance.value, item);
};

const onSearchCivicSelect = (item) => {
	if (DEBUG) console.log("Search civic selected: ", item);
	if (DEBUG) console.log("Map component", mapRef.value);
	mapRef.value.moveToWithBounds(item.center, item.boundingbox);
	mapRef.value.highlightCivic(mapInstance.value, item);
};
</script>
