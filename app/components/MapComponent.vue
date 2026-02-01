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

	const map = mapWrapper.map;

	map.setProjection({
		type: ["interpolate", ["linear"], ["zoom"], 0, "globe", 12, "mercator"],
	});

	// TODO: doesn't work
	map.once("style.load", () => {
		if (!map.hasImage("pin-icon")) {
			console.log("Map does not have pin icon, loading...");
			map.loadImage("/images/pin-icon.png", (err, image) => {
				console.log("Loading pin icon");
				if (err) {
					console.error(err);
					return;
				}
				map.addImage("pin-icon", image);
			});
		}
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
	} catch (err) {
		console.error("Error fetching geometry:", err);
		showPointMarker(map, item);
	}
};

const fetchAndHighlightCivicGeometry = (map, item) => {
	if (map.getLayer("region-border")) map.removeLayer("region-border");
	if (map.getLayer("region-fill")) map.removeLayer("region-fill");
	if (map.getSource("region-geometry")) map.removeSource("region-geometry");

	showPointMarker(map, item);
};

const showPointMarker = (map, item) => {
	if (map.getSource("point")) map.removeSource("point");
	if (map.getLayer("points")) map.removeLayer("points");

	map.addSource("point", {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: item.center,
					},
				},
			],
		},
	});

	map.addLayer({
		id: "points",
		type: "symbol",
		source: "point",
		layout: {
			"icon-image": "pin-icon",
			"icon-size": 0.25,
		},
	});
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
			if (DEBUG) console.log("Wrapper: ", mapWrapperInstance.value);
			mapWrapperInstance.value.map.flyTo({ center, zoom });
		}
	},
	moveToWithBounds: (center, boundingbox) => {
		if (mapWrapperInstance.value && mapWrapperInstance.value.map) {
			const zoom = calculateZoomFromBounds(boundingbox);
			if (DEBUG) console.log("Calculated zoom:", zoom);
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
});
</script>
