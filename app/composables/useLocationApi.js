import { useRuntimeConfig } from "#app";

export const useLocationApi = () => {
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase || "http://localhost:8080/api/locations";

	/**
   * Update courier location
   * @param {Object} location - Location data
   * @returns {Promise}
   */

	const updateLocation = async (location) => {
		try {
			await $fetch(`${apiBase}/update`, {
				method: "POST",
				body: {
					courierId: location.courierId,
					latitude: location.latitude,
					longitude: location.longitude,
					heading: location.heading || 0.0,
					timestamp: location.timestamp || new Date().toISOString(),
					status: location.status || "ONLINE",
				},
			});
			return { success: true };
		} catch (error) {
			console.error("Failed to update location:", error);
			return { success: false, error };
		}
	};

	/**
   * Get courier location
   * @param {string} courierId - Courier ID
   * @returns {Promise<Object|null>}
   */
	const getLocation = async (courierId) => {
		try {
			const location = await $fetch(`${apiBase}/courier/${courierId}`);
			return location;
		} catch (error) {
			if (error.status === 404) {
				throw new Error(`Courier ${courierId} not found`);
			}
			throw new Error("Failed to get location:" + error);
		}
	};

	return {
		updateLocation,
		getLocation,
	};
};
