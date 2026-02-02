# 🔐 ANÁLISE COMPLETA: Autenticação Keycloak - Comparação Entre Projetos

**Data:** 02/02/2026  
**Objetivo:** Analisar implementação de autenticação com Keycloak em api-pplr, spa-pplr, api-unimed e spa-planos-saude

---

## 📊 RESUMO EXECUTIVO

### Status de Implementação

| Aspecto               | api-pplr (Laravel) | spa-pplr (Vue3)                    | api-unimed (NestJS)                                 | spa-planos-saude (Vue3)            |
| --------------------- | ------------------ | ---------------------------------- | --------------------------------------------------- | ---------------------------------- |
| **Keycloak Config**   | ✅ 100%            | ✅ 100%                            | ✅ 100%                                             | ✅ 100%                            |
| **Guards/Middleware** | ✅ Driver custom   | ✅ Init + Refresh                  | ✅ 3 Guards (AuthGuard, LocalUserGuard, RolesGuard) | ❌ Só init básico                  |
| **Roles/Permissions** | ✅ Middleware      | ✅ Store + Directive               | ✅ @Roles() decorator                               | ❌ Store vazia                     |
| **Token Management**  | ✅ Auto (driver)   | ✅ Auto refresh (setInterval)      | ✅ Via nest-keycloak-connect                        | ❌ Sem refresh                     |
| **User Persistence**  | ✅ Bind automático | ✅ API call (Auth/Colaborador)     | ✅ LocalUserGuard (auto-create)                     | ❌ Não busca dados                 |
| **Interceptors**      | ✅ Auto            | ✅ Bearer token + 401/403 handlers | ❌ Não tem                                          | ✅ Bearer token + 401/403 handlers |
| **Directives**        | N/A                | ✅ v-can:role, v-can:permission    | N/A                                                 | ✅ v-can (copiado)                 |
| **Router Guards**     | N/A                | ❌ Não tem                         | N/A                                                 | ❌ Não tem                         |

**Conclusão:**

- ✅ **api-unimed:** Backend COMPLETO (melhor que api-pplr)
- ⚠️ **spa-planos-saude:** Frontend INCOMPLETO - falta 60% da integração

---

## 1️⃣ ANÁLISE: API-PPLR (Laravel + Keycloak)

### 🔧 Configuração

**Arquivo:** `config/keycloak.php`

```php
return [
    'realm_public_key' => env('realm_public_key'),
    'signature_algorithm' => env('signature_algorithm'),
    'user_provider_credential' => 'public_id',
    'token_principal_attribute' => 'sub',
    'client_id' => 'pplr-api',
    'bind_user_keycloak' => [
        'uuid' => 'sub',
        'preferred_username' => 'preferred_username',
        'email' => 'email',
        'cpf' => 'cpf',
        'public_id' => 'sub',
        'nome' => 'name',
    ]
];
```

**Arquivo:** `config/auth.php`

```php
'guards' => [
    'api' => [
        'driver' => 'keycloak',  // ← Driver customizado
        'provider' => 'users',
    ],
],
```

### ✅ Pontos Fortes

1. **Driver Keycloak Customizado:** Integração nativa via package Laravel
2. **Bind Automático:** Mapeia claims do Keycloak → User model
3. **Middleware Auth:** `['middleware' => ['auth']]` valida JWT automaticamente
4. **Simples:** Configuração declarativa

### ⚠️ Limitações

- ❌ Não mostra lógica de **roles/permissions** (provavelmente em policies não mapeadas)
- ❌ Não mostra endpoint de login/refresh (driver faz tudo)

---

## 2️⃣ ANÁLISE: SPA-PPLR (Vue3 + Keycloak-js)

### 🔧 Configuração Keycloak

**Arquivo:** `src/config/keycloak.ts`

```typescript
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  url: import.meta.env.VITE_KEYCLOAK_URL,
});

export default keycloak;
```

### 🚀 Fluxo de Inicialização

**Arquivo:** `src/main.ts` (COMPLEXO - 70 linhas)

