import { defineStore } from "pinia";
import { getLocationWebSocket } from "#imports";
import { watch, type WatchStopHandle } from "vue";


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
	state: (): CourierTrackingState & { stopLocationWatch: WatchStopHandle | null } => ({
		associatedCourierId: "",
		courierLocation: null,
		isTracking: false,
		isSubscribed: false,
		stopLocationWatch: null,
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

			if (!ws.isConnected.value) {
				const stopWatch = watch(ws.isConnected, (newVal) => {
					if (newVal) {
						this.associatedCourierId = courierId;
						this.isTracking = true;

						// Subscribe to the courier
						ws.subscribeToCourier(this.associatedCourierId);
						this.isSubscribed = true;

						this.stopLocationWatch?.();

						this.stopLocationWatch = watch(ws.lastLocation, (data) => {
							if (!data) return;
							this.courierLocation = data as CourierLocation;
						});
						stopWatch();
					};
				});
			} else {
				this.associatedCourierId = courierId;
				this.isTracking = true;

				// Subscribe to the courier
				ws.subscribeToCourier(this.associatedCourierId);
				this.isSubscribed = true;

				this.stopLocationWatch?.();

				this.stopLocationWatch = watch(ws.lastLocation, (data) => {
					if (!data) return;
					this.courierLocation = data as CourierLocation;
				});
			}

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
