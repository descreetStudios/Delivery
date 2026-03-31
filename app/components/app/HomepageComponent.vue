<template>
	<div class="bg-bg-home overflow-hidden home-highlight">
		<section class="flex flex-col justify-center items-center gap-8 h-screen text-center">
			<h1 class="text-7xl whitespace-nowrap">
				<span class="font-barlow">{{ $t('HomePageComponent.yourNext') }} </span>
				<span class="font-modak text-text-home text-8xl">{{ $t('HomePageComponent.meal') }} </span>
				<span class="font-barlow">{{ $t('HomePageComponent.already') }} </span>
				<span
					class="bg-bg-secondary-home py-1 pr-2 rounded-lg font-orbitron italic tracking-wide select-none"
				>{{
					$t('HomePageComponent.onTheWay') }} </span>
			</h1>
			<p class="font-barlow text-text-home text-3xl">
				{{ $t('HomePageComponent.how') }}
			</p>
			<div class="top-[10%] relative flex flex-col items-center gap-1 translate-x-[-50%] translate-y-[-50%]">
				<span class="block border-black border-r border-b w-8 h-8 animate-arrows" />
				<span class="block border-black border-r border-b w-8 h-8 animate-arrows [animation-delay:-0.2s]" />
				<span class="block border-black border-r border-b w-8 h-8 animate-arrows [animation-delay:-0.4s]" />
			</div>
		</section>

		<section
			v-for="section in sections"
			:id="section.id"
			:key="section.id"
			:class="['flex items-center p-15 transition-all ease-in-out', { 'flex-row-reverse': section.reversed }]"
		>
			<NuxtImg
				:src="section.image"
				:alt="section.title"
				class="ml-0 w-125 h-auto"
				loading="lazy"
				format="webp"
				@dragstart.prevent
			/>
			<div class="flex flex-col ml-auto max-w-200">
				<h2 class="pb-6 pl-1.25 font-semibold text-text-home text-5xl">
					{{ section.title }}
				</h2>
				<div
					class="bg-[rgba(255,255,255,0.08)] shadow-2xl backdrop-blur-lg p-4 border-3 border-text-home rounded-2xl text-black text-2xl leading-8"
				>
					<template v-if="section.links">
						<NuxtLink
							v-for="(text, i) in section.links"
							:key="i"
							:to="text.to"
							class="text-bg-secondary-home selection:text-white hover:underline no-underline"
							@dragstart.prevent
						>
							<p class="my-2">{{ text.label }}</p>
						</NuxtLink>
						<p class="my-2">{{ section.description }}</p>
					</template>
					<template v-else>
						<p class="my-2">{{ section.description }}</p>
					</template>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
const { t } = useI18n();

const sections = computed(() => [
	{
		id: "hero",
		title: t("sections.hero.title"),
		image: "/images/hero.png",
		description: t("sections.hero.description"),
	},

	{
		id: "restaurants",
		title: t("sections.restaurants.title"),
		image: "/images/restaurants.png",
		description: t("sections.restaurants.description"),
		reversed: true,
	},

	{
		id: "delivery",
		title: t("sections.delivery.title"),
		image: "/images/delivery.png",
		description: t("sections.delivery.description"),
	},

	{
		id: "how-it-works",
		title: t("sections.how.title"),
		image: "/images/howItWorks.png",
		description: t("sections.how.description"),
		links: [{ to: "/UserPage", label: t("sections.how.link") }],
		reversed: true,
	},

	{
		id: "riders",
		title: t("sections.riders.title"),
		image: "/images/riders.png",
		description: t("sections.riders.description"),
		links: [{ to: "/RiderPage", label: t("sections.riders.link") }],
	},
]);

</script>