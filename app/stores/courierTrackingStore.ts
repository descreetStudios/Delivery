import { defineStore } from "pinia";

interface CourierLocation {
	courierId: string;
	latitude: number;
	longitude: number;
	heading: number;
	timestamp: string;
	status: string;
}

interface CourierTrackingState {
	associatedCourierId: string;
	courierLocation: CourierLocation | null;
	isTracking: boolean;
	isSubscribed: boolean;
}

export const useCourierTrackingStore = defineStore("courierTrackingStore", {
	state: (): CourierTrackingState => ({
		associatedCourierId: "",
		courierLocation: null,
		isTracking: false,
		isSubscribed: false,
	}),

	actions: {
		/**
		 * Start tracking a courier's location via WebSocket
		 * @param courierId - The courier ID to track
		 */
		async startTracking(courierId: string) {
			const { subscribeToCourier, onLocationUpdate } = useCourierTracking();

			if (!courierId || courierId === "0") {
				return;
			}

			this.associatedCourierId = courierId;
			this.isTracking = true;

			// Set up location update handler
			onLocationUpdate((data: any) => {
				this.courierLocation = data as CourierLocation;
			});

			// Subscribe to the courier
			subscribeToCourier(courierId);
			this.isSubscribed = true;
		},

		/**
		 * Stop tracking the current courier
		 */
		stopTracking() {
			const { unsubscribeFromCourier } = useCourierTracking();

			if (this.isSubscribed) {
				unsubscribeFromCourier();
				this.isSubscribed = false;
			}

			this.isTracking = false;
			this.courierLocation = null;
			this.associatedCourierId = "";
		},

		/**
		 * Update the associated courier ID
		 * @param courierId - The new courier ID
		 */
		setCourierId(courierId: string) {
			this.associatedCourierId = courierId;
		},

		/**
		 * Reset the store to initial state
		 */
		reset() {
			this.stopTracking();
		},
	},
});
