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
				<MglNavigationControl position="top-right" />
				<MglFullscreenControl position="top-right" />
				<MglGeolocateControl position="top-right" />
				<MglScaleControl position="bottom-left" />
			</MglMap>
		</ClientOnly>
	</div>
</template>

<script setup>
const DEBUG = false;

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

const emit = defineEmits(["map-loaded", "map-click"]);

const handleMapLoad = (mapWrapper) => {
	if (DEBUG) console.log("Loaded Map Component");
	emit("map-loaded", mapWrapper);

	// TODO: Make this dynamically working with settings
	mapWrapper.map.setProjection({
		type: ["interpolate", ["linear"], ["zoom"], 0, "globe", 12, "mercator"],
	});
};

const fetchAndHighlightGeometry = async (map, item) => {
	// Remove existing highlight
	if (map.getLayer("region-border")) {
		map.removeLayer("region-border");
	}
	if (map.getLayer("region-fill")) {
		map.removeLayer("region-fill");
	}
	if (map.getSource("region")) {
		map.removeSource("region");
	}

	// If item has an OSM ID, fetch its geometry
	if (item.osm_id && item.osm_type) {
		try {
			const osmType = item.osm_type.charAt(0).toUpperCase(); // N, W, or R
			const response = await fetch(
				`https://nominatim.openstreetmap.org/lookup?osm_ids=${osmType}${item.osm_id}&format=geojson&polygon_geojson=1`,
			);
			const data = await response.json();
			
			if (data.features && data.features.length > 0) {
				const geometry = data.features[0].geometry;
				
				map.addSource("region", {
					type: "geojson",
					data: {
						type: "Feature",
						properties: {},
						geometry: geometry,
					},
				});

				map.addLayer({
					id: "region-fill",
					type: "fill",
					source: "region",
					paint: {
						"fill-color": "#4287f5",
						"fill-opacity": 0.05,
					},
				});

				map.addLayer({
					id: "region-border",
					type: "line",
					source: "region",
					paint: {
						"line-color": "#4287f5",
						"line-width": 3,
					},
				});
			}
		} catch (error) {
			console.error("Error fetching geometry:", error);
			// Fallback to point marker
			showPointMarker(map, item);
		}
	} else {
		// No OSM ID, just show a point
		showPointMarker(map, item);
	}
};

const showPointMarker = (map, item) => {
	map.addSource("region", {
		type: "geojson",
		data: {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: item.center,
			},
		},
	});

	map.addLayer({
		id: "region-border",
		type: "circle",
		source: "region",
		paint: {
			"circle-radius": 15,
			"circle-color": "#ff0000",
			"circle-opacity": 0.3,
			"circle-stroke-width": 2,
			"circle-stroke-color": "#ff0000",
		},
	});
};

defineExpose({
	getMapWrapper: () => mapWrapperInstance.value,
	moveTo: (center, zoom = 16) => {
		if (mapWrapperInstance.value && mapWrapperInstance.value.map) {
			if (DEBUG) console.log("Wrapper: ", mapWrapperInstance.value);
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
});
</script>
