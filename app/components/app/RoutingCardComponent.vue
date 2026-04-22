<template>
	<div class="flex flex-col w-full">
		<div class="flex flex-row md:justify-center items-center gap-7.5 mb-1 w-full h-25">
			<NuxtImg
				:src="maneuverIcon"
				alt="Direction icon"
				class="w-6 h-6"
				@dragstart.prevent
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
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRoutingStore } from "@/stores/routingStore";

const { t } = useI18n();
const routingStore = useRoutingStore();
const { currentStep } = storeToRefs(routingStore);

const getIcon = (name) => `/images/direction-icons/${name}.svg`;

const MANEUVER_MAP = {
	turn: {
		left: { key: "maneuver.turn.left", icon: "turn_left" },
		right: { key: "maneuver.turn.right", icon: "turn_right" },
		straight: { key: "maneuver.turn.straight", icon: "turn_straight" },
		"slight left": { key: "maneuver.turn.slightLeft", icon: "turn_slight_left" },
		"slight right": { key: "maneuver.turn.slightRight", icon: "turn_slight_right" },
		"sharp left": { key: "maneuver.turn.sharpLeft", icon: "turn_sharp_left" },
		"sharp right": { key: "maneuver.turn.sharpRight", icon: "turn_sharp_right" },
		uturn: { key: "maneuver.turn.uturn", icon: "uturn" },
	},

	continue: {
		straight: { key: "maneuver.continue.straight", icon: "continue_straight" },
		left: { key: "maneuver.continue.left", icon: "continue_left" },
		right: { key: "maneuver.continue.right", icon: "continue_right" },
		"slight left": { key: "maneuver.continue.slightLeft", icon: "continue_slight_left" },
		"slight right": { key: "maneuver.continue.slightRight", icon: "continue_slight_right" },
		uturn: { key: "maneuver.continue.uturn", icon: "continue_uturn" },
		"sharp left": { key: "maneuver.continue.sharpLeft", icon: "continue" },
		"sharp right": { key: "maneuver.continue.sharpRight", icon: "continue" },
	},

	merge: {
		left: { key: "maneuver.merge.left", icon: "merge_left" },
		right: { key: "maneuver.merge.right", icon: "merge_right" },
		straight: { key: "maneuver.merge.straight", icon: "merge_straight" },
		"slight left": { key: "maneuver.merge.slightLeft", icon: "merge_slight_left" },
		"slight right": { key: "maneuver.merge.slightRight", icon: "merge_slight_right" },
	},

	fork: {
		left: { key: "maneuver.fork.left", icon: "fork_left" },
		right: { key: "maneuver.fork.right", icon: "fork_right" },
		straight: { key: "maneuver.fork.straight", icon: "fork_straight" },
	},

	"on ramp": {
		left: { key: "maneuver.onRamp.left", icon: "on_ramp_left" },
		right: { key: "maneuver.onRamp.right", icon: "on_ramp_right" },
		straight: { key: "maneuver.onRamp.straight", icon: "on_ramp_straight" },
		"slight left": { key: "maneuver.onRamp.slightLeft", icon: "on_ramp_slight_left" },
		"slight right": { key: "maneuver.onRamp.slightRight", icon: "on_ramp_slight_right" },
		"sharp left": { key: "maneuver.onRamp.sharpLeft", icon: "on_ramp_sharp_left" },
		"sharp right": { key: "maneuver.onRamp.sharpRight", icon: "on_ramp_sharp_right" },
	},

	"off ramp": {
		left: { key: "maneuver.offRamp.left", icon: "off_ramp_left" },
		right: { key: "maneuver.offRamp.right", icon: "off_ramp_right" },
		straight: { key: "maneuver.offRamp.straight", icon: "off_ramp_straight" },
		"slight left": { key: "maneuver.offRamp.slightLeft", icon: "off_ramp_slight_left" },
		"slight right": { key: "maneuver.offRamp.slightRight", icon: "off_ramp_slight_right" },
	},

	"end of road": {
		left: { key: "maneuver.endOfRoad.left", icon: "end_of_road_left" },
		right: { key: "maneuver.endOfRoad.right", icon: "end_of_road_right" },
	},

	"new name": {
		left: { key: "maneuver.newName.left", icon: "new_name_left" },
		right: { key: "maneuver.newName.right", icon: "new_name_right" },
		straight: { key: "maneuver.newName.straight", icon: "new_name_straight" },
		"slight left": { key: "maneuver.newName.slightLeft", icon: "new_name_slight_left" },
		"slight right": { key: "maneuver.newName.slightRight", icon: "new_name_slight_right" },
		"sharp left": { key: "maneuver.newName.sharpLeft", icon: "new_name_sharp_left" },
		"sharp right": { key: "maneuver.newName.sharpRight", icon: "new_name_sharp_right" },
	},

	roundabout: {
		default: { key: "maneuver.roundabout", icon: "roundabout" },
	},

	rotary: {
		default: { key: "maneuver.rotary", icon: "rotary" },
	},

	"roundabout turn": {
		left: { key: "maneuver.roundaboutTurn.left", icon: "roundabout_left" },
		right: { key: "maneuver.roundaboutTurn.right", icon: "roundabout_right" },
		straight: { key: "maneuver.roundaboutTurn.straight", icon: "roundabout_straight" },
		"slight left": { key: "maneuver.roundaboutTurn.slightLeft", icon: "roundabout_slight_left" },
		"slight right": { key: "maneuver.roundaboutTurn.slightRight", icon: "roundabout_slight_right" },
		"sharp left": { key: "maneuver.roundaboutTurn.sharpLeft", icon: "roundabout_sharp_left" },
		"sharp right": { key: "maneuver.roundaboutTurn.sharpRight", icon: "roundabout_sharp_right" },
		uturn: { key: "maneuver.roundaboutTurn.uturn", icon: "roundabout" },
	},

	"exit roundabout": {
		left: { key: "maneuver.exitRoundabout.left", icon: "roundabout_left" },
		right: { key: "maneuver.exitRoundabout.right", icon: "roundabout_right" },
		straight: { key: "maneuver.exitRoundabout.straight", icon: "roundabout_straight" },
		uturn: { key: "maneuver.exitRoundabout.uturn", icon: "roundabout" },
	},

	"exit rotary": {
		left: { key: "maneuver.exitRotary.left", icon: "rotary_left" },
		right: { key: "maneuver.exitRotary.right", icon: "rotary_right" },
		straight: { key: "maneuver.exitRotary.straight", icon: "rotary_straight" },
		uturn: { key: "maneuver.exitRotary.uturn", icon: "rotary" },
	},

	arrive: {
		default: { key: "maneuver.arrive", icon: "arrive" },
	},

	depart: {
		default: { key: "maneuver.depart", icon: "depart" },
	},

	use_lane: {
		default: { key: "maneuver.useLane", icon: "updown" },
	},

	notification: {
		default: { key: "maneuver.notification", icon: "notification_straight" },
	},
};

