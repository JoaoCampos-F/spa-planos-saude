import * as selectOption from './';
// import { vCanPermission } from '@/support/directives/can';

export default async () => {
  await selectOption.colaboradorStore().set();
  // selectOption.empresaStore().set();
  // selectOption.departamentoStore().set();
  // selectOption.colaboradorStore().set();
  selectOption.colaboradorStore().filterEmpresa();
  selectOption.colaboradorStore().filterDepartamento();
  selectOption.colaboradorStore().filterFuncao();
};
