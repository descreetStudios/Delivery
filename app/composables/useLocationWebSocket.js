export const useLocationWebSocket = () => {
	const config = useRuntimeConfig();
	const wsUrl = config.public.wsUrl || "ws://localhost:8080/ws/locations";

	const { $DEBUG } = useNuxtApp();
	let ws = null;
	const isConnected = ref(false);
	const lastLocation = ref(null);
	const error = ref(null);
	const subscribedCouriers = ref([]);

	/**
   * Connect to WebSocket
   * @param {Function} onLocationUpdate - Callback when location updates
   * @returns {Promise} Resolves when connected
   */
	const connect = (onLocationUpdate) => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			if ($DEBUG) console.log("WebSocket already connected");
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			try {
				ws = new WebSocket(wsUrl);

				ws.onopen = () => {
					if ($DEBUG) console.log("WebSocket connected");
					isConnected.value = true;
					error.value = null;
					resolve();
				};

				ws.onmessage = (event) => {
					try {
						const data = JSON.parse(event.data);

						// Handle subscription confirmation
						if (data.type === "subscription_confirmed") {
							if ($DEBUG) console.log("Subscribed to courier:", data.courierId);
							return;
						}

						// Handle location update
						if (data.courierId) {
							if ($DEBUG) console.log("Location update for courier", data.courierId, ":", data);
							lastLocation.value = data;

							if (onLocationUpdate) {
								onLocationUpdate(data);
							}
						}
					} catch (err) {
						console.error("Failed to parse location data:", err);
					}
				};

				ws.onerror = (err) => {
					console.error("WebSocket error:", err);
					error.value = "WebSocket connection error";
					isConnected.value = false;
					reject(new Error("WebSocket connection error"));
				};

				ws.onclose = () => {
					if ($DEBUG) console.log("WebSocket disconnected");
					isConnected.value = false;

					// Auto-reconnect after 3 seconds
					setTimeout(() => {
						if (!isConnected.value) {
							if ($DEBUG) console.log("Attempting to reconnect...");
							connect(onLocationUpdate);
						}
					}, 3000);
				};
			} catch (err) {
				console.error("Failed to create WebSocket:", err);
				error.value = err.message;
				reject(err);
			}
		});
	};

	/**
   * Subscribe to a courier's location updates
   */
	const subscribeToCourier = (courierId) => {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			console.warn("WebSocket not connected. Cannot subscribe.");
			return;
		}

		const message = {
			type: "subscribe",
			courierId: courierId,
		};

		ws.send(JSON.stringify(message));
		subscribedCouriers.value.push(courierId);
		if ($DEBUG) console.log(`Subscribed to courier: ${courierId}`);
	};

	/**
   * Unsubscribe from a courier's location updates
   */
	const unsubscribeFromCourier = (courierId) => {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			return;
		}

		const message = {
			type: "unsubscribe",
			courierId: courierId,
		};

		ws.send(JSON.stringify(message));
		subscribedCouriers.value = subscribedCouriers.value.filter(id => id !== courierId);
		if ($DEBUG) console.log(`Unsubscribed from courier: ${courierId}`);
	};

	/**
   * Disconnect WebSocket
   */
	const disconnect = () => {
		if (ws) {
			ws.close();
			ws = null;
			isConnected.value = false;
			subscribedCouriers.value = [];
		}
	};

	const sendLocationUpdate = (location) => {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			console.warn("WebSocket not connected. Cannot send location.");
			return;
		}

		const message = {
			type: "location_update",
			courierId: location.courierId,
			latitude: location.latitude,
			longitude: location.longitude,
			heading: location.heading || 0.0,
			timestamp: location.timestamp || new Date().toISOString(),
			status: location.status || "ONLINE",
		};

		ws.send(JSON.stringify(message));
	};

	// Cleanup on unmount
	onUnmounted(() => {
		disconnect();
	});

	return {
		connect,
		disconnect,
		subscribeToCourier,
		unsubscribeFromCourier,
		sendLocationUpdate,
		isConnected: readonly(isConnected),
		lastLocation: readonly(lastLocation),
		error: readonly(error),
		subscribedCouriers: readonly(subscribedCouriers),
	};
};
