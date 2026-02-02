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
import { ssoStore } from "./stores/sso";
import canDirective from "./support/directives/can";
import Auth from "./services/http/Auth";
import { permissions } from "./stores/permissionsStore";
import Colaborador from "./services/http/Auth/Colaborador";
import { userSystem } from "./stores/userSystem";
import { diffInSeconds } from "./utils/diffInSeconds";

keycloak
  .init({ onLoad: "login-required", checkLoginIframe: false })
  .then(async (auth) => {
    const app = createApp(App);
    app.component("AppIcon", Icon);
    registerPlugins(app);
    app.use(canDirective);

    // 1️⃣ Armazena instância Keycloak
    const sso = ssoStore();
    sso.setKeyCloak(keycloak);

    if (auth) {
      app.mount("#app");

      // 2️⃣ Busca permissões do usuário
      try {
        const { data } = await Auth().store({});
        const storePermission = permissions();
        storePermission.setPermissions(data);
        console.log("✅ Permissões carregadas:", data.roles);
      } catch (error) {
        console.error("❌ Erro ao buscar permissões:", error);
      }

      // 3️⃣ Busca dados do colaborador
      try {
        const currentUserSystem = await Colaborador().list({});
        const storeUserSystem = userSystem();
        storeUserSystem.setUserSystem(currentUserSystem.data);
        console.log("✅ Dados do colaborador carregados");
      } catch (error) {
        console.error("❌ Erro ao buscar dados do colaborador:", error);
      }

      // 4️⃣ Auto-refresh de token (30s antes de expirar)
      const timestampExpired = keycloak.tokenParsed?.exp || 0;
      const datetimeExpired = new Date(timestampExpired * 1000);
      const timeSecondsExpiredToken = diffInSeconds(
        new Date(),
        datetimeExpired,
      );
      const intervalRefreshToken = (timeSecondsExpiredToken - 30) * 1000;

      console.log(
        `🔄 Token expira em ${timeSecondsExpiredToken}s. Refresh em ${timeSecondsExpiredToken - 30}s`,
      );

      setInterval(() => {
        keycloak.updateToken(40).then((refreshToken) => {
          console.log("🔄 Token atualizado:", refreshToken);
        });
      }, intervalRefreshToken);
    }
  })
  .catch((err) => {
    console.error("Erro ao inicializar o Keycloak:", err);
  });
