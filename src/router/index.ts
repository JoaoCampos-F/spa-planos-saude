import { createRouter, createWebHistory } from "vue-router";
import SideBarNavigation from "@/layouts/sidebar-navigation/index.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
import keycloak from "@/config/keycloak";
import { permissions } from "@/stores/permissionsStore";

// Páginas - Importação
import PageImportacao from "@/pages/importacao/index.vue";
import PageImportacaoCnpj from "@/pages/importacao/cnpj.vue";
import PageImportacaoContrato from "@/pages/importacao/contrato.vue";

// Páginas - Colaboradores
import PageColaboradores from "@/pages/colaboradores/index.vue";

// Páginas - Processos
import PageProcessos from "@/pages/processos/index.vue";
import PageProcessosHistorico from "@/pages/processos/historico.vue";

// Páginas - Exportação
import PageExportacao from "@/pages/exportacao/index.vue";

// Páginas - Relatórios
import PageRelatorios from "@/pages/relatorios/index.vue";
import PageRelatorioColaborador from "@/pages/relatorios/colaborador.vue";
import PageRelatorioEmpresa from "@/pages/relatorios/empresa.vue";
import PageRelatorioPagamento from "@/pages/relatorios/pagamento.vue";
import PageRelatorioNaoPagamento from "@/pages/relatorios/nao-pagamento.vue";
import PageRelatorioResumoDepto from "@/pages/relatorios/resumo-depto.vue";
import PageRelatorioResumoCentroCusto from "@/pages/relatorios/centro-custo.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      redirect: (to) => {
        // Redirect será determinado no guard baseado nas roles
        return "/relatorios";
      },
      name: "SideBarNavigation",
      component: SideBarNavigation,
      meta: { requiresAuth: true },
      children: [
        // Módulo Importação (ADMIN, DP)
        {
          path: "/importacao",
          name: "PageImportacao",
          component: PageImportacao,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },
        {
          path: "/importacao/cnpj",
          name: "PageImportacaoCnpj",
          component: PageImportacaoCnpj,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },
        {
          path: "/importacao/contrato",
          name: "PageImportacaoContrato",
          component: PageImportacaoContrato,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },

        // Módulo Colaboradores (ADMIN, DP)
        {
          path: "/colaboradores",
          name: "PageColaboradores",
          component: PageColaboradores,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },

        // Módulo Processos (ADMIN, DP)
        {
          path: "/processos",
          name: "PageProcessos",
          component: PageProcessos,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },
        {
          path: "/processos/historico",
          name: "PageProcessosHistorico",
          component: PageProcessosHistorico,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },

        // Módulo Exportação (ADMIN, DP)
        {
          path: "/exportacao",
          name: "PageExportacao",
          component: PageExportacao,
          meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
        },

        // Módulo Relatórios (Todos autenticados)
        {
          path: "/relatorios",
          name: "PageRelatorios",
          component: PageRelatorios,
          meta: { requiresAuth: true },
        },
        {
          path: "/relatorios/colaborador",
          name: "PageRelatorioColaborador",
          component: PageRelatorioColaborador,
          meta: { requiresAuth: true },
        },
        {
          path: "/relatorios/empresa",
          name: "PageRelatorioEmpresa",
          component: PageRelatorioEmpresa,
          meta: { requiresAuth: true },
        },
        {
          path: "/relatorios/pagamento",
          name: "PageRelatorioPagamento",
          component: PageRelatorioPagamento,
          meta: { requiresAuth: true },
        },
        {
          path: "/relatorios/nao-pagamento",
          name: "PageRelatorioNaoPagamento",
          component: PageRelatorioNaoPagamento,
          meta: { requiresAuth: true },
        },
        {
          path: "/relatorios/resumo-depto",
          name: "PageRelatorioResumoDepto",
          component: PageRelatorioResumoDepto,
          meta: { requiresAuth: true },
        },
        {
          path: "/relatorios/centro-custo",
          name: "PageRelatorioResumoCentroCusto",
          component: PageRelatorioResumoCentroCusto,
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

// Guard global de autenticação e roles
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;

  // 1. Verifica se rota requer autenticação
  if (requiresAuth && !keycloak.authenticated) {
    console.warn("🔒 Acesso negado - Usuário não autenticado");
    keycloak.login();
    return;
  }

  // 2. Redirect inteligente da rota raiz
  if (to.path === "/" || to.name === "SideBarNavigation") {
    const storePermission = permissions();

    if (!storePermission.isLoading) {
      const userRoles = storePermission.getRoles;

      // Determina primeira página acessível baseada nas roles
      if (userRoles.includes("ADMIN") || userRoles.includes("DP")) {
        console.log("🏠 Redirecionando para /importacao (role: ADMIN/DP)");
        next({ name: "PageImportacao" });
        return;
      } else {
        console.log("🏠 Redirecionando para /relatorios (role: COLABORADOR)");
        next({ name: "PageRelatorios" });
        return;
      }
    } else {
      // Se ainda está carregando, redireciona para relatórios (acesso geral)
      console.log("🏠 Redirecionando para /relatorios (loading...)");
      next({ name: "PageRelatorios" });
      return;
    }
  }

  // 3. Verifica roles necessárias
  const requiredRoles = to.meta.roles as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const storePermission = permissions();

    // ⏳ Se ainda está carregando permissões, permite navegação temporariamente
    if (storePermission.isLoading) {
      console.log("⏳ Aguardando carregamento de permissões...");
      next();

      // 🔄 Adiciona watcher para validar após loading
      const unwatch = storePermission.$subscribe((mutation, state) => {
        if (!state.loading) {
          unwatch(); // Remove watcher

          const userRoles = storePermission.getRoles;
          const hasRole = requiredRoles.some((role) =>
            userRoles.includes(role.toUpperCase()),
          );

          if (!hasRole && router.currentRoute.value.path === to.path) {
            console.warn(
              `🔒 Acesso negado (pós-loading) - Role insuficiente. Necessário: ${requiredRoles.join(" ou ")}`,
            );
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
      console.warn(
        `🔒 Acesso negado - Role insuficiente. Necessário: ${requiredRoles.join(" ou ")}. Usuário tem: ${userRoles.join(", ")}`,
      );

      // Evita loop: se já está indo para relatórios, não redireciona novamente
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

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err: any, to: any) => {
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
