<template>
	<div
		ref="rootEl"
		class="top-4 left-1/2 z-10 absolute w-105 -translate-x-1/2"
	>
		<div class="top-4 left-1/2 z-10 absolute w-105 -translate-x-1/2">
			<div
				class="flex items-center bg-white shadow-lg px-4 rounded-full h-12"
			>
				<!-- icon -->
				<svg
					class="w-5 h-5 text-gray-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
					/>
				</svg>

				<input
					v-model="query"
					type="text"
					placeholder="Go wherever you like"
					class="flex-1 bg-transparent border-0 outline-none focus:outline-none ring-0 focus:ring-0 text-gray-900 text-sm placeholder-gray-500"
					@keydown.down.prevent="next"
					@keydown.up.prevent="prev"
					@keydown.enter.prevent="select(activeIndex)"
				>
			</div>

			<!-- results -->
			<div
				v-if="results.length"
				class="bg-white shadow-lg mt-2 rounded-xl max-h-60 overflow-hidden overflow-y-auto appearance-none results-scroll"
			>
				<ul>
					<li
						v-for="(item, i) in results"
						:key="i"
						:ref="el => itemRefs[i] = el"
						class="flex gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer"
						:class="[
							i === activeIndex
								? 'bg-blue-100 border-l-2 border-blue-500'
								: 'hover:bg-gray-100 border-transparent'
						]"
						@click="select(i)"
					>
						<!-- pin -->
						<svg
							class="mt-0.5 w-5 h-5 text-gray-500 shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 22s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"
							/>
						</svg>

						<div>
							<p class="font-medium text-sm leading-tight">
								{{ item.label }}
							</p>
							<p
								v-if="item.description"
								class="text-gray-500 text-xs"
							>
								{{ item.description }}
							</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
const DEBUG = false;

const emit = defineEmits(["select"]);

const query = ref("");
const results = ref([]);
const itemRefs = ref([]);
const activeIndex = ref(0);
const loading = ref(false);
const suppressWatch = ref(false);

const rootEl = ref(null);

/**
 * Must return:
 * [{ label, description?, center }]
 */
// TODO: Replace with provider.
const search = async (q) => {
	return [
		{
			label: "Milan",
			description: "City",
			center: [9.18969, 45.46409],
		},
		{
			label: "France",
			description: "City",
			center: [9.18969, 45.46409],
		}];
};

watch(query, async (q) => {
	if (suppressWatch.value) return;

	if (!q || q.length < 2) {
		results.value = [];
		return;
	}

	loading.value = true;
	results.value = await search(q);
	itemRefs.value = [];
	activeIndex.value = 0;
	loading.value = false;
});

watch(activeIndex, () => {
	const el = itemRefs.value[activeIndex.value];
	if (el) {
		el.scrollIntoView({
			block: "nearest",
			behavior: "smooth",
		});
	}
});

const select = (i) => {
	const item = results.value[i];
	if (!item) return;

	if (DEBUG) console.log("Selected search option");

	suppressWatch.value = true;

	query.value = item.label;
	results.value = [];
	
	emit("select", item);

	nextTick(() => suppressWatch.value = false);
};

const next = () => {
	if (activeIndex.value < results.value.length - 1)
		activeIndex.value++;
};

const prev = () => {
	if (activeIndex.value > 0)
		activeIndex.value--;
};

const onKeydown = (e) => {
	if (e.key === "Escape") {
		results.value = [];
	}
};

const onClickAway = (e) => {
	if (!rootEl.value) return;

	// Clicks outside
	if (!rootEl.value.contains(e.target)) {
		results.value = [];
	}
};

onMounted(() => {
	window.addEventListener("keydown", onKeydown);
	document.addEventListener("click", onClickAway);
});

onBeforeUnmount(() => {
	window.removeEventListener("keydown", onKeydown);
	document.removeEventListener("click", onClickAway);
});

defineExpose({
	setResults: (items) => {
		results.value = items;
	},
	clear: () => {
		query.value = "";
		results.value = [];
		itemRefs.value = [];
	},
});
</script>

<style scoped>
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-thumb {
    background: #d1d5db; /* gray-300 */
    border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
    background: #9ca3af; /* gray-400 */
}
</style>