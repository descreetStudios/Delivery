export const useOrderData = () => {
	/**
	  * Fetch order data (and courier location) from the backend.
	  *
	  * The backend now stores courier and order information separately in Redis.
	  * This composable provides methods to fetch courier location, order details,
	  * and update courier locations with optional order assignments.
	  *
	  * @param {string} courierId - Identifier of the courier whose data is requested.
	  * @returns {{
	  *   orderItems: Ref<OrderItem[]>,
	  *   location: Ref<CourierLocation | null>,
	  *   loading: Ref<boolean>,
	  *   error: Ref<string | null>,
	  *   fetchCourierLocation: Function,
	  *   fetchOrder: Function,
	  *   updateCourierLocation: Function
	  * }}
	  */
	const { $fetch, $DEBUG } = useNuxtApp();
	const orderItems = ref([]);
	const location = ref(null);
	const loading = ref(false);
	const error = ref(null);

	/**
   * Fetch courier location from the backend.
   */
	const fetchCourierLocation = async (courierId) => {
		if (!courierId || courierId === "0000") {
			throw new Error("Invalid courier ID");
		}

		try {
			const response = await $fetch(`/api/locations/courier/${courierId}`);
			location.value = response;
		} catch (err) {
			error.value = err.message || "Unable to fetch courier location";
			throw new Error(error.value);
		}
	};

	/**
   * Fetch order details from the backend.
   */
	const fetchOrder = async (orderId) => {
		if (!orderId) {
			throw new Error("Invalid order ID");
		}

		try {
			const response = await $fetch(`/api/locations/orders/${orderId}`);
			orderItems.value = response.items ?? [];
			return response;
		} catch (err) {
			error.value = err.message || "Unable to fetch order";
			throw new Error(error.value);
		}
	};

	/**
   * Update courier location with optional order assignment.
   */
	const updateCourierLocation = async (locationData) => {
		try {
			await $fetch(`/api/locations/update`, {
				method: 'POST',
				body: locationData
			});
		} catch (err) {
			error.value = err.message || "Unable to update courier location";
			throw new Error(error.value);
		}
	};

	return {
		orderItems,
		location,
		loading,
		error,
		fetchCourierLocation,
		fetchOrder,
		updateCourierLocation
	};
};
