/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "unfonts.css";
import { Icon } from "@iconify/vue";

const app = createApp(App);

app.component("AppIcon", Icon);
registerPlugins(app);

app.mount("#app");
