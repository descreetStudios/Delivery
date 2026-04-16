<template>
	<footer class="bg-bg-secondary-home py-10 pt-4 pr-4 pl-4 border-t-2 border-t-border font-barlow">
		<div class="flex flex-wrap justify-between items-center gap-10 m-0 mx-auto max-w-7xl">
			<!-- Left: Info -->
			<div class="flex-1 min-w-62.5 font-semibold text-black">
				<p>&copy; {{ currentYear }} {{ $t('FooterComponent.foot') }}</p>
				<p>
					{{ $t('FooterComponent.secondFoot') }}
					<NuxtLink
						to="/License"
						class="font-semibold text-bg-home hover:text-secondary-hover hover:underline no-underline"
						@dragstart.prevent
					>AGPL-3.0 License</NuxtLink>
				</p>
				<p>{{$t('FooterComponent.design')}}
					<a
						href="http://www.freepik.com"
						class="font-semibold text-bg-home hover:text-secondary-hover hover:underline no-underline"
						target="_blank"
						rel="noopener noreferrer"
					>Freepik</a>
				</p>
			</div>

			<!-- Right: Tech Stack -->
			<div class="flex flex-wrap justify-center items-center gap-4 min-w-62.5">
				<div class="flex items-center gap-6">
					<div class="flex flex-col justify-center gap-4">
						<h4 class="font-bold text-black text-lg text-center">
							{{ $t('FooterComponent.built') }}
						</h4>
						<div class="flex flex-wrap justify-center items-center gap-6">
							<NuxtLink
								href="https://nuxt.com"
								target="_blank"
								rel="noopener noreferrer"
								class="flex flex-col justify-center items-center bg-bg-home shadow-2xl p-4 border-2 border-text-home rounded-xl focus:outline-none w-26 h-26 text-secondary-text text-center transition-all hover:-translate-y-1 duration-200 ease-in-out"
								@dragstart.prevent
							>
								<Icon
									name="logos:nuxt-icon"
									class="mb-2 w-10 h-10 text-inherit pointer-events-auto select-none"
									@dragstart.prevent
								/> <span class="font-semibold text-inherit text-sm">Nuxt 4</span>
							</NuxtLink>
							<NuxtLink
								href="https://vuejs.org/"
								target="_blank"
								rel="noopener noreferrer"
								class="flex flex-col justify-center items-center bg-bg-home shadow-2xl p-4 border-2 border-text-home rounded-xl focus:outline-none w-26 h-26 text-secondary-text text-center transition-all hover:-translate-y-1 duration-200 ease-in-out"
								@dragstart.prevent
							>
								<Icon
									name="logos:vue"
									class="mb-2 w-10 h-10 text-inherit pointer-events-auto select-none"
									@dragstart.prevent
								/> <span class="font-semibold text-inherit text-sm">Vue.js</span>
							</NuxtLink>
							<NuxtLink
								href="https://tailwindcss.com/"
								target="_blank"
								rel="noopener noreferrer"
								class="flex flex-col justify-center items-center bg-bg-home shadow-2xl p-4 border-2 border-text-home rounded-xl focus:outline-none w-26 h-26 text-secondary-text text-center transition-all hover:-translate-y-1 duration-200 ease-in-out"
								@dragstart.prevent
							>
								<Icon
									name="logos:tailwindcss-icon"
									class="mb-2 w-10 h-10 text-inherit pointer-events-auto select-none"
									@dragstart.prevent
								/> <span
									class="font-semibold text-inherit text-sm"
								>Tailwind</span>
							</NuxtLink>
						</div>
					</div>
				</div>
				<div class="max-[544px]:hidden block border-text-home border-l h-28" />
				<div class="flex flex-col items-center gap-4 ml-2">
					<h4 class="font-bold text-black text-lg text-center">{{ $t('FooterComponent.support') }}</h4>
					<NuxtLink
						href="https://github.com/descreetStudios/Delivery"
						target="_blank"
						rel="noopener noreferrer"
						class="flex flex-col justify-center items-center bg-bg-home shadow-2xl p-4 border-2 border-text-home rounded-xl focus:outline-none w-26 h-26 text-secondary-text text-center transition-all hover:-translate-y-1 duration-200 ease-in-out"
						@dragstart.prevent
					>
						<Icon
							name="mdi:github"
							class="mb-2 w-10 h-10 text-inherit pointer-events-auto select-none"
							@dragstart.prevent
						/> <span class="font-semibold text-inherit text-sm">GitHub</span>
					</NuxtLink>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>