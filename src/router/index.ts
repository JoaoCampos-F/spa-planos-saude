/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { createRouter, createWebHistory } from "vue-router/auto";
import SideBarNavigation from "@/layouts/sidebar-navigation/index.vue";
import PageNotFound from "@/pages/PageNotFound.vue";

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
      path: "/",
      redirect: "/importacao",
      name: "SideBarNavigation",
      component: SideBarNavigation,
      meta: { requiresAuth: true },
      children: [
        // Módulo Importação
        {
          path: "/importacao",
          name: "PageImportacao",
          component: PageImportacao,
        },
        {
          path: "/importacao/cnpj",
          name: "PageImportacaoCnpj",
          component: PageImportacaoCnpj,
        },
        {
          path: "/importacao/contrato",
          name: "PageImportacaoContrato",
          component: PageImportacaoContrato,
        },

        // Módulo Colaboradores
        {
          path: "/colaboradores",
          name: "PageColaboradores",
          component: PageColaboradores,
        },

        // Módulo Processos
        {
          path: "/processos",
          name: "PageProcessos",
          component: PageProcessos,
        },
        {
          path: "/processos/historico",
          name: "PageProcessosHistorico",
          component: PageProcessosHistorico,
        },

        // Módulo Exportação
        {
          path: "/exportacao",
          name: "PageExportacao",
          component: PageExportacao,
        },

        // Módulo Relatórios
        {
          path: "/relatorios",
          name: "PageRelatorios",
          component: PageRelatorios,
        },
        {
          path: "/relatorios/colaborador",
          name: "PageRelatorioColaborador",
          component: PageRelatorioColaborador,
        },
        {
          path: "/relatorios/empresa",
          name: "PageRelatorioEmpresa",
          component: PageRelatorioEmpresa,
        },
        {
          path: "/relatorios/pagamento",
          name: "PageRelatorioPagamento",
          component: PageRelatorioPagamento,
        },
        {
          path: "/relatorios/nao-pagamento",
          name: "PageRelatorioNaoPagamento",
          component: PageRelatorioNaoPagamento,
        },
        {
          path: "/relatorios/resumo-depto",
          name: "PageRelatorioResumoDepto",
          component: PageRelatorioResumoDepto,
        },
        {
          path: "/relatorios/centro-custo",
          name: "PageRelatorioResumoCentroCusto",
          component: PageRelatorioResumoCentroCusto,
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
