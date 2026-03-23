<template>
	<div class="flex flex-row w-full">
		<h1 class="text-text-primary">{{ props.name }}</h1>
		<button
			class="bg-warning ml-auto px-3 py-0.5 border border-border-default rounded-full text-center" 
			@click="deleteOrder"
		>Elimina</button>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
		default: "Pizza",
	},
});

const emit = defineEmits(["delete-order"]);

const deleteOrder = () => {
	emit("delete-order");
};
</script>

<style>

</style>