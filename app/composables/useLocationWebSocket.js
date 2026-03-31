export const useLocationWebSocket = () => {
	const config = useRuntimeConfig();
	const wsUrl = config.public.wsUrl || "ws://localhost:8080/ws/locations";

	let ws = null;
	const isConnected = ref(false);
	const lastLocation = ref(null);
	const error = ref(null);
	const subscribedCouriers = ref([]);

	/**
   * Connect to WebSocket
   * @param {Function} onLocationUpdate - Callback when location updates
   */
	const connect = (onLocationUpdate) => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			console.log("WebSocket already connected");
			return;
		}

		try {
			ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				console.log("✅ WebSocket connected");
				isConnected.value = true;
				error.value = null;
			};

			ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);

					// Handle subscription confirmation
					if (data.type === "subscription_confirmed") {
						console.log("✅ Subscribed to courier:", data.courierId);
						return;
					}

					// Handle location update
					if (data.courierId) {
						console.log("📍 Location update for courier", data.courierId, ":", data);
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
				console.error("❌ WebSocket error:", err);
				error.value = "WebSocket connection error";
				isConnected.value = false;
			};

			ws.onclose = () => {
				console.log("🔌 WebSocket disconnected");
				isConnected.value = false;

				// Auto-reconnect after 3 seconds
				setTimeout(() => {
					if (!isConnected.value) {
						console.log("Attempting to reconnect...");
						connect(onLocationUpdate);
					}
				}, 3000);
			};
		} catch (err) {
			console.error("Failed to create WebSocket:", err);
			error.value = err.message;
		}
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
			courierId: courierId
		};

		ws.send(JSON.stringify(message));
		subscribedCouriers.value.push(courierId);
		console.log(`✅ Subscribed to courier: ${courierId}`);
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
			courierId: courierId
		};

		ws.send(JSON.stringify(message));
		subscribedCouriers.value = subscribedCouriers.value.filter(id => id !== courierId);
		console.log(`✅ Unsubscribed from courier: ${courierId}`);
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

	// Cleanup on unmount
	onUnmounted(() => {
		disconnect();
	});

	return {
		connect,
		disconnect,
		subscribeToCourier,
		unsubscribeFromCourier,
		isConnected: readonly(isConnected),
		lastLocation: readonly(lastLocation),
		error: readonly(error),
		subscribedCouriers: readonly(subscribedCouriers)
	};
};
