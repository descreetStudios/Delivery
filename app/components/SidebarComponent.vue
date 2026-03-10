<template>
	<div class="z-5 absolute flex-col bg-bg-surface h-screen overflow-hidden font-mono">

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
					class="flex justify-center items-center bg-bg-surface shadow-lg rounded-full size-11 text-text-primary"
					@click="toggleCollapse"
				/>
			</div>
		</Transition>

		<!-- Sidebar -->
		<aside
			:style="{ width: isCollapsed ? '0px' : sidebarWidth + 'px' }"
			class="relative flex flex-col bg-bg-surface border-border-default border-r h-screen overflow-hidden transition-all duration-300 ease-in-out pointer-events-auto shrink-0"
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
					class="flex justify-center items-center size-17 text-text-primary"
					@click="toggleCollapse"
				/>
				<h1 class="text-text-primary text-2xl">Delivery</h1>
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
// Settings
const default_width = ref(420);
const screenWidth = ref(0);

// Refs
const sidebarWidth = computed(() => default_width.value);
const oldSidebarWidth = computed(() => default_width.value);
const isCollapsed = ref(true);

// Methods
function toggleCollapse() {
	if (!isCollapsed.value) {
		oldSidebarWidth.value = sidebarWidth.value;
		isCollapsed.value = true;
	} else {
		isCollapsed.value = false;
		sidebarWidth.value = oldSidebarWidth.value;
	}
}

onMounted(() => {
	screenWidth.value = window.innerWidth;
	if (screenWidth.value <= 640) {
		default_width.value = screenWidth.value;
	}
});
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