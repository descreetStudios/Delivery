<template>
	<div
		class="top-0 left-0 z-10 fixed bg-[rgba(var(--bg),0.2)] backdrop-blur-md w-full h-24 transition-[background,backdrop-filter] duration-300 ease-in-out home-highlight"
	>
		<nav class="flex justify-between items-center px-10 w-full h-full">
			<!-- Logo (Left) -->
			<div class="flex flex-row items-center gap-4">
				<NuxtImg
					src="/images/delivery-logo.png"
					alt="Delivery logo"
					class="w-20 h-auto"
					format="webp"
					@dragstart.prevent
				/>
				<strong class="font-barlow font-bold text-2xl">Untitled Delivery Project</strong>
			</div>

			<!-- Navigation buttons (Center) -->
			<div class="left-1/2 fixed flex flex-row gap-10 -translate-x-1/2">
				<NuxtLink
					v-for="link in navLinks"
					:key="link.label"
					class="font-barlow font-semibold text-lg"
					:to="link.to"
					@dragstart.prevent
				>{{ link.label }}
				</NuxtLink>
			</div>

			<!-- Language menu (Right) -->
			<!-- TODO: finish style -->
			<div class="inline-block relative">
				<button class="bg-gray-800 px-4 py-2 text-white">
					{{ currentLocale }}
				</button>

				<div class="absolute bg-white shadow-lg mt-2 w-40 text-black">
					<h1
						v-for="Heylocale in availableLocales"
						:key="Heylocale.code"
						class="flex flex-col"
						@click.prevent.stop="setLocaleHandler(Heylocale.code)"
					>
						{{ Heylocale.name }}
					</h1>
				</div>
			</div>
		</nav>
	</div>
</template>

<script setup>
const { locale, locales, setLocale, setLocaleCookie } = useI18n();
const navLinks = [
	{ label: "User", to: "/UserPage" },
	{ label: "Rider", to: "/RiderPage" },
	{ label: "License", to: "/License" },
];
const availableLocales = computed(() => {
	return locales.value.filter(i => i.code !== locale.value);
});
const currentLocale = computed(() => {
	switch (locale.value) {
		case "it":
			return "Italiano";
		case "en":
			return "English";
		case "es":
			return "Español";
		default:
			return "";
	};
});

const setLocaleHandler = (newLocale) => {
	setLocale(newLocale);
	setLocaleCookie(newLocale);
};
</script>