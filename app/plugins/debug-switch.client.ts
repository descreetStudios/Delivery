export default defineNuxtPlugin((nuxtApp) => {

	// Change this to true if you are debugging the website
	// REMEMBER to revert it before pushing to GitHub
	const DEBUG:boolean = false;

	// Use `const { $DEBUG } = useNuxtApp();` inside `.vue`, `.js` and `.ts` files
	// to access the DEBUG flag
 

	nuxtApp.provide("DEBUG", DEBUG);
});