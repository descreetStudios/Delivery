
export const useRoutingEngineApi = () => {

	/**
   * Get routing data from Project OSRM
   * @param {string} courierId - Courier ID
   * @returns {GeoJSON}
   */
	const getRoutingData = async (courierId, restaurant, destination) => {

		const { $DEBUG } = useNuxtApp();
		const { getLocation } = useLocationApi();
		const location = ref("");
		const response = ref("");
		const link = ref("");

		if (courierId == "0000" || courierId == null) throw new Error("Invalid courierId");

		try {
			location.value = await getLocation("courier" + courierId);
		} catch (err) {
			throw new Error(err.message);
		}
		if (location.value) {
			link.value = "https://router.project-osrm.org/route/v1/driving/" +
				location.value.longitude + "," +
				location.value.latitude +
				";" + restaurant.longitude + "," + restaurant.latitude +
				";" + destination.longitude + "," + destination.latitude +
				"?overview=full&geometries=geojson&steps=true" +
				"&bearings=" +
				location.value.heading + ",20;;";
		}
		if ($DEBUG) console.log("OSRM link: ", link.value);

		try {
			response.value = await $fetch(link.value);
		} catch (err) {
			throw new Error("Unable to fetch the route: " + err);
		}

		return response.value;
	};

	return {
		getRoutingData,
	};
};