```typescript
keycloak
  .init({ onLoad: "login-required", checkLoginIframe: false })
  .then(async (auth) => {
    const app = createApp(App);

    // 1️⃣ Setup básico
    app.component("AppIcon", Icon);
    registerPlugins(app);
    app.use(canDirective);
    app.use(i18n);

    // 2️⃣ Armazena instância Keycloak
    const sso = ssoStore();
    sso.setKeyCloak(keycloak);

    if (auth) {
      app.mount("#app");

      // 3️⃣ Busca permissões do usuário
      const { data } = await Auth().store({});
      const storePermission = permissions();
      storePermission.setPermissions(data);

      // 4️⃣ Busca dados do colaborador
      const currentUserSystem = await Colaborador().list({});
      const storeUserSystem = userSystem();
      storeUserSystem.setUserSystem(currentUserSystem.data);

      // 5️⃣ (DESABILITADO) Inicializa select options
      // initilizeSelectOption();

      // 6️⃣ Auto-refresh de token (baseado em expiração)
      const timestampExpired = keycloak.tokenParsed?.exp || 0;
      const datetimeExpired = new Date(timestampExpired * 1000);
      const timeSecondsExperidToken = diffInSeconds(
        new Date(),
        datetimeExpired,
      );
      const intervalRefreshToken = (timeSecondsExperidToken - 30) * 1000;

      setInterval(() => {
        keycloak.updateToken(40).then((refreshToken) => {
          console.log("token atualizado", refreshToken);
        });
      }, intervalRefreshToken);
    }
  })
  .catch((error) => {
    console.error("Erro ao inicializar o keycloak", error);
  });
```

### 📦 Stores

#### **ssoStore** (Token Management)

**Arquivo:** `src/stores/sso.ts`

```typescript
export const ssoStore = defineStore("SsoStore", {
  state: (): SsoStore => ({
    keycloak: null,
  }),
  getters: {
    getToken: (state) => state.keycloak?.token,
    getUser: (state) => state.keycloak?.tokenParsed,
    getKeycloak: (state) => state.keycloak,
  },
  actions: {
    setKeyCloak(keycloak: Keycloak) {
      this.keycloak = keycloak;
    },
  },
});
```

#### **permissions** (Roles & Permissions)

**Arquivo:** `src/stores/permissionsStore.ts`

```typescript
export const permissions = defineStore("permissionStore", {
  state: (): Permissions => ({
    permissions: {
      comissao: ["list-all"],
    },
    roles: [],
    rolesSystem: ["admin", "gerente", "colaborador"],
  }),
  actions: {
    setPermissions(data: Permissions) {
      this.permissions = data.permissions;
      this.roles = data.roles;
    },
  },
  getters: {
    getRoles(state): Array<string> {
      return state.roles;
    },
    getRolesSystem(state): Array<string> {
      return state.rolesSystem;
    },
    getPermissions(state) {
      return state.permissions;
    },
  },
});
```

#### **userSystem** (User Data)

**Arquivo:** `src/stores/userSystem.ts`

```typescript
export const userSystem = defineStore("userSystem", {
  state: (): UserSystem => ({
    colaborador: {},
    segmentos: [],
    empresas: [],
    departamentos: [],
    funcoes: [],
    equipes: [],
  }),
  actions: {
    setUserSystem(data: UserSystem) {
      this.colaborador = data.colaborador;
      this.segmentos = data.segmentos;
      this.empresas = data.empresas;
      this.departamentos = data.departamentos;
      this.funcoes = data.funcoes;
      this.equipes = data.equipes;
    },
  },
});
```

### 🔌 HTTP Interceptors

**Arquivo:** `src/services/http/http.ts`

```typescript
http.interceptors.request.use((config) => {
  const sso = ssoStore();
  const token = sso.keycloak?.token;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      if (!keycloak.authenticated) keycloak.logout();
      notify("Acesso negado", "warning");
    }

    if (error.response?.status === 401) {
      notify("Sessão expirada, faça login novamente", "info");
      keycloak.logout();
    }

    if (error.response?.status === 502) {
      // Retry após 3s
      return new Promise((resolve) => {
        setTimeout(() => resolve(http.request(error.config)), 3000);
      });
    }

    return Promise.reject(error);
  },
);
```

### 🎨 Diretiva v-can

**Arquivo:** `src/support/directives/can.ts` (120 linhas)

