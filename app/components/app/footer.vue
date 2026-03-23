<template>
	<footer class="bg-bg-surface py-10 pt-4 border-t border-t-border font-inter text-text-primary">
		<div class="flex flex-wrap justify-between items-center gap-10 m-0 mx-auto max-w-7xl">
			<!-- Left: Info -->
			<div class="flex-1 min-w-62.5">
				<p>&copy; {{ currentYear }} Untitled Delivery Project. Developed by an independent team. All rights
					reserved.</p>
				<p>
					This project is open-source and licensed under
					<NuxtLink
						to="/license"
						class="font-semibold text-text-secondary hover:text-secondary-hover hover:underline no-underline"
						@dragstart.prevent
					>AGPL-3.0 License</NuxtLink>.
				</p>
				<p>
					By using this site, you agree to the
					<NuxtLink
						to="/terms-and-conditions"
						class="font-semibold text-text-secondary hover:text-secondary-hover hover:underline no-underline"
						@dragstart.prevent
					>Terms and Conditions</NuxtLink>.
				</p>
				<p>
					Read our
					<NuxtLink
						to="/privacy-policy"
						class="font-semibold text-text-secondary hover:text-secondary-hover hover:underline no-underline"
						@dragstart.prevent
					>Privacy Policy</NuxtLink>.
				</p>
			</div>

			<!-- Right: Tech Stack -->
			<div class="flex justify-center items-center gap-4 min-w-62.5">
				<div class="flex items-center gap-6">
					<div class="flex flex-col justify-center gap-4">
						<h4 class="font-bold text-text-primary text-lg text-center">
							Built with
						</h4>
						<div class="flex gap-6">
							<NuxtLink
								href="https://nuxt.com"
								target="_blank"
								rel="noopener noreferrer"
								class="flex flex-col justify-center items-center bg-[rgba(0,220,130,0.18)] shadow-2xl p-4 rounded-xl focus:outline-none w-26 h-26 text-secondary-text text-center transition-all hover:-translate-y-1 duration-200 ease-in-out"
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
								class="flex flex-col justify-center items-center bg-[rgba(66,184,131,0.18)] shadow-2xl p-4 rounded-xl focus:outline-none w-26 h-26 text-secondary-text text-center transition-all hover:-translate-y-1 duration-200 ease-in-out"
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
								class="flex flex-col justify-center items-center bg-[rgba(56,189,248,0.18)] shadow-2xl p-4 rounded-xl focus:outline-none w-26 h-26 text-secondary-text text-center transition-all hover:-translate-y-1 duration-200 ease-in-out"
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
				<div class="border-border-default border-l h-28" />
				<div class="flex flex-col items-center gap-4 ml-2">
					<h4 class="font-bold text-text-primary text-lg text-center">Support us on</h4>
					<NuxtLink
						href="https://github.com/descreetStudios/Delivery"
						target="_blank"
						rel="noopener noreferrer"
						class="flex flex-col justify-center items-center bg-[rgba(130,130,130,0.2)] shadow-2xl p-4 rounded-xl focus:outline-none w-26 h-26 text-secondary-text text-center transition-all hover:-translate-y-1 duration-200 ease-in-out"
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

<style scoped></style>