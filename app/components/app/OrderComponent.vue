<template>
	<div class="flex flex-row items-center p-2 rounded-lg w-full bg-text-tertiary">
		<div class="flex flex-col w-full">
			<h1 class="text-white">{{ props.name }}</h1>
			<h2 class="text-white">€{{ props.price.toFixed(2) }}</h2>
		</div>
		<button
			class="bg-bg-secondary ml-auto px-3 py-0.5 rounded-lg h-fit text-center cursor-pointer"
			@click="deleteItem"
		>{{ $t('OrderComponent.delete') }}</button>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
		default: "Pizza",
	},
	price: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits(["delete-item"]);

const deleteItem = () => {
	emit("delete-item");
};
</script>