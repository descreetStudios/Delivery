<template>
	<div class="flex flex-row items-center bg-bg-secondary-surface p-2 rounded-lg w-full">
		<div class="flex flex-col w-full">
			<h1 class="text-text-primary">{{ props.name }}</h1>
			<h2 class="text-text-primary">€{{ props.price.toFixed(2) }}</h2>
		</div>
		<button
			class="bg-warning ml-auto px-3 py-0.5 border border-border-default rounded-full h-fit text-center"
			@click="deleteItem"
		>Elimina</button>
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