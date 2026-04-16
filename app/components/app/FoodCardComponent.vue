<template>
	<div
		class="flex flex-col justify-center items-center shadow-lg p-2 border border-border-default rounded-2xl w-full aspect-square bg-text-home text-center"
	>
		<h1 class="text-white">{{ props.name }}</h1>
		<NuxtImg
			class="my-1 w-1/1 h-auto"
			draggable="false"
			:src=props.imgsrc
		/>
		<h2 class="text-white">€{{ props.price.toFixed(2) }}</h2>
		<button
			class="bg-bg-secondary-home px-3 py-0.5 rounded-lg text-center cursor-pointer" 
			@click="buyItem"
		>
			{{ $t('FoodCardComponent.buy') }}
		</button>
	</div>
</template>

<script setup>
const emit = defineEmits(["send-item"]); 

const props = defineProps({
	name: {
		type: String,
		default: "Pizza",
	},
	imgsrc: {
		type: String,
		default: "",
	},
	quantity: {
		type: Number,
		default: 1,
	},
	price: {
		type: Number,
		default: 0,
	},
});

const buyItem = () => {
	const item = {
		name: props.name,
		quantity: props.quantity,
		price: props.price,
	};
	emit("send-item", item);
};

</script>