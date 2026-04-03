<template>
	<div class="tracking-container">
		<h1>🚚 Live Courier Tracking</h1>

		<!-- Connection Status -->
		<div class="status-bar">
			<span
				v-if="isConnected"
				class="status connected"
			>
				🟢 Connected to real-time updates
			</span>
			<span
				v-else
				class="status disconnected"
			>
				🔴 Disconnected
			</span>
		</div>

		<!-- Test Controls -->
		<div class="controls">
			<h2>Test Location Update</h2>
			<input
				v-model="testCourierId"
				placeholder="Courier ID"
			>
			<button
				:disabled="sending"
				@click="sendTestLocation"
			>
				{{ sending ? 'Sending...' : 'Send Random Location' }}
			</button>
			<button @click="getTestLocation">Get Location</button>
		</div>

		<!-- Courier List -->
		<div class="courier-list">
			<h2>Active Couriers</h2>
			<div
				v-if="couriers.length === 0"
				class="empty"
			>
				No active couriers. Send a test location to see them here.
			</div>
			<div
				v-for="courier in couriers"
				:key="courier.courierId"
				class="courier-card"
			>
				<h3>{{ courier.courierId }}</h3>
				<div class="courier-details">
					<p><strong>📍 Location:</strong> {{ courier.latitude.toFixed(4) }}, {{ courier.longitude.toFixed(4) }}</p>
					<p><strong>🧭 Heading:</strong> {{ courier.heading.toFixed(0) }}°</p>
					<p><strong>📊 Status:</strong> <span :class="'status-' + courier.status.toLowerCase()">{{ courier.status }}</span></p>
					<p><strong>🕐 Last Update:</strong> {{ formatTime(courier.timestamp) }}</p>
				</div>
			</div>
		</div>

		<!-- Raw Data (for debugging) -->
		<div class="debug-panel">
			<h2>Debug Info</h2>
			<pre>{{ JSON.stringify(lastLocation, null, 2) }}</pre>
		</div>
	</div>
</template>

<script setup>
import { useLocationApi, useLocationWebSocket  } from "#imports";

/*
 * TODO: This page uses updateLocation() from useLocationApi() which was removed.
 * Location updates must now be sent via useLocationWebSocket().sendLocationUpdate().
 *
 * Migration needed:
 *   1. Remove `updateLocation` from useLocationApi() import
 *   2. Add `sendLocationUpdate` to useLocationWebSocket() import
 *   3. Replace `await updateLocation({...})` with `sendLocationUpdate({...})`
 *   4. Remove the async/await pattern in sendTestLocation()
 */

const { updateLocation, getLocation } = useLocationApi();
const { connect, isConnected, lastLocation } = useLocationWebSocket();

const couriers = ref([]);
const testCourierId = ref("courier1");
const sending = ref(false);

// Connect to WebSocket when component mounts
onMounted(() => {
	connect((location) => {
		// Update or add courier in the list
		const index = couriers.value.findIndex(c => c.courierId === location.courierId);
		if (index >= 0) {
			couriers.value[index] = location;
		} else {
			couriers.value.push(location);
		}
	});
});

// Send test location
const sendTestLocation = async () => {
	sending.value = true;

	// Random location around Metz
	const lat = 45.30240 + (Math.random() - 0.5) * 0.1;
	const lng = 9.48550 + (Math.random() - 0.5) * 0.1;

	sendLocationUpdate({
		courierId: testCourierId.value,
		latitude: lat,
		longitude: lng,
		heading: Math.random() * 360, // 0-360 degrees
		timestamp: new Date().toISOString(),
		status: "DELIVERING",
	});

	console.log("✅ Location update sent via WebSocket!");
	sending.value = false;
};

// Get location manually
const getTestLocation = async () => {
	const location = await getLocation(testCourierId.value);
	if (location) {
		console.log("Location retrieved:", location);
		alert(`Location: ${location.latitude}, ${location.longitude}`);
	} else {
		alert("Courier not found or location expired");
	}
};

// Format timestamp
const formatTime = (timestamp) => {
	if (!timestamp) return "N/A";
	return new Date(timestamp).toLocaleTimeString();
};
</script>

<style scoped>
.tracking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.status-bar {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  background: #f8f9fa;
}

.status {
  font-weight: 600;
  font-size: 16px;
}

.status.connected {
  color: #27ae60;
}

.status.disconnected {
  color: #e74c3c;
}

.controls {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.controls input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  width: 200px;
}

.controls button {
  padding: 10px 20px;
  font-size: 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.controls button:hover:not(:disabled) {
  background: #2980b9;
}

.controls button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.courier-list {
  margin-bottom: 20px;
}

.courier-list h2 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.empty {
  padding: 40px;
  text-align: center;
  color: #95a5a6;
  background: white;
  border-radius: 8px;
}

.courier-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.courier-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.courier-details p {
  margin: 8px 0;
  color: #555;
}

.status-delivering {
  color: #27ae60;
  font-weight: 600;
}

.status-idle {
  color: #f39c12;
  font-weight: 600;
}

.status-offline {
  color: #e74c3c;
  font-weight: 600;
}

.debug-panel {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.debug-panel h2 {
  color: #ecf0f1;
  margin-bottom: 15px;
}

.debug-panel pre {
  background: #34495e;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
