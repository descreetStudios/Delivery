<template>
	<div class="z-5 absolute flex-col h-full overflow-hidden font-mono home-highlight">

		<!-- Floating toggle button -->
		<Transition name="float">
			<div
				v-if="isCollapsed"
				class="top-4 left-4 z-50 fixed"
			>
				<UButton
					icon="i-heroicons-bars-3-20-solid"
					color="neutral"
					variant="solid"
					class="flex justify-center items-center bg-bg-root shadow-lg border border-border-default rounded-full size-11 text-text-primary cursor-pointer"
					@click="toggleCollapse"
				/>
			</div>
		</Transition>

		<!-- Sidebar -->
		<aside
			:style="{ width: isCollapsed ? '0px' : sidebarWidth + 'px' }"
			class="relative flex flex-col bg-bg-root border-border-default border-r h-full overflow-x-hidden transition-all duration-300 ease-in-out pointer-events-auto shrink-0"
		>
			<!-- Toggle button -->
			<div
				v-show="!isCollapsed"
				class="flex items-center p-1 shrink-0"
			>
				<UButton
					icon="i-heroicons-bars-3-20-solid"
					color="neutral"
					variant="ghost"
					class="flex justify-center items-center size-17 text-text-primary cursor-pointer"
					@click="toggleCollapse"
				/>
				<h1 class="text-text-primary text-2xl">Delivery</h1>
				<slot name="header" />
			</div>
			<div
				v-show="!isCollapsed"
				class="relative flex flex-col items-center gap-5 p-7.5"
			>
				<slot name="sidebar" />
			</div>
		</aside>
	</div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";

onMounted(()=>{
	toggleCollapse();
});

const { width } = useWindowSize();
const DEFAULT_WIDTH = 420;

// State
const sidebarWidth = computed(() => width.value <= 640 ? width.value : DEFAULT_WIDTH);
const oldSidebarWidth = ref(DEFAULT_WIDTH);
const isCollapsed = ref(true); 

// Toggle logic
const toggleCollapse = () => {
	if (isCollapsed.value) {
		isCollapsed.value = false;
		sidebarWidth.value = oldSidebarWidth.value || DEFAULT_WIDTH;
	} else {
		oldSidebarWidth.value = sidebarWidth.value;
		isCollapsed.value = true;
	}
};
</script>

<style scoped>
.float-enter-active,
.float-leave-active {
	transition: opacity 0.15s ease, transform 0.15s ease;
}

.float-enter-from,
.float-leave-to {
	opacity: 0;
	transform: scale(0.8);
}
</style>