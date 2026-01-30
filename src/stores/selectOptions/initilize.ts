// INICIALIZAÇÃO DESATIVADA
// Essas requisições eram feitas automaticamente ao iniciar o app
// Agora devem ser feitas sob demanda quando necessário

import * as selectOption from "./";
// import { vCanPermission } from '@/support/directives/can';

export default async () => {
  // ⚠️ DESATIVADO - Carregava todos os colaboradores ao iniciar
  // await selectOption.colaboradorStore().set();

  // ⚠️ DESATIVADO - Filtros automáticos
  // selectOption.colaboradorStore().filterEmpresa();
  // selectOption.colaboradorStore().filterDepartamento();
  // selectOption.colaboradorStore().filterFuncao();

  console.log(
    "ℹ️ Inicialização de selectOptions desativada - carregamento sob demanda",
  );
};
