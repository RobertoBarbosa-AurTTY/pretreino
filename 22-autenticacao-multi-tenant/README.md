# Desafio 22: Autenticação Multi-Tenant

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar autenticação e isolamento de dados multi-tenant: cada tenant
(empresa cliente) tem seus próprios usuários, configurações e regras, e nenhum
tenant consegue acessar dados de outro.

## 📋 Contexto Real

Aplicações SaaS atendem várias empresas na mesma instância:

- Dados separados por tenant
- Configurações customizáveis (limite de usuários, funcionalidades, branding)
- Login resolvido pelo domínio do tenant (`abc.sistema.com`)
- Um usuário de um tenant jamais pode enxergar dados de outro

## 📐 Requisitos

Arquivo: `src/tenant.service.ts` (dados em memória).

- [ ] `createTenant` gera `id` único e `createdAt` (ISO 8601) e retorna o tenant
      com os dados informados
- [ ] `createTenant` rejeita (lança erro) quando já existe tenant com o mesmo
      `domain`
- [ ] `createTenantUser` rejeita tenant inexistente
- [ ] `createTenantUser` rejeita email já cadastrado **no mesmo tenant** (o
      mesmo email em tenants diferentes é permitido)
- [ ] `createTenantUser` rejeita quando o tenant já atingiu `config.maxUsers`
- [ ] A senha nunca é armazenada em texto puro: o campo `password` do usuário
      guarda um hash (ex.: SHA-256 com `crypto.subtle`)
- [ ] `listUsers(tenantId)` retorna apenas usuários daquele tenant
- [ ] `loginTenant(domain, email, password)` retorna
      `{ success: true, token, context }` com `context.tenantId`,
      `context.userId` e `context.roles = [user.role]`
- [ ] `loginTenant` retorna `{ success: false, error }` (sem `token`) para
      domínio desconhecido, usuário inexistente naquele tenant, senha errada ou
      tenant com `status` diferente de `"active"`
- [ ] `getTenantConfig` retorna a `config` do tenant e rejeita tenant
      inexistente
- [ ] `validateTenantContext(context, resourceTenantId)` retorna `true` somente
      se `context.tenantId === resourceTenantId`
- [ ] Extra: limitar o número de tenants por `MAX_TENANTS`

## 🗂️ Estrutura dos Dados

```typescript
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  config: TenantConfig;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
}

export interface TenantConfig {
  maxUsers: number;
  features: string[];
  branding: {
    logo?: string;
    primaryColor: string;
  };
}

export interface TenantUser {
  id: string;
  tenantId: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
  createdAt: string;
}

export interface TenantContext {
  tenantId: string;
  userId: string;
  roles: string[];
}

export interface LoginResult {
  success: boolean;
  context?: TenantContext;
  token?: string;
  error?: string;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  createTenant,
  createTenantUser,
  listUsers,
  loginTenant,
  validateTenantContext,
} from "./src/tenant.service.ts";

const tenant = await createTenant({
  name: "Empresa ABC",
  domain: "abc.sistema.com",
  config: {
    maxUsers: 50,
    features: ["basic", "reports"],
    branding: { primaryColor: "#0055ff" },
  },
  status: "active",
});

await createTenantUser(tenant.id, {
  email: "user@email.com",
  password: "senha",
  role: "admin",
  permissions: ["users:read"],
});

const auth = await loginTenant("abc.sistema.com", "user@email.com", "senha");
if (auth.success && auth.context) {
  const users = await listUsers(auth.context.tenantId); // só usuários da ABC
  validateTenantContext(auth.context, tenant.id); // true
}
```

## ⚙️ Setup

```bash
cd 22-autenticacao-multi-tenant
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [SubtleCrypto.digest — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/SubtleCrypto/digest)
- [crypto.randomUUID — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- [Map — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Multi-tenancy — Wikipedia](https://en.wikipedia.org/wiki/Multitenancy)

## 📝 Notas

- Sempre filtre por `tenantId` no backend: nunca confie no frontend para isolar
  dados.
- Em banco de dados real, as opções são schema por tenant, banco por tenant ou
  schema compartilhado com `tenant_id` (+ row-level security).
- Para comparar senhas, gere o hash da senha informada e compare com o hash
  armazenado.
- O token pode ser um valor aleatório (`crypto.randomUUID()`); JWT com
  `tenantId` no payload é um extra (veja o desafio 12).
