<template>
	<div
		v-if="visible"
		class="top-0 left-0 z-1000 fixed flex justify-center items-center bg-black/30 backdrop-blur-sm w-full h-full"
		@click="handleBackgroundClick"
	>
		<div
			class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 border border-gray-200 dark:border-gray-700 rounded-lg max-w-md"
			@click.stop
		>
			<h2 class="mb-4 font-bold text-gray-900 dark:text-white text-xl">
				{{ title }}
			</h2>
			<div class="space-y-2 text-gray-800 dark:text-gray-200">
				<p><span class="font-semibold">Order:</span> {{ orderId }}</p>
				<p><span class="font-semibold">Status:</span> {{ message }}</p>
			</div>
			<button
				class="bg-blue-500 hover:bg-blue-600 mt-4 px-4 py-2 rounded-full w-full text-white transition-colors"
				@click="handleClose"
			>
				Close
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
		default: '',
	},
	orderId: {
		type: String,
		default: '',
	},
	message: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['update:visible', 'close']);

const handleBackgroundClick = () => {
	emit('update:visible', false);
	emit('close');
};

const handleClose = () => {
	emit('update:visible', false);
	emit('close');
};
</script>
