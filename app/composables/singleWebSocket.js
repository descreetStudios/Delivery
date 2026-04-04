// Create only a single WebSocket for routingStore.ts

let wsInstance = null;

export const getLocationWebSocket = () => {
	if (!wsInstance) {
		wsInstance = useLocationWebSocket();
		wsInstance.connect();
	}
	return wsInstance;
};