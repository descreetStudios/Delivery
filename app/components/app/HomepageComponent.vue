<template>
	<div class="bg-bg-home overflow-hidden home-highlight">
		<section class="flex flex-col justify-center items-center gap-8 h-screen text-center">
			<h1 class="text-7xl whitespace-nowrap">
				<span class="font-barlow">Your next </span>
				<span class="font-fredoka font-semibold text-text-home text-8xl">meal</span>
				<span class="font-barlow">, already </span>
				<span class="bg-bg-secondary-home py-1 pr-2 rounded-lg font-orbitron italic tracking-wide select-none">on the way</span>
			</h1>
			<p class="font-barlow text-text-home text-3xl">
				How does it work?
			</p>
			<div class="top-[10%] relative flex flex-col items-center gap-1 translate-x-[-50%] translate-y-[-50%]">
				<span class="block border-black border-r border-b w-8 h-8 animate-arrows" />
				<span
					class="block border-black border-r border-b w-8 h-8 animate-arrows [animation-delay:-0.2s]"
				/>
				<span
					class="block border-black border-r border-b w-8 h-8 animate-arrows [animation-delay:-0.4s]"
				/>
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
							class="no-underline"
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
const sections = [
	{
		id: "hero",
		title: "Hot Meals, Zero Distance",
		image: "/images/hero.png",
		description:
			"Order from your favorite restaurants and get your food delivered fast, fresh, and right to your door.",
	},

	{
		id: "restaurants",
		title: "Explore Local Restaurants",
		image: "/images/restaurants.png",
		description:
			"Browse a wide selection of restaurants, from local favorites to trending spots. Whatever you're craving, we've got it.",
		reversed: true,
	},

	{
		id: "delivery",
		title: "Fast & Reliable Delivery",
		image: "/images/delivery.png",
		description:
			"Our riders ensure quick and safe delivery, keeping your food fresh and right on time.",
	},
	{
		id: "how-it-works",
		title: "How It Works",
		image: "/images/howItWorks.png",
		description:
			"1. Choose your meal\n2. Place your order\n3. Track it in real time\n4. Enjoy your food at home",
		links: [{ to: "/signup", label: "Order now" }],
		reversed: true,
	},

	{
		id: "riders",
		title: "Become a Rider",
		image: "/images/riders.png",
		description:
			"Deliver food on your schedule and earn money with flexible hours.",
		links: [{ to: "/apply", label: "Apply now" }],
	},
];
</script>

<style></style>
