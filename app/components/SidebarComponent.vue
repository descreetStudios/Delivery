<template>
	<div class="flex bg-bg-surface h-screen overflow-hidden font-mono">

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
					class="bg-bg-surface shadow-lg rounded-full size-11 text-text-primary"
					@click="toggleCollapse"
				/>
			</div>
		</Transition>

		<!-- Sidebar -->
		<aside
			:style="{ width: isCollapsed ? '0px' : sidebarWidth + 'px' }"
			class="relative flex flex-col bg-bg-surface border-border-default border-r overflow-hidden transition-[width] duration-300 ease-in-out pointer-events-auto shrink-0"
		>
			<!-- Toggle button -->
			<template v-if="!isCollapsed">
				<div class="flex items-center p-1 shrink-0">
					<UButton
						icon="i-heroicons-bars-3-20-solid"
						color="neutral"
						variant="ghost"
						class="size-17 text-text-primary"
						@click="toggleCollapse"
					/>
				</div>
				<slot name="sidebar" />
			</template>
		</aside>

		<!-- Main content -->
		<main class="relative flex-1 overflow-hidden">
			<slot />
		</main>
	</div>
</template>

<script lang="ts" setup>
// Settings
const DEFAULT_WIDTH = 420;

// Refs
const sidebarWidth = ref(DEFAULT_WIDTH);
let oldSidebarWidth = DEFAULT_WIDTH;
const isCollapsed = ref(true);

// Methods
function toggleCollapse() {
	if (!isCollapsed.value) {
		oldSidebarWidth = sidebarWidth.value;
		isCollapsed.value = true;
	} else {
		isCollapsed.value = false;
		sidebarWidth.value = oldSidebarWidth;
	}
}
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