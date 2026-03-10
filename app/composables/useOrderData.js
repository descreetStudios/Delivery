export const useOrderData = () => {
	/**
   * Fetch order data (and courier location) from the backend.
   *
   * The backend exposes an endpoint at `/api/locations/{courierId}` that
   * returns a JSON object containing `location` and `order`.  This composable
   * hides the details of the HTTP request, provides loading and error state,
   * and returns the parsed order items for consumption in components.
   *
   * @param {string} courierId - Identifier of the courier whose data is requested.
   * @returns {{
   *   orderItems: Ref<OrderItem[]>,
   *   location: Ref<CourierLocation | null>,
   *   loading: Ref<boolean>,
   *   error: Ref<string | null>
   * }}
   */
	const { $fetch, $DEBUG } = useNuxtApp();
	const orderItems = ref([]);
	const location = ref(null);
	const loading = ref(false);
	const error = ref(null);

	const fetchOrderData = async (courierId) => {
		if (!courierId || courierId === "0000") {
			throw new Error("Invalid courier ID");
		}

		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch(`/api/locations/${courierId}`);
			// Expected shape: { location: {...}, order: [...] }
			if ($DEBUG) console.log("Order data fetched:", response);

			location.value = response.location ?? null;
			orderItems.value = Array.isArray(response.order) ? response.order : [];
		} catch (err) {
			error.value = err.message || "Unable to fetch order data";
			throw new Error(error.value);
		} finally {
			loading.value = false;
		}
	};

	return {
		orderItems,
		location,
		loading,
		error,
		fetchOrderData,
	};
};
