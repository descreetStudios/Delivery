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
			const response = await $fetch(`${apiBase}/orders`, {
				method: "POST",
				body: {
					restaurant: order.restaurant,
					destination: order.destination,
					items: order.items,
					totalPrice: order.total,
				},
			});
			// Response now includes { orderId, assigned, status }
			return response;
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
			if ($DEBUG) console.log("Order fetched: ", response);
			return response;
		} catch (err) {
			error.value = err.message || "Unable to get order";
			throw new Error(error.value);
		} finally {
			loading.value = false;
		}
	};

	const fetchActiveOrder = async (associatedCourierId) => {
		loading.value = true;
		try {
			const fullCourierId = associatedCourierId.startsWith("courier") ? associatedCourierId : "courier" + associatedCourierId;
			const response = await $fetch(`${apiBase}/orders/courier/${fullCourierId}/active`, {
				cache: "no-store",
			});
			return response ?? null;
		} catch (err) {
			// 404 is expected when courier has no active order - don't throw error
			if (err.status === 404) {
				const fullCourierId = associatedCourierId.startsWith("courier") ? associatedCourierId : "courier" + associatedCourierId;
				if ($DEBUG) console.log(`No active order for courier ${fullCourierId}`);
				return null;
			}
			error.value = err.message || "Unable to fetch active order";
			throw new Error(error.value);
		} finally {
			loading.value = false;
		}
	};

	const completeOrder = async (courierId, orderId) => {
		loading.value = true;
		try {
			const fullCourierId = courierId.startsWith("courier") ? courierId : "courier" + courierId;
			await $fetch(`${apiBase}/orders/${orderId}/complete?courierId=${fullCourierId}`, {
				method: "PUT",
			});
		} catch (err) {
			error.value = err.message || "Unable to complete active order";
			throw new Error(error.value);
		} finally {
			loading.value = false;
		}
	};

	const updateOrderToDelivering = async (orderId) => {
		loading.value = true;
		try {
			await $fetch(`${apiBase}/orders/${orderId}/delivering`, {
				method: "PUT",
			});
		} catch (err) {
			error.value = err.message || "Unable to update order to DELIVERING";
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
		fetchActiveOrder,
		completeOrder,
		updateOrderToDelivering,
	};
};