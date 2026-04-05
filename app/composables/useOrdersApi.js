import { useRuntimeConfig } from "#app";

export const useOrdersApi = () => {
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase || "http://localhost:8080/api";

	/**
	 * Provides methods to interact with order-related endpoints.
	 *
	 * Allows creating a new order and retrieving an existing one from the backend.
	 * Also exposes reactive loading and error state for handling request status in the UI.
	 *
	 * @param {string} orderId - Identifier of the order.
	 * @returns {{
	 *   loading: Ref<boolean>,
	 *   error: Ref<string | null>,
	 *   createOrder: Function,
	 *   getOrder: Function,
	 * }}
	 */

	const { $DEBUG } = useNuxtApp();
	const loading = ref(false);
	const error = ref(null);

	/**
	 * Send a POST request to create a new order
	 */
	const createOrder = async (order) => {
		loading.value = true;
		try {
			const orderId = await $fetch(`${apiBase}/orders`, {
				method: "POST",
				body: {
					pickupLatitude: order.restaurant.latitude,
					pickupLongitude: order.restaurant.longitude,
					deliveryLatitude: order.destination.latitude,
					deliveryLongitude: order.destination.longitude,
					items: order.items,
					totalPrice: order.total,
				},
			});
			return orderId;
		} catch (err) {
			error.value = err.message || "Unable to create order";
			throw new Error(error.value);
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Fetch an order by its ID from the API
	 */
	const getOrder = async (orderId) => {
		loading.value = true;
		try {
			const response = await $fetch(`${apiBase}/orders/${orderId}`);
			return response;
		} catch (err) {
			error.value = err.message || "Unable to get order";
			throw new Error(error.value);
		} finally {
			loading.value = false;
		}
	};

	return {
		loading,
		error,
		createOrder,
		getOrder,
	};
};