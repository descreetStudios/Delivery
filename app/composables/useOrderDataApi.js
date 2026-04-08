export const useOrderDataApi = () => {
	/**
	 * Full order management composable
	 *
	 *   POST   /api/orders                  → createOrder()
	 *   GET    /api/orders/{id}             → fetchOrder()
	 *   GET    /api/orders/courier/{id}/active → getActiveOrder()
	 *   PUT    /api/orders/{id}/assign      → assignCourierToOrder()
	 *   PUT    /api/orders/{id}/complete    → completeOrder()
	 *
	 * Location updates are sent via WebSocket only.
	 * For sending location updates, use useLocationWebSocket().sendLocationUpdate().
	 *
	 * @returns {{
	 *   orderItems: Ref<OrderItem[]>,
	 *   totalPrice: Ref<number>,
	 *   activeOrder: Ref<Order | null>,
	 *   location: Ref<CourierLocation | null>,
	 *   loading: Ref<boolean>,
	 *   error: Ref<string | null>,
	 *   createOrder: Function,
	 *   fetchOrder: Function,
	 *   getActiveOrder: Function,
	 *   assignCourierToOrder: Function,
	 *   completeOrder: Function,
	 *   fetchCourierLocation: Function
	 * }}
	 */
	const { $DEBUG } = useNuxtApp();
	const orderItems = ref([]);
	const totalPrice = ref(0);
	const activeOrder = ref(null);
	const location = ref(null);
	const loading = ref(false);
	const error = ref(null);

	// ─── Location ───────────────────────────────────────────────────────

	/**
	 * Fetch courier location from the backend.
	 * @param {string} courierId
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

	// ─── Order CRUD ─────────────────────────────────────────────────────

	/**
	 * Create a new order. Every order must have at least one item.
	 *
	 * @param {{
	 *   orderId: string,
	 *   pickupLatitude: number,
	 *   pickupLongitude: number,
	 *   deliveryLatitude: number,
	 *   deliveryLongitude: number,
	 *   items: Array<{ name: string, quantity: number, price: number }>,
	 *   totalPrice?: number
	 * }} orderData
	 */
	const createOrder = async (orderData) => {
		if (!orderData.items || orderData.items.length === 0) {
			throw new Error("Order must have at least one item");
		}

		// Auto-calculate totalPrice if not provided
		if (orderData.totalPrice === undefined) {
			orderData.totalPrice = orderData.items.reduce(
				(sum, item) => sum + (item.price || 0) * (item.quantity || 0),
				0,
			);
		}

		try {
			const response = await $fetch("/api/orders", {
				method: "POST",
				body: {
					orderId: orderData.orderId,
					pickupLatitude: orderData.pickupLatitude,
					pickupLongitude: orderData.pickupLongitude,
					deliveryLatitude: orderData.deliveryLatitude,
					deliveryLongitude: orderData.deliveryLongitude,
					items: orderData.items.map((item) => ({
						name: item.name,
						quantity: item.quantity,
						price: item.price,
					})),
					totalPrice: orderData.totalPrice,
				},
			});
			return response;
		} catch (err) {
			error.value = err.message || "Unable to create order";
			throw new Error(error.value);
		}
	};

	/**
	 * Fetch a specific order by ID.
	 * @param {string} orderId
	 */
	const fetchOrder = async (orderId) => {
		if (!orderId) {
			throw new Error("Invalid order ID");
		}

		try {
			const response = await $fetch(`/api/orders/${orderId}`);
			orderItems.value = response.items ?? [];
			totalPrice.value = response.totalPrice ?? 0;
			return response;
		} catch (err) {
			error.value = err.message || "Unable to fetch order";
			throw new Error(error.value);
		}
	};

	/**
	 * Get the active order for a courier.
	 * @param {string} courierId
	 */
	const getActiveOrder = async (courierId) => {
		if (!courierId) {
			throw new Error("Invalid courier ID");
		}

		try {
			const response = await $fetch(`/api/orders/courier/${courierId}/active`);
			activeOrder.value = response;
			return response;
		} catch (err) {
			error.value = err.message || "Unable to fetch active order";
			throw new Error(error.value);
		}
	};

	/**
	 * Assign a courier to an order.
	 * @param {string} orderId
	 * @param {string} courierId
	 */
	const assignCourierToOrder = async (orderId, courierId) => {
		if (!orderId || !courierId) {
			throw new Error("Invalid order ID or courier ID");
		}

		try {
			await $fetch(`/api/orders/${orderId}/assign?courierId=${courierId}`, {
				method: "PUT",
			});
			if ($DEBUG) console.log(`✅ Courier ${courierId} assigned to order ${orderId}`);
		} catch (err) {
			error.value = err.message || "Unable to assign courier to order";
			throw new Error(error.value);
		}
	};

	/**
	 * Complete an order.
	 * @param {string} orderId
	 * @param {string} courierId
	 */
	const completeOrder = async (orderId, courierId) => {
		if (!orderId || !courierId) {
			throw new Error("Invalid order ID or courier ID");
		}

		try {
			await $fetch(`/api/orders/${orderId}/complete?courierId=${courierId}`, {
				method: "PUT",
			});
			activeOrder.value = null;
			if ($DEBUG) console.log(`✅ Order ${orderId} completed by courier ${courierId}`);
		} catch (err) {
			error.value = err.message || "Unable to complete order";
			throw new Error(error.value);
		}
	};

	return {
		orderItems,
		totalPrice,
		activeOrder,
		location,
		loading,
		error,
		createOrder,
		fetchOrder,
		getActiveOrder,
		assignCourierToOrder,
		completeOrder,
		fetchCourierLocation,
	};
};
