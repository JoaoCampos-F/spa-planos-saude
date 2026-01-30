/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
// import { setupLayouts } from 'virtual:generated-layouts'
// import { routes } from 'vue-router/auto-routes'
import SideBarNavigation from "@/layouts/sidebar-navigation/index.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
import PageDashboard from "@/pages/dashboard/index.vue";
import PageRelatorioDados from "@/pages/relatorios/dados/index.vue";
import PageRelatorioNotas from "@/pages/relatorios/notas/index.vue";
import PageRelatorioValoresPossiveis from "@/pages/relatorios/valores-possiveis/index.vue";
import PageRelatorioFinal from "@/pages/relatorios/final/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/relatorios/dados",
      name: "SideBarNavigation",
      component: SideBarNavigation,
      meta: { requiresAuth: true },
      children: [
        {
          path: "/dashboard",
          name: "PageDashboard",
          component: PageDashboard,
        },
        {
          path: "/relatorios",
          name: "PageRelatorios",
          children: [
            {
              path: "dados",
              name: "PageRelatorioDados",
              component: PageRelatorioDados,
            },
            {
              path: "notas",
              name: "PageRelatorioNotas",
              component: PageRelatorioNotas,
            },
            {
              path: "valores-possiveis",
              name: "PageRelatorioValoresPossiveis",
              component: PageRelatorioValoresPossiveis,
            },
            {
              path: "final",
              name: "PageRelatorioFinal",
              component: PageRelatorioFinal,
            },
          ],
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "PageNotFound",
      component: PageNotFound,
      meta: { title: "404 - Página Não Encontrada" },
    },
  ],
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
