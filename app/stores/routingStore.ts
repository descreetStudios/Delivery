import { defineStore } from "pinia";
import { getLocationWebSocket } from "#imports";
import { useOrderStore } from "@/stores/orderStore";

type Coordinate = [number, number]; //[lng, lat]

interface Geometry {
	coordinates: Coordinate[];
	type: string;
}

interface Intersection {
	bearings: number[];
	entry: boolean[];
	location: Coordinate;
	out: number;
}

interface Maneuver {
	bearing_after: number;
	bearing_before: number;
	location: Coordinate;
	modifier: string;
	type: string;
}

interface Step {
	distance: number;
	driving_side: string;
	duration: number;
	geometry: Geometry;
	intersections: Intersection[];
	maneuver: Maneuver;
	mode: string;
	name: string;
	weight: number;
}

interface Leg {
	distance: number;
	duration: number;
	steps: Step[]
	summary: string;
	weight: number;
}

interface Route {
	distance: number;
	duration: number;
	geometry: Geometry;
	legs: Leg[];
	weight: number;
	weight_name: string;
}

interface Waypoint {
	distance: number;
	hint: string;
	location: Coordinate;
	name: string;
}

interface RoutingData {
	code: string;
	routes: Route[];
	waypoints: Waypoint[];
	currentGPS: Coordinate;
	currentHeading: number,
	courierId: string;
	activeOrderId: string,
}

export const useRoutingStore = defineStore("routingStore", {
	state: (): RoutingData & {
		orderPollingInterval: ReturnType<typeof setInterval> | null
	} => ({
		code: "NotLoaded",
		routes: [],
		waypoints: [],
		currentGPS: [0, 0],
		currentHeading: 0,
		courierId: "0",
		activeOrderId: "0",
		orderPollingInterval: null,
	}),

	actions: {
		async syncRoutingData() {
			const { getRoutingData } = useRoutingEngineApi();
			const nuxtApp = useNuxtApp();
			const $DEBUG = await nuxtApp.$DEBUG;

			try {
				const data: RoutingData = await getRoutingData(this.courierId) as RoutingData;
				this.code = data.code;
				this.routes = data.routes;
				this.waypoints = data.waypoints;
				if ($DEBUG) console.log("State: ", this.$state);
			} catch (error) {
				this.code = error as string;

				let message;
				if (error instanceof Error) message = error.message;
				else message = String(error);

				reportError(message);
			}
		},

		async syncGeolocation(coords: Coordinate, heading: number) {

			const ws = getLocationWebSocket();

			if (!ws.isConnected.value) {
				return;
			}

			this.currentGPS = coords;
			if (heading) this.currentHeading = +heading.toFixed(0);

			const location = {
				courierId: "courier" + this.courierId,
				latitude: this.currentGPS[1],
				longitude: this.currentGPS[0],
				heading: this.currentHeading || 0,
			};

			ws.sendLocationUpdate(location);
		},

		setCourierId(courierId: string) {
			this.courierId = courierId;
			// Normalize: remove "courier" prefix if present, store just the ID
			this.courierId = courierId?.replace(/^courier/, "") || "";
		},

		startOrderPolling() {
			const orderStore = useOrderStore();
			const nuxtApp = useNuxtApp();
			const $DEBUG = nuxtApp.$DEBUG;

			// Don't poll if courier ID is invalid or default
			if (!this.courierId || this.courierId === "0" || this.courierId === "0000") {
				if ($DEBUG) console.warn("Cannot start polling: invalid courier ID:", this.courierId);
				return;
			}

			if (this.orderPollingInterval) {
				clearInterval(this.orderPollingInterval);
				this.orderPollingInterval = null;
			}

			if ($DEBUG) console.log("Starting order polling for courier:", this.courierId);
			this.orderPollingInterval = setInterval(async () => {
				await orderStore.fetchAndSetActiveOrder(this.courierId);
			}, 3000);
		},

		stopOrderPolling() {
			if (this.orderPollingInterval) {
				clearInterval(this.orderPollingInterval);
				this.orderPollingInterval = null;
			}
		},
	},
});
