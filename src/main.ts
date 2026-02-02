// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "unfonts.css";
import { Icon } from "@iconify/vue";
import keycloak from "./config/keycloak";

keycloak
  .init({ onLoad: "login-required", checkLoginIframe: false })
  .then((auth) => {
    if (auth) {
      const app = createApp(App);

      app.component("AppIcon", Icon);
      registerPlugins(app);

      app.mount("#app");
    }
  })
  .catch((err) => {
    console.error("Erro ao inicializar o Keycloak:", err);
  });
