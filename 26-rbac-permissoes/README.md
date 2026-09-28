# Desafio 26: RBAC - Controle de Permissões

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar controle de acesso baseado em papéis (Role-Based Access Control) com
herança de papéis, recurso coringa, permissões condicionais, middleware de
autorização e auditoria de acessos.

## 📋 Contexto Real

Aplicações empresariais precisam controlar quem pode fazer o quê:

- Diferentes níveis de permissão (admin, editor, visualizador)
- Controle por recurso/funcionalidade
- Regras de contexto ("só pode apagar os próprios posts")
- Auditoria de todos os acessos

## 📐 Requisitos

Arquivo: `src/rbac.service.ts` (dados em memória). Exemplo de papéis em
`data/roles.json`.

- [ ] `loadRoles(filePath)` lê um JSON com `Role[]`, registra os papéis
      **preservando os ids** e os retorna
- [ ] `createRole` gera um `id` único e registra o papel
- [ ] `assignRole(userId, roleId, assignedBy)` retorna um `UserRole` com
      `assignedAt` (ISO 8601); rejeita `roleId` inexistente
- [ ] `checkPermission(userId, resource, action)` retorna `true` somente se
      algum papel do usuário tiver uma permissão com aquele `resource` (ou
      `"*"`) e a `action`
- [ ] Usuário sem papéis não tem nenhuma permissão
- [ ] Um papel com `inheritsFrom` tem também todas as permissões do papel pai
      (recursivamente)
- [ ] Permissão com `conditions` só vale se **todas** as chaves casarem com o
      objeto `conditions` passado a `checkPermission`; o valor especial
      `"$userId"` é substituído pelo `userId` verificado (sem `conditions` na
      chamada, a permissão condicional não vale)
- [ ] `getPermissions(userId)` retorna todas as permissões efetivas do usuário
      (incluindo herdadas)
- [ ] `authorizationMiddleware(resource, action)` retorna uma função
      `(req) => Promise<boolean>` que lê o usuário do header `X-User-Id`
      (ausente → `false`) e o IP de `X-Forwarded-For`
- [ ] Cada decisão do middleware é registrada com `logAccess` (`allowed`,
      `resource`, `action`, `ip`)
- [ ] `logAccess` adiciona `timestamp`; `getAccessLogs(userId?)` retorna os logs
      em ordem de registro, filtrando por usuário quando informado

## 🗂️ Estrutura dos Dados

```typescript
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  inheritsFrom?: string;
}

export interface Permission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
  conditions?: Record<string, unknown>;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface AccessLog {
  userId: string;
  resource: string;
  action: string;
  allowed: boolean;
  timestamp: string;
  ip?: string;
}

export interface AuthContext {
  userId: string;
  roles: string[];
  permissions: Permission[];
}
```

## 💡 Exemplo de Uso

```typescript
import {
  assignRole,
  authorizationMiddleware,
  checkPermission,
  loadRoles,
} from "./src/rbac.service.ts";

await loadRoles("./data/roles.json");
await assignRole("user-1", "editor", "admin-1");

await checkPermission("user-1", "posts", "read"); // true (herdado de viewer)
await checkPermission("user-1", "posts", "delete", { authorId: "user-1" }); // true
await checkPermission("user-1", "posts", "delete", { authorId: "user-2" }); // false

const canUpdatePosts = authorizationMiddleware("posts", "update");
Deno.serve(async (req) => {
  if (!(await canUpdatePosts(req))) {
    return new Response("Forbidden", { status: 403 });
  }
  return new Response("ok");
});
```

## ⚙️ Setup

```bash
cd 26-rbac-permissoes
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [RBAC — Wikipedia](https://pt.wikipedia.org/wiki/Controle_de_acesso_baseado_em_fun%C3%A7%C3%B5es)
- [Headers.get — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/Headers/get)
- [Deno.readTextFile — Deno](https://docs.deno.com/api/deno/~/Deno.readTextFile)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## 📝 Notas

- Princípio do menor privilégio: conceda só o necessário.
- Cuidado com ciclos em `inheritsFrom` (A herda de B que herda de A).
- Cache de permissões por usuário é um bom extra (lembre de invalidar ao
  atribuir papéis).
- Para regras muito dinâmicas, pesquise ABAC (Attribute-Based Access Control).
