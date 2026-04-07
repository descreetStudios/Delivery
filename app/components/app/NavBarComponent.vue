<template>
	<div
		class="top-0 left-0 z-10 fixed bg-[rgba(var(--bg),0.2)] backdrop-blur-md w-full h-fit md:h-24 transition-[background,backdrop-filter] duration-300 ease-in-out home-highlight"
	>
		<nav class="flex md:flex-row flex-col justify-between items-center px-5 md:px-10 py-2 md:py-0 w-full h-full">
			<!-- Logo (Left) -->
			<div class="flex flex-row items-center gap-4">
				<NuxtImg
					src="/images/delivery-logo.png"
					alt="Delivery logo"
					class="w-15 md:w-20 h-auto"
					format="webp"
					@dragstart.prevent
				/>
				<strong class="font-barlow font-bold text-xl md:text-2xl">Untitled Delivery Project</strong>
			</div>

			<div class="flex flex-row items-center md:py-0 pt-3">
				<!-- Navigation buttons (Center) -->
				<div class="flex flex-row gap-1 md:gap-10">
					<NuxtLink
						v-for="link in navLinks"
						:key="link.label"
						class="px-3 py-2 font-barlow font-semibold text-md md:text-lg"
						:to="link.to"
						:prefetch="false"
					>
						{{ link.label }}
					</NuxtLink>

					<div class="relative flex flex-col items-center self-center gap-1 w-fit">
						<!-- Language button -->
						<button
							class="flex flex-row items-center gap-1 shadow-md px-3 py-2 rounded-2xl w-full font-barlow font-semibold text-md md:text-lg"
							@click="expandLocalesHandler"
						>
							<img
								:src="`https://flagcdn.com/${currentLocale.flag}.svg`"
								class="block w-5 h-auto object-contain shrink-0"
							>
							<span class="hidden md:inline">{{ currentLocale.name }}</span>
						</button>

						<!-- Dropdown with transition -->
						<Transition
							enter-active-class="transition ease-out duration-200"
							enter-from-class="opacity-0 -translate-y-2 scale-95"
							enter-to-class="opacity-100 translate-y-0 scale-100"
							leave-active-class="transition ease-in duration-150"
							leave-from-class="opacity-100 translate-y-0 scale-100"
							leave-to-class="opacity-0 -translate-y-2 scale-95"
						>
							<div
								v-show="areLocalesExpanded"
								class="top-full left-1/2 z-30 absolute flex flex-col bg-bg-home shadow-md backdrop-blur-sm mt-2 border border-black/10 rounded-xl w-full overflow-hidden text-black -translate-x-1/2"
							>
								<button
									v-for="availableLocale in availableLocales"
									:key="availableLocale.code"
									class="flex flex-row items-center gap-1 hover:bg-black/5 px-3 py-2 text-left transition-colors"
									@click.prevent.stop="setLocaleHandler(availableLocale.code)"
								>
									<img
										:src="`https://flagcdn.com/${availableLocale.flag}.svg`"
										class="block w-5 h-auto object-contain shrink-0"
									>
									<span class="hidden md:inline">{{ availableLocale.name }}</span>
								</button>
							</div>
						</Transition>
					</div>
				</div>
			</div>
		</nav>
	</div>
</template>

<script setup>
const { t, locale, locales, setLocale, setLocaleCookie } = useI18n();
const areLocalesExpanded = ref(false);

const navLinks = computed(() => [
	{ label: t("NavBarComponent.user"), to: "/UserPage" },
	{ label: t("NavBarComponent.rider"), to: "/RiderPage" },
	{ label: t("NavBarComponent.license"), to: "/License" },
]);

const availableLocales = computed(() => {
	return locales.value.filter(i => i.code !== locale.value);
});

const currentLocale = computed(() => {
	switch (locale.value) {
		case "it":
			return { name: "Italiano", flag: "it" };
		case "en":
			return { name: "English", flag: "gb" };
		case "es":
			return { name: "Español", flag: "es" };
		default:
			return "";
	};
});

const setLocaleHandler = (newLocale) => {
	setLocale(newLocale);
	setLocaleCookie(newLocale);
};

const expandLocalesHandler = () => {
	areLocalesExpanded.value = !areLocalesExpanded.value;
};
</script>