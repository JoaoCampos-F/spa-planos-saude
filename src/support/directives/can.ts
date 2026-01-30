import type { Directive, DirectiveBinding } from "vue";
import { permissions } from "@/stores/permissionsStore";

class Can {
  constructor(
    private modifier: "role" | "permission",
    private permisionOrRole?: string | string[]
  ) {}

  hasRole(userRole: string) {
    const storePermission = permissions();
    const roles = storePermission.getRolesSystem;
    const rolesUser = storePermission.getRoles;

    let nivel = 10000;
    for (const rule of rolesUser) {
      const index = roles.indexOf(rule);
      if (index < nivel) nivel = index;
    }

    const nivelDoPapelDoElemento = roles.indexOf(userRole);
    const nivelDoMaiorPapelDoUsuario = roles.indexOf(roles[nivel]);

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
    console.error;
    const [permission, escopo] = userPermissions.split("#");
    if (
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
  mounted(
    el: any,
    binding: DirectiveBinding<{
      arg: "role" | "permission";
      value: string | string[];
    }>
  ) {
    const modifierPermited: ("role" | "permission")[] = ["role", "permission"];

    if (binding.arg == undefined) {
      throw `arg is required, use v-can: [${modifierPermited.join(" or ")}]`;
    }
    if (!modifierPermited.includes(binding.arg as "role" | "permission")) {
      throw `arg [${
        binding.arg
      }] not found, use v-can: [${modifierPermited.join(" or ")}]`;
    }

    //@ts-ignore
    const can = new Can(binding.arg as "role" | "permission", binding.value);

    const allowed = can.isAllowed();
    if (!allowed && el.parentNode !== null) {
      el.parentNode.removeChild(el);
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
