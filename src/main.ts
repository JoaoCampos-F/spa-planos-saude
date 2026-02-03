import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import { createApp } from "vue";
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

    const sso = ssoStore();
    sso.setKeyCloak(keycloak);

    if (auth) {
      try {
        const rptResponse = await fetch(
          `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${keycloak.token}`,
            },
            body: new URLSearchParams({
              grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
              audience: "api-planos-saude",
            }),
          },
        );

        if (rptResponse.ok) {
          const rptData = await rptResponse.json();

          keycloak.token = rptData.access_token;

          const tokenParsed = JSON.parse(
            atob(rptData.access_token.split(".")[1]),
          );
        } else {
          console.warn(
            "⚠️ Não foi possível obter RPT, usando access token normal",
          );
        }
      } catch (error) {
        console.error("❌ Erro ao solicitar RPT:", error);
      }

      app.mount("#app");

      (async () => {
        try {
          const storePermission = permissions();
          storePermission.setLoading(true);

          const { data } = await Auth().list({});
          storePermission.setPermissions(data);
          console.log("✅ Permissões carregadas:", data.roles);

          const currentUserSystem = await Colaborador().list({});
          const storeUserSystem = userSystem();
          storeUserSystem.setUserSystem(currentUserSystem.data);
          console.log("✅ Dados do colaborador carregados");

          storePermission.setLoading(false);
        } catch (error) {
          console.error("❌ Erro ao carregar dados do usuário:", error);
          const storePermission = permissions();
          storePermission.setLoading(false);
        }
      })();

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