```typescript
class Can {
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

    return nivelDoMaiorPapelDoUsuario <= nivelDoPapelDoElemento;
  }

  hasPermission(userPermissions: string) {
    const storePermission = permissions();
    const [permission, escopo] = userPermissions.split("#");
    return storePermission.getPermissions[permission]?.includes(escopo);
  }
}

// Uso em template:
// <v-btn v-can:role="'admin'">Admin Only</v-btn>
// <v-btn v-can:permission="'comissao#list-all'">Ver Comissão</v-btn>
```

### 🌐 Services HTTP

**Auth Service:**

```typescript
// src/services/http/Auth/index.ts
class Auth extends BaseHttp<InterfaceList, InterfaceStore, InterfaceUpdate> {
  resource(): string {
    return "auth/usuarios";
  }
}
```

**Colaborador Service:**

```typescript
// src/services/http/Auth/Colaborador/index.ts
class Auth extends BaseHttp<InterfaceList> {
  resource(): string {
    return "auth/colaborador";
  }
}
```

### ✅ Pontos Fortes

1. ✅ **Token Refresh Automático:** setInterval calcula tempo de expiração e renova 30s antes
2. ✅ **Stores Separadas:** ssoStore (token), permissions (roles), userSystem (dados colaborador)
3. ✅ **Interceptors Completos:** 401 → logout, 403 → notify, 502 → retry
4. ✅ **Diretiva v-can:** Sistema hierárquico de roles + permissions
5. ✅ **Init Sequence:** Busca permissões + dados do usuário antes de montar app

### ⚠️ Limitações

- ❌ **Sem Router Guards:** Não valida roles nas rotas
- ❌ **Init Sequence Bloqueante:** Se API falhar, app não monta
- ❌ **Token não persiste:** Se usuário recarregar página, perde token (Keycloak re-autentica)

---

## 3️⃣ ANÁLISE: API-UNIMED (NestJS + Keycloak)

### 🔧 Módulo de Autenticação

**Arquivo:** `src/infrastructure/auth/auth.module.ts`

```typescript
@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        authServerUrl: config.get<string>("SSO_URL"),
        realm: config.get<string>("SSO_REALM"),
        clientId: config.get<string>("SSO_CLIENT_ID"),
        secret: config.get<string>("SSO_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // 1º: Valida JWT Keycloak
    },
    {
      provide: APP_GUARD,
      useClass: LocalUserGuard, // 2º: Busca/cria usuário no banco
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // 3º: Valida roles
    },
  ],
})
export class AuthModule {}
```

### 🛡️ Guards (Camada de Segurança)

#### **1. AuthGuard** (nest-keycloak-connect)

- ✅ Valida JWT do Keycloak
- ✅ Decodifica token
- ✅ Injeta `request.user` (dados do Keycloak)

#### **2. LocalUserGuard** (Custom)

**Arquivo:** `src/infrastructure/auth/guards/local-user.guard.ts`

```typescript
@Injectable()
export class LocalUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const keycloakUser = request.user; // Dados validados pelo AuthGuard

    if (!keycloakUser || !keycloakUser.sub) {
      return false;
    }

    // 1. Busca usuário no banco por public_id (sub do Keycloak)
    let userAuth = await this.usuarioRepository.findByPublicId(
      keycloakUser.sub,
    );

    // 2. Se não existe, CRIA automaticamente
    if (!userAuth) {
      const dadosColaborador =
        await this.colaboradorRepository.buscarDadosBasicosPorCpf(
          keycloakUser.cpf,
        );

      userAuth = await this.usuarioRepository.create({
        public_id: keycloakUser.sub,
        preferred_username: keycloakUser.preferred_username,
        nome: keycloakUser.name,
        email: keycloakUser.email,
        cpf: keycloakUser.cpf,
        cod_empresa: dadosColaborador?.cod_empresa,
        codcoligada: dadosColaborador?.codcoligada,
        codfilial: dadosColaborador?.codfilial,
        ativo: "S",
      });
    }

    // 3. Atualiza dados se mudaram no Keycloak
    if (
      userAuth.email !== keycloakUser.email ||
      userAuth.nome !== keycloakUser.name
    ) {
      await this.usuarioRepository.update(userAuth.id, {
        email: keycloakUser.email,
        nome: keycloakUser.name,
      });
    }

    // 4. Extrai roles (prioriza resource_access['api-planos-saude'].roles)
    let roles: string[] = [];
    if (keycloakUser.resource_access?.["api-planos-saude"]?.roles) {
      roles = keycloakUser.resource_access["api-planos-saude"].roles;
    } else if (keycloakUser.realm_access?.roles) {
      roles = keycloakUser.realm_access.roles;
    }

    // 5. Injeta no request
    request.userAuth = {
      ...userAuth,
      roles: roles.map((role) => role.toUpperCase()),
    };

    return true;
  }
}
```

