import type { Directive, DirectiveBinding } from "vue";
import { permissions } from "@/stores/permissionsStore";
import { watch } from "vue";

class Can {
  constructor(
    private modifier: "role" | "permission",
    private permisionOrRole?: string | string[]
  ) {}

  hasRole(userRole: string) {
    const storePermission = permissions();
    const roles = storePermission.getRolesSystem;
    const rolesUser = storePermission.getRoles;

    // Se ainda está carregando ou não tem roles, não permite
    if (storePermission.isLoading || rolesUser.length === 0) {
      return false;
    }

    let nivel = 10000;
    for (const rule of rolesUser) {
      const index = roles.indexOf(rule);
      if (index < nivel) nivel = index;
    }

    const nivelDoPapelDoElemento = roles.indexOf(userRole);
    const roleAtNivel = roles[nivel];
    if (!roleAtNivel) return false;
    const nivelDoMaiorPapelDoUsuario = roles.indexOf(roleAtNivel);

    if (nivelDoMaiorPapelDoUsuario <= nivelDoPapelDoElemento) {
      return true;
    }
    return false;
  }

  hasRoleByArray(roles: string[]) {
    for (const role of roles) {
      if (this.hasRole(role)) return true;
    }
    return false;
  }

  hasPermission(userPermissions: string = "") {
    const storePermission = permissions();
    
    // Se ainda está carregando, não permite
    if (storePermission.isLoading) {
      return false;
    }
    
    const [permission, escopo] = userPermissions.split("#");
    if (
      permission &&
      escopo &&
      storePermission.getPermissions &&
      storePermission.getPermissions[permission]
    ) {
      return storePermission.getPermissions[permission].includes(escopo);
    }
    return false;
  }

  hasPermissionByArray(arrayPermission: string[]) {
    for (const permision of arrayPermission) {
      if (this.hasPermission(permision)) return true;
    }
    return false;
  }

  role(roles: string | string[]): boolean {
    if (typeof roles == "string") return this.hasRole(roles);
    return this.hasRoleByArray(roles);
  }

  permission(permissions: string | string[]): boolean {
    if (typeof permissions == "string") return this.hasPermission(permissions);
    return this.hasPermissionByArray(permissions);
  }

  isAllowed(): boolean {
    if (!this.permisionOrRole) return true;
    return this[this.modifier](this.permisionOrRole);
  }
}

const canDirective: Directive<HTMLElement> = {
  mounted(el: any, binding: any) {
    const modifierPermited: ("role" | "permission")[] = ["role", "permission"];

    if (binding.arg == undefined) {
      throw `arg is required, use v-can: [${modifierPermited.join(" or ")}]`;
    }
    if (!modifierPermited.includes(binding.arg as "role" | "permission")) {
      throw `arg [${
        binding.arg
      }] not found, use v-can: [${modifierPermited.join(" or ")}]`;
    }

    // Cria um comentário placeholder para poder restaurar o elemento depois
    const comment = document.createComment('v-can');
    const parent = el.parentNode;
    
    // Armazena referências importantes
    (el as any)._vCanParent = parent;
    (el as any)._vCanComment = comment;
    (el as any)._vCanNextSibling = el.nextSibling;
    
    // Função para verificar e aplicar permissão
    const checkAndApply = () => {
      const can = new Can(binding.arg as "role" | "permission", binding.value);
      const allowed = can.isAllowed();
      
      if (!allowed) {
        // Remove do DOM e coloca comentário no lugar
        if (el.parentNode) {
          el.parentNode.replaceChild(comment, el);
        }
      } else {
        // Restaura no DOM se estava removido
        if (comment.parentNode) {
          comment.parentNode.replaceChild(el, comment);
        }
      }
    };

    // Aplica verificação inicial
    checkAndApply();

    // Observa mudanças na store de permissões
    const permissionsStore = permissions();
    const stopWatch = watch(
      () => ({
        roles: permissionsStore.getRoles,
        loading: permissionsStore.isLoading,
        permissions: permissionsStore.getPermissions,
      }),
      () => {
        checkAndApply();
      },
      { deep: true }
    );

    // Armazena o cleanup para o unmounted
    (el as any)._stopCanWatch = stopWatch;
  },
  
  unmounted(el: any) {
    // Limpa o watcher quando o elemento é desmontado
    if ((el as any)._stopCanWatch) {
      (el as any)._stopCanWatch();
    }
  },
};

export function vCanPermission(permission: string) {
  //@ts-ignore
  const can = new Can("permission", permission);

  return can.isAllowed();
}

export function vCanRole(role: string) {
  //@ts-ignore
  const can = new Can("role", role);

  return can.isAllowed();
}

export default {
  install: (app: any) => {
    app.directive("can", canDirective);
  },
};
