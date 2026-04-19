import { defineStore } from "pinia";
import { getLocationWebSocket } from "#imports";
import { watch } from "vue";


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
			if (!courierId || courierId === "0") {
				return;
			}
			const ws = getLocationWebSocket();

			let stopLocationWatch: (() => void) | null = null;

			const stopWatch = watch(ws.isConnected, (newVal) => {
				if (newVal){
					this.associatedCourierId = courierId;
					this.isTracking = true;

					// Subscribe to the courier
					ws.subscribeToCourier(this.associatedCourierId);
					this.isSubscribed = true;

					if (stopLocationWatch) stopLocationWatch();

					stopLocationWatch = watch(ws.lastLocation, (data) => {
						if (!data) return;
						this.courierLocation = data as CourierLocation;
					});
					stopWatch();
				};
			});			
		},

		/**
		 * Stop tracking the current courier
		 */
		stopTracking() {
			const ws = getLocationWebSocket();

			if (!ws.isConnected.value) {
				return;
			}

			if (this.isSubscribed) {
				ws.unsubscribeFromCourier(this.associatedCourierId);
				this.isSubscribed = false;
			}

			this.isTracking = false;
			this.courierLocation = null;
			this.associatedCourierId = "";

			this.$reset();
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