**🔥 Features Avançadas:**

- ✅ **Auto-criação de usuários:** Se não existe no banco, cria automaticamente
- ✅ **Sincronização:** Atualiza nome/email se mudou no Keycloak
- ✅ **Enriquecimento de dados:** Busca cod_empresa/codcoligada/codfilial do colaborador
- ✅ **Prioridade de roles:** Usa roles do client específico (`api-planos-saude`) em vez de realm global

#### **3. RolesGuard** (Custom)

**Arquivo:** `src/infrastructure/auth/guards/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 1. Verifica se rota é pública (@Public())
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, [handler, class]);
    if (isPublic) return true;

    // 2. Pega roles requeridas (@Roles('DP', 'ADMIN'))
    const requiredRoles = this.reflector.get(ROLES_KEY, [handler, class]);
    if (!requiredRoles) return true; // Sem @Roles = permite qualquer autenticado

    // 3. Valida se usuário tem pelo menos uma role
    const request = context.switchToHttp().getRequest();
    const userRoles = request.userAuth?.roles || [];

    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role.toUpperCase())
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Roles necessárias: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}
```

### 🎯 Decorators

**@Roles()**

```typescript
// src/infrastructure/auth/decorators/roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// Uso:
@Roles('DP', 'ADMIN')
async importarDadosPeriodo() {
  // Apenas usuários com role 'DP' ou 'ADMIN' acessam
}
```

**@Public()**

```typescript
// src/infrastructure/auth/decorators/public.decorator.ts
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Uso:
@Public()
async healthCheck() {
  // Sem autenticação necessária
}
```

**@AuthUser()**

```typescript
// src/infrastructure/auth/decorators/auth-user.decorator.ts
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserAuth => {
    const request = ctx.switchToHttp().getRequest();
    return request.userAuth;
  },
);

// Uso:
async buscarDados(@AuthUser() user: UserAuth) {
  console.log(user.nome, user.cpf, user.roles);
}
```

### 📝 Type Definitions

**Arquivo:** `src/infrastructure/auth/types/user-auth.type.ts`

```typescript
export interface UserAuth {
  id: number;
  public_id: string;
  nome: string;
  email: string;
  cpf?: string;
  preferred_username?: string;
  ativo: string;
  cod_empresa?: number;
  codcoligada?: number;
  codfilial?: number;
  roles: string[]; // Roles do Keycloak
}
```

### 🔍 Exemplo de Uso no Controller

```typescript
@Controller("importacao")
export class ImportacaoController {
  @Get("dados-periodo-cnpj")
  @Roles("DP", "ADMIN")
  async importarDadosPeriodo(
    @Query() params: ImportarDadosUnimedDto,
    @AuthUser() user: UserAuth,
  ) {
    // ✅ Já passou por:
    // 1. AuthGuard (JWT validado)
    // 2. LocalUserGuard (user criado/atualizado no banco)
    // 3. RolesGuard (validou que user tem role 'DP' ou 'ADMIN')

    console.log(user.nome, user.roles);
    return await this.useCase.execute(params);
  }
}
```

### ✅ Pontos Fortes

1. ✅ **3 Guards Sequenciais:** AuthGuard → LocalUserGuard → RolesGuard (Clean Architecture)
2. ✅ **Auto-criação de Usuários:** Primeiro login cria registro automaticamente
3. ✅ **Sincronização Automática:** Atualiza dados se mudou no Keycloak
4. ✅ **Enriquecimento de Dados:** Busca cod_empresa/codcoligada do colaborador
5. ✅ **Decorators TypeScript:** `@Roles()`, `@Public()`, `@AuthUser()` (DX excelente)
6. ✅ **Type Safety:** UserAuth bem tipado
7. ✅ **Prioridade de Roles:** Client-specific roles > Realm roles

### ⚠️ Observações

