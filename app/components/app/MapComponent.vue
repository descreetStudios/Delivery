<template>
	<div class="relative w-full h-full">
		<ClientOnly>
			<MglMap
				ref="mapWrapperInstance"
				:center="mapCenter"
				:zoom="mapZoom"
				:map-style="mapStyle"
				@map:load="handleMapLoad"
			>
				<MglImage
					id="pin-icon"
					url="/images/pin-icon.png"
				/>

				<MglGeoJsonSource
					v-if="showPin"
					source-id="point"
					:data="pinIconGeojsonSource"
				>
					<MglSymbolLayer
						layer-id="pin-layer"
						:layout="pinIconLayout"
					/>
				</MglGeoJsonSource>

				<MglNavigationControl position="top-right" />
				<MglFullscreenControl position="top-right" />
				<MglGeolocateControl
					position="top-right"
					:track-user-location="true"
					:position-options="{ enableHighAccuracy: true, maximumAge: 0 }"
				/>
				<MglScaleControl position="bottom-left" />
			</MglMap>
		</ClientOnly>
	</div>
</template>

<script setup>
const { $DEBUG } = useNuxtApp();

const props = defineProps({
	center: {
		type: Array,
		default: () => [9.18969, 45.46409],
	},
	zoom: {
		type: Number,
		default: 9,
	},
	styleUrl: {
		type: String,
		default: "https://tiles.openfreemap.org/styles/liberty",
	},
});

const mapWrapperInstance = ref(null);
const mapCenter = ref(props.center);
const mapZoom = ref(props.zoom);
const mapStyle = ref(props.styleUrl);

const pinCoordinates = ref([0, 0]);
const showPin = ref(false);

const pinIconGeojsonSource = computed(() => ({
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: pinCoordinates.value,
			},
			properties: {
				symbol: "pin-icon",
			},
		},
	],
}));

const pinIconLayout = {
	"icon-image": ["get", "symbol"],
	"icon-size": 1,
	"icon-anchor": "bottom",
	"icon-offset": [0, -15],
};

const emit = defineEmits(["map-loaded", "map-click"]);

const updatePinPosition = (coordinates) => {
	pinCoordinates.value = coordinates;
	showPin.value = true;
};

const hidePin = () => {
	showPin.value = false;
};

const handleMapLoad = (mapWrapper) => {
	if ($DEBUG) console.log("Loaded Map Component");
	emit("map-loaded", mapWrapper);

	const map = mapWrapper.map;

	map.setProjection({
		type: ["interpolate", ["linear"], ["zoom"], 0, "globe", 12, "mercator"],
	});
};

const fetchAndHighlightGeometry = async (map, item) => {
	if (map.getLayer("region-border")) map.removeLayer("region-border");
	if (map.getLayer("region-fill")) map.removeLayer("region-fill");
	if (map.getSource("region-geometry")) map.removeSource("region-geometry");

	try {
		const osmType = item.osm_type.charAt(0).toUpperCase();
		const response = await fetch(
			`https://nominatim.openstreetmap.org/lookup?osm_ids=${osmType}${item.osm_id}&format=geojson&polygon_geojson=1`,
		);

		const data = await response.json();

		const geometry = data.features[0].geometry;

		map.addSource("region-geometry", {
			type: "geojson",
			data: {
				type: "Feature",
				geometry,
			},
		});

		map.addLayer({
			id: "region-fill",
			type: "fill",
			source: "region-geometry",
			paint: {
				"fill-color": "#4287f5",
				"fill-opacity": 0.05,
			},
		});

		map.addLayer({
			id: "region-border",
			type: "line",
			source: "region-geometry",
			paint: {
				"line-color": "#4287f5",
				"line-width": 3,
			},
		});
		hidePin();
	} catch (err) {
		console.error("Error fetching geometry:", err);
		showPointMarker(item);
	}
};

const fetchAndHighlightCivicGeometry = (map, item) => {
	if (map.getLayer("region-border")) map.removeLayer("region-border");
	if (map.getLayer("region-fill")) map.removeLayer("region-fill");
	if (map.getSource("region-geometry")) map.removeSource("region-geometry");

	showPointMarker(item);
};

const showPointMarker = (item) => {
	if ($DEBUG) console.log("Centered item: ", item.center);
	updatePinPosition(item.center);
};

const calculateZoomFromBounds = (boundingbox) => {
	const south = parseFloat(boundingbox[0]);
	const north = parseFloat(boundingbox[1]);
	const west = parseFloat(boundingbox[2]);
	const east = parseFloat(boundingbox[3]);

	const latSpan = north - south;
	const lngSpan = east - west;
	const maxSpan = Math.max(latSpan, lngSpan);

	let zoom = 15 - Math.log2(maxSpan / 0.01);
	zoom = Math.min(Math.max(zoom, 2.0), 18.0);

	return zoom;
};

defineExpose({
	getMapWrapper: () => mapWrapperInstance.value,
	moveTo: (center, zoom = 9) => {
		if (mapWrapperInstance.value && mapWrapperInstance.value.map) {
			if ($DEBUG) console.log("Wrapper: ", mapWrapperInstance.value);
			mapWrapperInstance.value.map.flyTo({ center, zoom });
		}
	},
	moveToWithBounds: (center, boundingbox) => {
		if (mapWrapperInstance.value && mapWrapperInstance.value.map) {
			const zoom = calculateZoomFromBounds(boundingbox);
			if ($DEBUG) console.log("Calculated zoom: ", zoom);
			mapWrapperInstance.value.map.flyTo({ center, zoom });
		}
	},
	setCenter: (newCenter) => {
		mapCenter.value = newCenter;
	},
	setZoom: (newZoom) => {
		mapZoom.value = newZoom;
	},
	highlight: (map, item) => {
		fetchAndHighlightGeometry(map, item);
	},
	highlightCivic: (map, item) => {
		fetchAndHighlightCivicGeometry(map, item);
	},
	showPin: (coordinates) => {
		updatePinPosition(coordinates);
	},
	hidePin: () => {
		hidePin();
	},
});
</script>
