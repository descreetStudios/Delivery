export const useRoutingEngineApi = () => {

	/**
   * Get routing data from Project OSRM
   * @param {string} courierId - Courier ID
   * @returns {GeoJSON}
   */
	const getRoutingData = async (courierId) => {

		const DEBUG = false;
		const { getLocation } = useLocationApi();

		if (courierId == "0000" || courierId == null) return;
		const link = ref("");
		const location = await getLocation("courier" + courierId);
		if (location) {
			link.value = "https://router.project-osrm.org/route/v1/driving/" + location.longitude + "," + location.latitude + ";9.19,45.46;7.44,46.94?overview=full&geometries=geojson&steps=true";
		}
		if (DEBUG) console.log(link.value);

		const response = await fetch(
			link.value,
		);
		return await response.json();
	};

	return {
		getRoutingData,
	};
};