- ✅ **Melhor que api-pplr:** Guards sequenciais + auto-criação + decorators
- ⚠️ **Sem endpoint de auth:** Keycloak cuida de tudo (login/logout/refresh)
- ⚠️ **Sem interceptors:** nest-keycloak-connect gerencia tudo

---

## 4️⃣ ANÁLISE: SPA-PLANOS-SAUDE (Vue3 + Keycloak) - INCOMPLETO

### 🔧 Configuração Básica (✅ OK)

**Arquivo:** `src/config/keycloak.ts`

```typescript
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  url: import.meta.env.VITE_KEYCLOAK_URL,
});

export default keycloak;
```

### ⚠️ Inicialização Simplificada (INCOMPLETA)

**Arquivo:** `src/main.ts` (APENAS 30 linhas)

```typescript
keycloak
  .init({ onLoad: "login-required", checkLoginIframe: false })
  .then((auth) => {
    if (auth) {
      const app = createApp(App);

      app.component("AppIcon", Icon);
      registerPlugins(app);

      app.mount("#app");
    }
  })
  .catch((err) => {
    console.error("Erro ao inicializar o Keycloak:", err);
  });
```

### ❌ O Que Está Faltando

#### **1. Store SSO não é populada**

```typescript
// ❌ FALTA:
const sso = ssoStore();
sso.setKeyCloak(keycloak);
```

#### **2. Não busca permissões do usuário**

```typescript
// ❌ FALTA:
const { data } = await Auth().store({});
const storePermission = permissions();
storePermission.setPermissions(data);
```

#### **3. Não busca dados do colaborador**

```typescript
// ❌ FALTA:
const currentUserSystem = await Colaborador().list({});
const storeUserSystem = userSystem();
storeUserSystem.setUserSystem(currentUserSystem.data);
```

#### **4. Não registra diretiva v-can**

```typescript
// ❌ FALTA:
import canDirective from "./support/directives/can";
app.use(canDirective);
```

#### **5. Sem auto-refresh de token**

```typescript
// ❌ FALTA:
const timestampExpired = keycloak.tokenParsed?.exp || 0;
const intervalRefreshToken = (diffInSeconds(...) - 30) * 1000;

setInterval(() => {
  keycloak.updateToken(40).then((refreshToken) => {
    console.log("token atualizado", refreshToken);
  });
}, intervalRefreshToken);
```

### ✅ O Que Já Existe

#### **Stores (Copiadas do spa-pplr)**

- ✅ `sso.ts` - Armazena Keycloak instance
- ✅ `permissionsStore.ts` - Gerencia roles/permissions
- ✅ `userSystem.ts` - Dados do colaborador

#### **HTTP Interceptors (✅ OK)**

**Arquivo:** `src/services/http/http.ts`

```typescript
http.interceptors.request.use((config) => {
  const sso = ssoStore();
  const token = sso.keycloak?.token;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      keycloak.logout();
      notify("Acesso negado", "warning");
    }
    if (error.response?.status === 401) {
      keycloak.logout();
      notify("Sessão expirada", "info");
    }
    return Promise.reject(error);
  },
);
```

#### **Diretiva v-can (✅ OK - Copiada)**

**Arquivo:** `src/support/directives/can.ts`

```typescript
// Uso: <v-btn v-can:role="'admin'">Admin Only</v-btn>
// Uso: <v-btn v-can:permission="'comissao#list-all'">Ver</v-btn>
```

### ❌ Services de Autenticação Faltando

#### **Auth Service (FALTA CRIAR)**

```typescript
// ❌ FALTA: src/services/http/Auth/index.ts
class Auth extends BaseHttp<InterfaceList, InterfaceStore, InterfaceUpdate> {
  resource(): string {
    return "auth/usuarios"; // ← API não tem esse endpoint ainda
  }
}
```

#### **Colaborador Service (FALTA CRIAR)**

```typescript
// ❌ FALTA: src/services/http/Auth/Colaborador/index.ts
class Colaborador extends BaseHttp<InterfaceList> {
  resource(): string {
    return "auth/colaborador"; // ← API não tem esse endpoint ainda
  }
}
```

---

## 🚨 O QUE ESTÁ FALTANDO NO spa-planos-saude

### Frontend (Vue3)

