import { defineStore } from "pinia";

interface restaurant {
	latitude: number
	longitude: number
}

interface destination {
	latitude: number
	longitude: number
}
interface item {
	name: string
	quantity: number
	price: number
}

interface order {
	id: string,
	restaurant: restaurant,
	destination: destination,
	items: item[],
	total: number,
}

export const useOrderStore = defineStore("orderStore", {
	state: (): order => ({
		id: "0",
		restaurant: { latitude: 0, longitude: 0 },
		destination: { latitude: 0, longitude: 0 },
		items: [],
		total: 0,
	}),

	actions: {
		async submitOrder(orderData: order) {
			const { createOrder } = useOrdersApi();
			const nuxtApp = useNuxtApp();
			const $DEBUG = await nuxtApp.$DEBUG;

			try {
				const id: string = await createOrder(orderData) as string;
				await this.fetchOrder(id);
				if ($DEBUG) console.log("Sending order:", orderData);
				return id;
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
				const data: order = await getOrder(orderId) as order;
				this.id = data.id;
				this.restaurant = data.restaurant;
				this.destination = data.destination;
				this.items = data.items;
				this.total = data.total;
				if ($DEBUG) console.log(data);
				if ($DEBUG) console.log("State: ", this.$state);
			} catch (error) {
				let message;
				if (error instanceof Error) message = error.message;
				else message = String(error);

				reportError(message);
			}
		},
	},
});