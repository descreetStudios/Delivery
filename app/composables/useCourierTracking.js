export const useCourierTracking = () => {
	const { $DEBUG } = useNuxtApp();
	const locationWebSocket = getLocationWebSocket();

	const courierLocation = ref(null);
	const isSubscribed = ref(false);
	const error = ref(null);

	/**
	 * Subscribe to a courier's location updates via WebSocket
	 * @param {string} courierId - The courier ID to track
	 */
	const subscribeToCourier = (courierId) => {
		if (!courierId || courierId === "0") {
			if ($DEBUG) console.warn("Invalid courier ID for subscription");
			return;
		}

		try {
			// Normalize courier ID
			const normalizedId = courierId.startsWith("courier") ? courierId : "courier" + courierId;

			locationWebSocket.subscribeToCourier(normalizedId);
			isSubscribed.value = true;

			if ($DEBUG) console.log(`Subscribed to courier location: ${normalizedId}`);
		} catch (err) {
			error.value = err.message || "Failed to subscribe to courier";
			console.error("Subscription error:", err);
		}
	};

	/**
	 * Unsubscribe from courier location updates
	 */
	const unsubscribeFromCourier = () => {
		if (courierLocation.value) {
			const normalizedId = courierLocation.value.courierId;
			locationWebSocket.unsubscribeFromCourier(normalizedId);
			isSubscribed.value = false;
			courierLocation.value = null;

			if ($DEBUG) console.log(`Unsubscribed from courier: ${normalizedId}`);
		}
	};

	/**
	 * Set up location update handler
	 * @param {Function} onUpdate - Callback when location updates are received
	 */
	const onLocationUpdate = (onUpdate) => {
		locationWebSocket.connect((data) => {
			if ($DEBUG) console.log("Courier location update:", data);
			courierLocation.value = data;
			
			if (onUpdate) {
				onUpdate(data);
			}
		});
	};

	/**
	 * Get courier location from REST API (fallback)
	 * @param {string} courierId - The courier ID
	 * @returns {Promise<Object>} Location data
	 */
	const fetchCourierLocation = async (courierId) => {
		const { getLocation } = useLocationApi();

		try {
			const normalizedId = courierId.startsWith("courier") ? courierId : "courier" + courierId;
			const location = await getLocation(normalizedId);
			courierLocation.value = location;
			return location;
		} catch (err) {
			error.value = err.message || "Failed to fetch courier location";
			throw new Error(error.value);
		}
	};

	// Cleanup on unmount
	onUnmounted(() => {
		unsubscribeFromCourier();
	});

	return {
		courierLocation: readonly(courierLocation),
		isSubscribed: readonly(isSubscribed),
		error: readonly(error),
		subscribeToCourier,
		unsubscribeFromCourier,
		onLocationUpdate,
		fetchCourierLocation,
	};
};