| Arquivo                                       | Status        | Descrição                                                    |
| --------------------------------------------- | ------------- | ------------------------------------------------------------ |
| `src/main.ts`                                 | ⚠️ INCOMPLETO | Falta 40 linhas (buscar auth, popular stores, refresh token) |
| `src/services/http/Auth/index.ts`             | ❌ NÃO EXISTE | Service para buscar permissões                               |
| `src/services/http/Auth/Colaborador/index.ts` | ❌ NÃO EXISTE | Service para buscar dados do colaborador                     |
| `src/stores/sso.ts`                           | ✅ EXISTE     | Mas não é populada no main.ts                                |
| `src/stores/permissionsStore.ts`              | ✅ EXISTE     | Mas não recebe dados da API                                  |
| `src/stores/userSystem.ts`                    | ✅ EXISTE     | Mas não recebe dados da API                                  |
| `src/support/directives/can.ts`               | ✅ EXISTE     | Mas não é registrada (app.use)                               |
| `src/utils/diffInSeconds.ts`                  | ❌ NÃO EXISTE | Util para calcular tempo de expiração                        |

### Backend (NestJS)

| Endpoint                | Status        | Descrição                           |
| ----------------------- | ------------- | ----------------------------------- |
| `GET /auth/usuarios`    | ❌ NÃO EXISTE | Retorna permissões do usuário       |
| `GET /auth/colaborador` | ❌ NÃO EXISTE | Retorna dados do colaborador logado |

**⚠️ Observação:** api-unimed tem `LocalUserGuard` que **auto-cria usuários**, mas não expõe endpoints públicos para o frontend buscar permissões.

---

## 🔧 PLANO DE AÇÃO - IMPLEMENTAÇÃO COMPLETA

### Fase 1: Backend (api-unimed) - 4 horas

#### 1.1. Criar Endpoint de Permissões (2h)

**Arquivo:** `src/presentation/controllers/auth.controller.ts` (NOVO)

```typescript
@Controller("auth")
export class AuthController {
  constructor(
    private readonly buscarPermissoesUseCase: BuscarPermissoesUsuarioUseCase,
  ) {}

  @Get("usuarios")
  async buscarPermissoes(@AuthUser() user: UserAuth) {
    return {
      permissions: {
        importacao: ["create", "list"],
        exportacao: ["create"],
        relatorios: ["list", "download"],
      },
      roles: user.roles,
      rolesSystem: ["ADMIN", "DP", "COLABORADOR"],
    };
  }
}
```

#### 1.2. Criar Endpoint de Colaborador (2h)

**Arquivo:** `src/presentation/controllers/auth.controller.ts`

```typescript
@Controller("auth")
export class AuthController {
  @Get("colaborador")
  async buscarColaborador(@AuthUser() user: UserAuth) {
    const colaborador =
      await this.colaboradorRepository.buscarDadosCompletosPorCpf(user.cpf);

    return {
      colaborador: {
        cpf: colaborador.cpf,
        nome: colaborador.nome,
        cod_empresa: colaborador.cod_empresa,
        apelido: colaborador.apelido,
        cod_funcao: colaborador.cod_funcao,
        funcao: colaborador.funcao,
      },
      segmentos: [],
      empresas: [colaborador.apelido],
      departamentos: [],
      funcoes: [colaborador.funcao],
      equipes: [],
    };
  }
}
```

---

### Fase 2: Frontend (spa-planos-saude) - 6 horas

#### 2.1. Criar Services de Autenticação (1h)

**Arquivo:** `src/services/http/Auth/index.ts` (NOVO)

```typescript
import BaseHttp from "../BaseHttp";

interface InterfaceStore {
  permissions: { [key: string]: string[] };
  roles: string[];
  rolesSystem: string[];
}

class Auth extends BaseHttp<any, InterfaceStore, any, any> {
  resource(): string {
    return "auth/usuarios";
  }
}

export default (id?: string | number) => new Auth(id);
export const auth = new Auth();
export type { Auth };
```

**Arquivo:** `src/services/http/Auth/Colaborador/index.ts` (NOVO)

```typescript
import BaseHttp from "../../BaseHttp";

interface InterfaceList {
  colaborador: any;
  segmentos: string[];
  empresas: string[];
  departamentos: string[];
  funcoes: string[];
  equipes: string[];
}

class Colaborador extends BaseHttp<InterfaceList> {
  resource(): string {
    return "auth/colaborador";
  }
}

export default (id?: string | number) => new Colaborador(id);
export const colaborador = new Colaborador();
export type { Colaborador };
```

