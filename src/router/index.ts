import { createRouter, createWebHistory } from "vue-router";
import SideBarNavigation from "@/layouts/sidebar-navigation/index.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
import keycloak from "@/config/keycloak";
import { permissions } from "@/stores/permissionsStore";
import PageImportacao from "@/pages/importacao/index.vue";
import PageColaboradores from "@/pages/colaboradores/index.vue";
import PageProcessos from "@/pages/processos/index.vue";
import PageProcessosHistorico from "@/pages/processos/historico.vue";
import PageDashboard from "@/pages/dashboard/index.vue";

import PageRelatorios from "@/pages/relatorios/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      redirect: (to) => {
        return "/relatorios";
      },
      name: "SideBarNavigation",
      component: SideBarNavigation,
      meta: { requiresAuth: true },
      children: [
        {
          path: "/importacao",
          name: "PageImportacao",
          component: PageImportacao,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },
        {
          path: "/colaboradores",
          name: "PageColaboradores",
          component: PageColaboradores,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },
        {
          path: "/dashboard",
          name: "PageDashboard",
          component: PageDashboard,
          meta: { requiresAuth: true, roles: ["COLABORADOR", "ADMIN", "DP"] },
        },
        {
          path: "/relatorios",
          name: "PageRelatorios",
          component: PageRelatorios,
          meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  if (requiresAuth && !keycloak.authenticated) {
    keycloak.login();
    return;
  }
  if (to.path === "/" || to.name === "SideBarNavigation") {
    const storePermission = permissions();

    if (!storePermission.isLoading) {
      const userRoles = storePermission.getRoles;
      if (userRoles.includes("ADMIN") || userRoles.includes("DP")) {
        next({ name: "PageImportacao" });
        return;
      } else if (userRoles.includes("COLABORADOR")) {
        next({ name: "PageDashboard" });
        return;
      } else {
        next({ name: "PageRelatorios" });
        return;
      }
    } else {
      // Enquanto carrega, redireciona para dashboard se for colaborador
      const userRoles = storePermission.getRoles;
      if (userRoles.includes("COLABORADOR")) {
        next({ name: "PageDashboard" });
      } else {
        next({ name: "PageRelatorios" });
      }
      return;
    }
  }

  const requiredRoles = to.meta.roles as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const storePermission = permissions();
    if (storePermission.isLoading) {
      next();
      const unwatch = storePermission.$subscribe((mutation, state) => {
        if (!state.loading) {
          unwatch();
          const userRoles = storePermission.getRoles;
          const hasRole = requiredRoles.some((role) =>
            userRoles.includes(role.toUpperCase()),
          );

          if (!hasRole && router.currentRoute.value.path === to.path) {
            router.push({ name: "PageRelatorios" });
          }
        }
      });

      return;
    }

    const userRoles = storePermission.getRoles;

    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role.toUpperCase()),
    );

    if (!hasRole) {
      if (to.name !== "PageRelatorios") {
        next({ name: "PageRelatorios" });
      } else {
        next();
      }
      return;
    }
  }

  next();
});

router.onError((err: any, to: any) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
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
