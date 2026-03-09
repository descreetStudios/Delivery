export default defineNuxtPlugin(() => {
	const { $DEBUG } = useNuxtApp();
	const theme = "light";

	if (import.meta.client) {
		document.documentElement.setAttribute("data-theme", theme ?? "dark");
		if ($DEBUG) console.log("Updated theme: ", theme);
	}
});
