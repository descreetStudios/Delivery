<template>
	<div
		ref="rootEl"
		class="top-4 left-1/2 z-10 absolute w-105 -translate-x-1/2"
	>
		<div class="top-4 left-1/2 z-10 absolute w-105 -translate-x-1/2">
			<div
				class="flex items-center bg-white shadow-lg px-4 rounded-full h-12"
			>
				<!-- Search Icon -->
				<svg
					v-if="!loading"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>

				<!-- Loading -->
				<svg
					v-else
					class="text-gray-300 animate-spin"
					viewBox="0 0 64 64"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
				>
					<path
						d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
						stroke="currentColor"
						stroke-width="5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
						stroke="currentColor"
						stroke-width="5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-gray-900"
					/>
				</svg>

				<input
					v-model="query"
					type="text"
					placeholder="Go wherever you like"
					class="flex-1 bg-transparent border-0 outline-none focus:outline-none ring-0 focus:ring-0 text-gray-900 text-sm placeholder-gray-600"
					@keydown.down.prevent="next"
					@keydown.up.prevent="prev"
					@keydown.enter.prevent="select(activeIndex)"
				>
			</div>

			<!-- Results -->
			<transition name="dropdown">
				<div
					v-if="!justSelected && (results.length || (!loading && query.length >= 2))"
					class="bg-white shadow-lg mt-2 rounded-xl max-h-60 overflow-hidden overflow-y-auto appearance-none results-scroll"
				>
					<ul>
						<!-- No results -->
						<div
							v-if="!results.length && !loading && query.length >= 2 && !justSelected"
							class="px-4 py-3 text-gray-500 text-sm"
						>
							No results found
						</div>

						<li
							v-for="(item, i) in results"
							:key="i"
							:ref="el => itemRefs[i] = el"
							class="group gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer list-item"
							:class="[
								i === activeIndex
									? 'bg-blue-100 hover:bg-blue-300'
									: ''
							]"
							@click="select(i)"
						>
							<!-- pin -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
								/>
							</svg>

							<div>
								<!-- Label -->
								<p class="font-medium text-sm leading-tight">
									<span
										v-for="(part, idx) in highlightParts(item.label, query)"
										:key="idx"
										:class="part.match
											? 'text-blue-600 font-semibold highlight-anim'
											: 'unhighlight-anim'"
									>
										{{ part.text }}
									</span>
								</p>
								<!-- Description -->
								<p
									v-if="item.description"
									class="text-gray-500 text-xs"
								>
									<span
										v-for="(part, idx) in highlightParts(item.description, query)"
										:key="idx"
										:class="part.match
											? 'text-blue-600 font-semibold highlight-anim'
											: 'unhighlight-anim'"
									>
										{{ part.text }}
									</span>
								</p>
							</div>
						</li>
					</ul>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup>
const DEBUG = false;

const emit = defineEmits(["select"]);

const rootEl = ref(null);
const query = ref("");
const results = ref([]);
const itemRefs = ref([]);
const activeIndex = ref(0);
const loading = ref(false);
const justSelected = ref(false);
const suppressWatch = ref(false);
let debounceTimer;
const cache = new Map();

/**
 * Must return:
 * [{ label, description?, center }]
 */
// TODO: Replace with provider.
const search = async (q) => {
	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5`;

	const res = await fetch(url, {
		headers: {
			"Accept-Language": ["en", "it", "de"],
		},
	});

	const data = await res.json();

	return data.map(item => ({
		label: item.display_name,
		description: item.type,
		center: [parseFloat(item.lon), parseFloat(item.lat)],
	}));
};

watch(query, async (q) => {
	if (suppressWatch.value) return;

	justSelected.value = false;

	clearTimeout(debounceTimer);

	debounceTimer = setTimeout(async () => {
		if (!q || q.length < 2) {
			results.value = [];
			return;
		}

		if (cache.has(q)) {
			results.value = cache.get(q);
			itemRefs.value = [];
			activeIndex.value = 0;
			return;
		}

		loading.value = true;
		const res = await search(q);

		cache.set(q, res);

		results.value = res;
		itemRefs.value = [];
		activeIndex.value = 0;
		loading.value = false;
	}, 250);
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

	justSelected.value = true;
	suppressWatch.value = true;

	query.value = item.label;
	results.value = [];
	
	emit("select", item);

	nextTick(() => {
		suppressWatch.value = false;
	});
};

const next = () => {
	if (activeIndex.value < results.value.length - 1)
		activeIndex.value++;
};

const prev = () => {
	if (activeIndex.value > 0)
		activeIndex.value--;
};

const highlightParts = (label, query) => {
	if (!query) return [{ text: label, match: false }];

	const regex = new RegExp(`(${query})`, "ig");
	const parts = [];
	let lastIndex = 0;

	label.replace(regex, (match, _group, index) => {
		if (index > lastIndex) {
			parts.push({
				text: label.slice(lastIndex, index),
				match: false,
			});
		}
		parts.push({
			text: match,
			match: true,
		});
		lastIndex = index + match.length;
	});

	if (lastIndex < label.length) {
		parts.push({
			text: label.slice(lastIndex),
			match: false,
		});
	}

	return parts;
};

const onKeydown = (e) => {
	if (e.key === "Escape") {
		results.value = [];
		justSelected.value = true;
	}
};

const onClickAway = (e) => {
	if (!rootEl.value) return;

	// Clicks outside
	if (!rootEl.value.contains(e.target)) {
		results.value = [];
		justSelected.value = true;
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
		justSelected.value = true;
	},
});
</script>

<style scoped>
/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Highlight text animation */
.highlight-anim {
  display: inline-block;
  animation: highlightPop 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes highlightPop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Not Highlighted text animation */
.unhighlight-anim {
  display: inline-block;
  animation: unhighlightFade 220ms ease-out;
}

@keyframes unhighlightFade {
  0% {
    opacity: 0;
    transform: translateY(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dropdown animation */
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* List item animation */
.list-item {
  transition: background-color 120ms ease, transform 120ms ease, box-shadow 120ms ease;
}

.list-item:hover {
  transform: translateX(4px);
  background-color: #f3f4f6;
  box-shadow: inset 3px 0 0 #3b82f6;
}

.list-item.bg-blue-100 {
  box-shadow: inset 3px 0 0 #3b82f6;
}

.list-item.bg-blue-100:hover {
  background-color: #bfdbfe;
  transform: translateX(4px);
}
</style>