<template>
	<div
		v-if="props.visible"
		class="top-0 left-0 z-1000 fixed flex justify-center items-center bg-black/30 backdrop-blur-sm w-full h-full home-highlight"
		@click="handleBackgroundClick"
	>
		<div
			class="backdrop-blur-sm p-6 rounded-lg max-w-md bg-text-tertiary"
			@click.stop
		>
			<h2 class="mb-4 font-bold text-white text-xl">
				{{ props.title }}
			</h2>
			<div class="space-y-2 text-white">
				<p><span class="font-semibold">Order:</span> {{ props.orderId }}</p>
				<p><span class="font-semibold">Status:</span> {{ props.message }}</p>
			</div>
			<button
				class="bg-bg-secondary hover:bg-[oklch(0.70_0.1724_51.27)] mt-4 px-4 py-2 rounded-lg w-full text-white transition-colors"
				@click="handleClose"
			>
				{{$t('StatusModalComponent.Close')}}
			</button>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: "",
	},
	orderId: {
		type: String,
		default: "",
	},
	message: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["update:visible", "close"]);

const handleBackgroundClick = () => {
	emit("update:visible", false);
	emit("close");
};

const handleClose = () => {
	emit("update:visible", false);
	emit("close");
};
</script>
