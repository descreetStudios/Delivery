import { defineStore } from "pinia";
import { getLocationWebSocket } from "#imports";

type Coordinate = [number, number]; //[lng, lat]

interface Geometry{
    coordinates:Coordinate[];
    type:string;
}

interface Intersection{
    bearings: number[];
    entry: boolean[];
    location:Coordinate;
    out:number;
}

interface Maneuver{
    bearing_after:number;
    bearing_before: number;
    location: Coordinate;
    modifier:string;
    type:string;
}

interface Step{
    distance:number;
    driving_side:string;
    duration:number;
    geometry:Geometry;
    intersections:Intersection[];
    maneuver:Maneuver;
    mode:string;
    name:string;
    weight:number;
}

interface Leg{
    distance:number;
    duration:number;
    steps:Step[]
    summary:string;
    weight:number;
}

interface Route{
    distance:number;
    duration:number;
    geometry:Geometry;
    legs:Leg[];
    weight:number;
    weight_name:string;
}

interface Waypoint{
    distance:number;
    hint:string;
    location:Coordinate;
    name:string;
}

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    orderId: string;
    pickupLatitude: number;
    pickupLongitude: number;
    deliveryLatitude: number;
    deliveryLongitude: number;
    associatedCourierId: string | null;
    status: string;
    items: OrderItem[];
    totalPrice: number;
}

interface RoutingData{
    code: string;
    routes: Route[];
    waypoints: Waypoint[];
    currentGPS: Coordinate;
	currentHeading: number,
    courierId: string;
    activeOrder: Order | null;
}

export const useRoutingStore = defineStore("routingStore", {
	state: (): RoutingData => ({
		code: "NotLoaded",
		routes: [],
		waypoints: [],
		currentGPS: [0,0],
		currentHeading: 0,
		courierId: "",
        activeOrder: null,
	}),

	actions:{
		async syncRoutingData(){
			const { getRoutingData } = useRoutingEngineApi();
			const nuxtApp=useNuxtApp();
			const $DEBUG = await nuxtApp.$DEBUG;

			try{
				const data:RoutingData = await getRoutingData(this.courierId) as RoutingData;
				this.code=data.code;
				this.routes = data.routes;
				this.waypoints = data.waypoints;
				if($DEBUG) console.log("State: ", this.$state);
			}catch(error){
				this.code= error as string;

    	        let message;
				if (error instanceof Error) message = error.message;
				else message = String(error);

				reportError(message);
			}
		},

		async syncGeolocation(coords: Coordinate, heading: number){
			const ws = getLocationWebSocket();

			// Connect WebSocket if not already connected
			if (!ws.isConnected.value) {
				await new Promise<void>((resolve) => {
					ws.connect(() => {
						// Wait until connected
						if (ws.isConnected.value) {
							resolve();
						}
					});
					// Fallback timeout in case connection takes time
					setTimeout(() => resolve(), 2000);
				});
			}

		    this.currentGPS=coords;
			if(heading) this.currentHeading= +heading.toFixed(0);

			const location={
				courierId: "courier" + this.courierId,
				latitude: this.currentGPS[1],
				longitude: this.currentGPS[0],
				heading: this.currentHeading || 0,
			};

			ws.sendLocationUpdate(location);
		},

		setCourierId(courierId: string){
			// Normalize: remove "courier" prefix if present, store just the ID
			this.courierId = courierId?.replace(/^courier/, "") || "";
		},

        setActiveOrder(order: Order | null) {
            this.activeOrder = order;
        },

        async fetchActiveOrder() {
            if (!this.courierId) {
                return null;
            }

            try {
                const apiBase = "http://localhost:8080/api";
                const fullCourierId = this.courierId.startsWith("courier") ? this.courierId : "courier" + this.courierId;
                const order = await $fetch(`${apiBase}/orders/courier/${fullCourierId}/active`);
                this.activeOrder = order;
                return order;
            } catch (error) {
                this.activeOrder = null;
                return null;
            }
        },
	},
});
