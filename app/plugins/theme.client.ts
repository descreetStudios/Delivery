export default defineNuxtPlugin(() => {
    const DEBUG = false;
    const theme = "dark";

    if (import.meta.client) {
        document.documentElement.setAttribute("data-theme", theme ?? "dark");
        if (DEBUG) console.log("Tema aggiornato:", theme);
    }
});