function resolveInstruction(step) {
	const maneuver = step?.maneuver;
	if (!maneuver) return { key: "maneuver.unknown", icon: "updown" };

	const type = maneuver.type;
	const modifier = maneuver.modifier;

	const config = MANEUVER_MAP[type];

	if (!config) {
		return {
			key: "maneuver.unknown",
			icon: "updown",
		};
	}

	const selected =
		(modifier && config[modifier]) ||
		config.default;

	if (!selected) {
		return {
			key: "maneuver.unknown",
			icon: "updown",
		};
	}

	return {
		key: selected.key,
		icon: selected.icon,
	};
}

function formatDistance(dist) {
	if (dist == null) return "";

	if (dist >= 1000) {
		const km = dist / 1000;
		return `${km % 1 === 0 ? km : km.toFixed(1)} km`;
	}
	return `${Math.round(dist)} m`;
}

const resolvedInstruction = computed(() => {
	const step = currentStep.value;
	if (!step) return null;
	return resolveInstruction(step);
});

const maneuverIcon = computed(() => {
	if (!resolvedInstruction.value) return "";
	return getIcon(resolvedInstruction.value.icon);
});

const maneuverInstructions = computed(() => {
	const step = currentStep.value;
	const resolved = resolvedInstruction.value;

	if (!step || !resolved) return null;

	const distanceText = formatDistance(step.distance);

	return {
		instruction: t(resolved.key, {
			distance: distanceText,
		}),
		roadName: step.name?.trim() || "",
	};
});

const instructionText = computed(
	() => maneuverInstructions.value?.instruction || "",
);

const roadName = computed(
	() => maneuverInstructions.value?.roadName || "",
);
</script>
