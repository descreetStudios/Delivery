<template>
	<div class="flex flex-col w-full">
		<div class="flex flex-row justify-center items-center gap-7.5 w-full h-25">
			<NuxtImg
				class="my-1 w-20 h-auto"
				draggable="false"
				src="/images/pin-icon.png"
				format="webp"
			/>
			<div class="flex flex-col items-start">
				<h1 class="font-semibold text-bg-secondary-home text-md md:text-lg">
					{{ instructionText }}
				</h1>
				<p
					v-if="roadName"
					class="text-text-secondary text-sm"
				>
					{{ roadName }}
				</p>
				<p
					v-if="distanceText"
					class="text-text-secondary text-sm"
				>
					{{ distanceText }}
				</p>
			</div>
		</div>
		<br class="mt-5 w-full">
	</div>
</template>

<script setup>
import { useRoutingStore } from "@/stores/routingStore";

const { t } = useI18n();
const routingStore = useRoutingStore();
const { currentStep } = storeToRefs(routingStore);

const maneuverInstructions = computed(() => {
	const step = currentStep.value;
	if (!step?.maneuver) return null;

	const { type, modifier } = step.maneuver;
	const dist = step.distance;

	// Format distance
	let distanceText = "";
	if (dist != null) {
		if (dist >= 1000) {
			distanceText = `${(dist / 1000).toFixed(1)} km`;
		} else {
			distanceText = `${Math.round(dist)} m`;
		}
	}

	// Build instruction key from type and modifier
	let instructionKey = "";
	if (type === "turn") {
		instructionKey = `maneuver.turn.${modifier || "straight"}`;
	} else if (type === "continue") {
		instructionKey = "maneuver.continue";
	} else if (type === "merge") {
		instructionKey = "maneuver.merge";
	} else if (type === "roundabout" || type === "rotary") {
		instructionKey = "maneuver.roundabout";
	} else if (type === "exit roundabout") {
		instructionKey = "maneuver.exitRoundabout";
	} else if (type === "fork") {
		instructionKey = `maneuver.fork.${modifier || "straight"}`;
	} else if (type === "end of road") {
		instructionKey = `maneuver.endOfRoad.${modifier || "right"}`;
	} else if (type === "new name") {
		instructionKey = "maneuver.newName";
	} else if (type === "arrive") {
		instructionKey = "maneuver.arrive";
	} else if (type === "depart") {
		instructionKey = "maneuver.depart";
	} else if (type === "notification") {
		instructionKey = "maneuver.notification";
	} else {
		// Fallback for unknown types
		instructionKey = `maneuver.turn.${modifier || "straight"}`;
	}

	const instruction = t(instructionKey, { distance: distanceText });

	return {
		instruction,
		distanceText: dist != null ? distanceText : "",
		roadName: step.name || "",
	};
});

const instructionText = computed(() => maneuverInstructions.value?.instruction || "");
const roadName = computed(() => maneuverInstructions.value?.roadName || "");
const distanceText = computed(() => maneuverInstructions.value?.distanceText || "");
</script>