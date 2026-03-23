<template>
	<div
		class="flex flex-col justify-center items-center bg-bg-secondary-surface shadow-lg p-2 border border-border-default rounded-2xl w-full aspect-square text-center"
	>
		<h1 class="text-text-primary">{{ props.name }}</h1>
		<NuxtImg
			class="my-1 w-1/1 h-auto"
			draggable="false"
			:src=props.imgsrc
		/>
		<h2 class="text-text-primary">€{{ props.price.toFixed(2) }}</h2>
		<button
			class="bg-warning px-3 py-0.5 border border-border-default rounded-full text-center" 
			@click="buyFood"
		>
			Compra
		</button>
	</div>
</template>

<script setup>
const emit = defineEmits(["send-order"]); 

const props = defineProps({
	name: {
		type: String,
		default: "Pizza",
	},
	imgsrc: {
		type: String,
		default: "",
	},
	price: {
		type: Number,
		default: 0,
	},
});

const buyFood = () => {
	const order = {
		name: props.name,
		price: props.price,
	};
	emit("send-order", order);
};

</script>