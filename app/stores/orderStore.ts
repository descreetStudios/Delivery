import { defineStore } from "pinia";

interface Response {
	orderId: string,
	assigned: string,
	status: string,
}

interface Restaurant {
	latitude: number
	longitude: number
}

interface Destination {
	latitude: number
	longitude: number
}
interface Item {
	name: string
	quantity: number
	price: number
}

interface Order {
	orderId: string,
	associatedCourierId: string,
	restaurant: Restaurant,
	destination: Destination,
	items: Item[],
	totalPrice: number,
	status: string,
}

export const useOrderStore = defineStore("orderStore", {
	state: (): Order => ({
		orderId: "0",
		associatedCourierId: "0",
		restaurant: { latitude: 0, longitude: 0 },
		destination: { latitude: 0, longitude: 0 },
		items: [],
		totalPrice: 0,
		status: "",
	}),

	actions: {
		async submitOrder(orderData: Order) {
			const { createOrder } = useOrdersApi();
			const nuxtApp = useNuxtApp();
			const $DEBUG = await nuxtApp.$DEBUG;

			try {
				const response: Response = await createOrder(orderData) as Response;
				await this.fetchOrder(response.orderId);
				if ($DEBUG) console.log("Sending order:", orderData);
				return response.orderId;
			} catch (error) {
				let message;
				if (error instanceof Error) message = error.message;
				else message = String(error);

				reportError(message);
			}
		},

		async fetchOrder(orderId: string) {
			const { getOrder } = useOrdersApi();
			const nuxtApp = useNuxtApp();
			const $DEBUG = await nuxtApp.$DEBUG;

			try {
				const data: Order = await getOrder(orderId) as Order;
				this.orderId = data.orderId;
				this.restaurant = data.restaurant;
				this.destination = data.destination;
				this.items = data.items;
				this.totalPrice = data.totalPrice;
				if ($DEBUG) console.log(data);
				if ($DEBUG) console.log("State: ", this.$state);
			} catch (error) {
				let message;
				if (error instanceof Error) message = error.message;
				else message = String(error);

				reportError(message);
			}
		},

		async fetchAndSetActiveOrder(associatedCourierId: string) {
			const { fetchActiveOrder } = useOrdersApi();

			if (!associatedCourierId) return;
			this.associatedCourierId = associatedCourierId;

			try {
				const order: Order = await fetchActiveOrder(this.associatedCourierId) as Order;
				this.orderId = order.orderId;
				this.restaurant = order.restaurant;
				this.destination = order.destination;
				this.items = order.items;
				this.totalPrice = order.totalPrice;
			} catch (error) {
				let message;
				if (error instanceof Error) message = error.message;
				else message = String(error);

				reportError(message);
			}
		},

		async completeOrder() {
			const { completeOrder } = useOrdersApi();

			try {
				await completeOrder(this.associatedCourierId, this.orderId);
				this.$reset();
			} catch (error) {
				let message;
				if (error instanceof Error) message = error.message;
				else message = String(error);

				reportError(message);
			}
		},
	},
});