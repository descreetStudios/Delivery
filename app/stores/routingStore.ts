import { defineStore } from "pinia";

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

interface RoutingData{
    code: string;
    routes: Route[];
    waypoints: Waypoint[];
    currentGPS: Coordinate;
	currentHeading: number,
    courierId: string;
}

export const useRoutingStore = defineStore("routingStore", {
	state: (): RoutingData => ({
		code: "NotLoaded",
		routes: [],
		waypoints: [],
		currentGPS: [0,0],
		currentHeading: 0,
		courierId: "",
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

			if(!ws.isConnected.value){
				return;
			}

		    this.currentGPS=coords;
			if(heading) this.currentHeading= +heading.toFixed(0);

			const location={
				courierId: "courier" + this.courierId,
				latitude: this.currentGPS[1],
				longitude: this.currentGPS[0],
				heading: this.currentHeading,
			};
			
			ws.sendLocationUpdate(location);
		},

		setCourierId(courierId: string){
			this.courierId=courierId;
		},
	},
});