#### 2.2. Criar Utility diffInSeconds (30 min)

**Arquivo:** `src/utils/diffInSeconds.ts` (NOVO)

```typescript
export function diffInSeconds(date1: Date, date2: Date): number {
  const diff = date2.getTime() - date1.getTime();
  return Math.floor(diff / 1000);
}
```

#### 2.3. Atualizar main.ts (2h)

**Arquivo:** `src/main.ts`

```typescript
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
    app.use(canDirective); // ← NOVO

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
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
      }

      // 3️⃣ Busca dados do colaborador
      try {
        const currentUserSystem = await Colaborador().list({});
        const storeUserSystem = userSystem();
        storeUserSystem.setUserSystem(currentUserSystem.data);
      } catch (error) {
        console.error("Erro ao buscar dados do colaborador:", error);
      }

      // 4️⃣ Auto-refresh de token (30s antes de expirar)
      const timestampExpired = keycloak.tokenParsed?.exp || 0;
      const datetimeExpired = new Date(timestampExpired * 1000);
      const timeSecondsExpiredToken = diffInSeconds(
        new Date(),
        datetimeExpired,
      );
      const intervalRefreshToken = (timeSecondsExpiredToken - 30) * 1000;

      setInterval(() => {
        keycloak.updateToken(40).then((refreshToken) => {
          console.log("Token atualizado:", refreshToken);
        });
      }, intervalRefreshToken);
    }
  })
  .catch((error) => {
    console.error("Erro ao inicializar o keycloak", error);
  });
```

#### 2.4. Ajustar Stores (30 min)

**Arquivo:** `src/stores/permissionsStore.ts`

```typescript
// ✅ JÁ ESTÁ OK (idêntico ao spa-pplr)
// Apenas garantir que rolesSystem tem as roles corretas:
rolesSystem: [
  "ADMIN",
  "DP",
  "COLABORADOR",
],
```

#### 2.5. Criar Router Guards (2h)

