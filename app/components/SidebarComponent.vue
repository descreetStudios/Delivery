<template>
	<div class="flex bg-bg-surface h-screen overflow-hidden font-mono">

		<!-- Sidebar -->
		<aside
			:style="{ width: sidebarWidth + 'px' }"
			class="relative flex flex-col bg-bg-surface border-border-default border-r overflow-hidden shrink-0"
		>
			<!-- Toggle button -->
			<div class="flex items-center p-1 shrink-0">
				<UButton
					icon="i-heroicons-bars-3-20-solid"
					color="neutral"
					variant="ghost"
					class="size-11 text-text-primary"
					@click="toggleCollapse"
				/>
			</div>

			<!-- Content -->
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
const COLLAPSED_WIDTH = 56;

// Refs
const sidebarWidth = ref(DEFAULT_WIDTH);
let oldSidebarWidth = DEFAULT_WIDTH;
const isCollapsed = computed(() => sidebarWidth.value <= COLLAPSED_WIDTH);

// Methods
function toggleCollapse() {
	if (!isCollapsed.value)
		oldSidebarWidth = sidebarWidth.value;
	sidebarWidth.value = isCollapsed.value ? oldSidebarWidth : COLLAPSED_WIDTH;
}

// Setup
</script>

<style>

</style>