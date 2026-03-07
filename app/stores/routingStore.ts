import { defineStore } from "pinia";

type Coordinate = [number, number];

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
    loaded:boolean;
    routes:Route[];
    waypoints: Waypoint[];
}

export const useRoutingStore = defineStore("routingStore", {
	state: (): RoutingData => ({
		loaded: false,
		routes:[],
		waypoints: [],
	}),
});