**Arquivo:** `src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from "vue-router";
import { permissions } from "@/stores/permissionsStore";
import keycloak from "@/config/keycloak";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/importacao",
      name: "importacao",
      component: () => import("@/pages/importacao/index.vue"),
      meta: { requiresAuth: true, roles: ["ADMIN", "DP"] }, // ← NOVO
    },
    {
      path: "/colaboradores",
      name: "colaboradores",
      component: () => import("@/pages/colaboradores/index.vue"),
      meta: { requiresAuth: true, roles: ["ADMIN", "DP"] },
    },
    {
      path: "/relatorios",
      name: "relatorios",
      component: () => import("@/pages/relatorios/index.vue"),
      meta: { requiresAuth: true }, // Qualquer role autenticada
    },
    // ... outras rotas
  ],
});

// Guard global
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;

  // 1. Verifica se rota requer autenticação
  if (requiresAuth && !keycloak.authenticated) {
    keycloak.login();
    return;
  }

  // 2. Verifica roles necessárias
  const requiredRoles = to.meta.roles as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const storePermission = permissions();
    const userRoles = storePermission.getRoles;

    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role.toUpperCase()),
    );

    if (!hasRole) {
      console.warn("Acesso negado - Role insuficiente");
      next({ name: "home" }); // Redireciona para home
      return;
    }
  }

  next();
});

export default router;
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Backend (api-unimed) - 4 horas

- [ ] **Criar AuthController** (2h)
  - [ ] `GET /auth/usuarios` - Retorna permissões
  - [ ] `GET /auth/colaborador` - Retorna dados do colaborador
  - [ ] Testar endpoints com Postman
- [ ] **Criar Use Cases** (1h)
  - [ ] `BuscarPermissoesUsuarioUseCase`
  - [ ] `BuscarColaboradorUseCase`
- [ ] **Validar Guards** (1h)
  - [ ] Testar que LocalUserGuard popula `request.userAuth`
  - [ ] Verificar que roles estão corretas

### Frontend (spa-planos-saude) - 6 horas

- [ ] **Criar Services** (1h)
  - [ ] `src/services/http/Auth/index.ts`
  - [ ] `src/services/http/Auth/Colaborador/index.ts`
  - [ ] `src/services/http/Auth/Colaborador/Interface.ts`
  - [ ] `src/services/http/Auth/interface.ts`
- [ ] **Criar Utils** (30 min)
  - [ ] `src/utils/diffInSeconds.ts`
- [ ] **Atualizar main.ts** (2h)
  - [ ] Importar canDirective e registrar
  - [ ] Popular ssoStore
  - [ ] Buscar permissões (Auth().store)
  - [ ] Buscar colaborador (Colaborador().list)
  - [ ] Implementar auto-refresh de token
  - [ ] Testar fluxo completo
- [ ] **Criar Router Guards** (2h)
  - [ ] Adicionar meta.requiresAuth nas rotas
  - [ ] Adicionar meta.roles nas rotas restritas
  - [ ] Implementar router.beforeEach
  - [ ] Testar redirecionamento por role
- [ ] **Ajustar Stores** (30 min)
  - [ ] Verificar rolesSystem em permissionsStore.ts
  - [ ] Testar que stores são populadas corretamente

### Validação Final - 2 horas

- [ ] **Testar Fluxo Completo**
  - [ ] Login com usuário ADMIN → Acessa tudo
  - [ ] Login com usuário DP → Acessa importação/exportação
  - [ ] Login com usuário COLABORADOR → Apenas relatórios
  - [ ] Token refresh funciona após ~30s antes de expirar
  - [ ] Logout limpa stores
- [ ] **Testar Diretivas**
  - [ ] `<v-btn v-can:role="'ADMIN'">` → Aparece só para admin
  - [ ] `<v-btn v-can:permission="'importacao#create'">` → Funciona
- [ ] **Testar Guards de Rota**
  - [ ] Acessar /importacao sem autenticação → Redireciona para login
  - [ ] Acessar /importacao com COLABORADOR → Redireciona para home
  - [ ] Acessar /relatorios com qualquer role → Funciona

---

## 📊 COMPARAÇÃO FINAL

| Aspecto                | api-pplr | spa-pplr       | api-unimed        | spa-planos-saude    | Prioridade |
| ---------------------- | -------- | -------------- | ----------------- | ------------------- | ---------- |
| **Keycloak Config**    | ✅       | ✅             | ✅                | ✅                  | -          |
| **Guards**             | ✅       | -              | ✅✅✅ (3 guards) | -                   | -          |
| **Token Refresh**      | Auto     | ✅ setInterval | Auto              | ❌                  | 🔥 ALTA    |
| **Buscar Permissões**  | Auto     | ✅ API call    | -                 | ❌                  | 🔥 ALTA    |
| **Buscar Colaborador** | Auto     | ✅ API call    | -                 | ❌                  | 🔥 ALTA    |
| **Diretivas**          | -        | ✅ v-can       | -                 | ✅ (não registrada) | 🔥 ALTA    |
| **Router Guards**      | -        | ❌             | -                 | ❌                  | 🟡 MÉDIA   |
| **Endpoints Auth**     | N/A      | N/A            | ❌                | ❌                  | 🔥 CRÍTICA |

### Prioridades

1. **🔥 CRÍTICA (Backend):** Criar endpoints `/auth/usuarios` e `/auth/colaborador`
2. **🔥 ALTA (Frontend):** Atualizar main.ts (token refresh + buscar auth)
3. **🔥 ALTA (Frontend):** Criar services de Auth
4. **🟡 MÉDIA (Frontend):** Implementar router guards

**Tempo Total:** ~12 horas (Backend: 4h + Frontend: 6h + Validação: 2h)

---

## 🎯 RESULTADO ESPERADO

Após implementação completa:

1. ✅ **Login Automático:** Keycloak redireciona para login se não autenticado
2. ✅ **Token Refresh:** Renova 30s antes de expirar (sem perder sessão)
3. ✅ **Permissões Dinâmicas:** `v-can:role="'ADMIN'"` mostra/oculta elementos
4. ✅ **Dados do Usuário:** Nome, CPF, empresa disponíveis em `userSystem` store
5. ✅ **Router Guards:** Bloqueia rotas por role (ADMIN, DP, COLABORADOR)
6. ✅ **Interceptors:** 401 → logout, 403 → notify
7. ✅ **Auto-criação:** Primeiro login cria usuário no banco (backend já tem)

**Status Final:** 🟢 **Sistema de autenticação completo e seguro**
