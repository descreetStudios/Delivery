<template>
	<div class="flex flex-col bg-gray-50 h-screen">
		<!-- Map Container -->
		<div class="flex-1">
			<MapComponent 
				@map-loaded="onMapLoaded"
			/>
		</div>
	</div>
</template>

<script setup>
const onMapLoaded = (map) => {
	console.log("Successfully loaded the map!", map);
};
</script>