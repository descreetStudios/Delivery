<template>
	<div class="absolute flex flex-1 justify-center items-center bg-bg-root w-full h-full">
		<video
			class="w-150 h-auto"
			autoplay
			muted
			loop
			playsinline
		>
			<source
				src="/videos/loading.webm"
				type="video/webm"
			>
			<source
				src="/videos/loading.mp4"
				type="video/mp4"
			>
		</video>
	</div>
</template>