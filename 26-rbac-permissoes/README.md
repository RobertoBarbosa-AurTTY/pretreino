# Desafio 26: RBAC - Controle de Permissões

## 🎯 Objetivo

Implementar um sistema de controle de acesso baseado em papéis (Role-Based Access Control) granular.

## 📋 Contexto Real

Aplicações empresariais precisam de controle de acesso:
- Diferentes níveis de permissão
- Controle por módulo/funcionalidade
- Auditoria de acessos
- Gestão dinâmica de permissões

## 📐 Requisitos

- [ ] Definir modelo de papéis e permissões
- [ ] Criar middleware de autorização
- [ ] Implementar verificação de permissão por recurso
- [ ] Criar sistema de herança de papéis
- [ ] Implementar auditoria de acessos
- [ ] Permitir permissões customizadas

## 🗂️ Estrutura dos Dados

```typescript
interface Role {
  id: string;
  nome: string;
  descricao: string;
  permissoes: Permission[];
  herdaDe?: string;
}

interface Permission {
  recurso: string;
  acoes: ("criar" | "ler" | "atualizar" | "deletar")[];
  condicoes?: Record<string, unknown>;
}

interface UserRole {
  userId: string;
  roleId: string;
  atribuidoEm: string;
  atribuidoPor: string;
}

interface AccessLog {
  userId: string;
  recurso: string;
  acao: string;
  permitido: boolean;
  timestamp: string;
  ip?: string;
}

interface AuthContext {
  userId: string;
  roles: string[];
  permissoes: Permission[];
}
```

## 💡 Exemplo de Uso

```typescript
// Definir roles
const roles: Role[] = [
  {
    id: "admin",
    nome: "Administrador",
    permissoes: [
      { recurso: "*", acoes: ["criar", "ler", "atualizar", "deletar"] }
    ]
  },
  {
    id: "editor",
    nome: "Editor",
    herdaDe: "visualizador",
    permissoes: [
      { recurso: "posts", acoes: ["criar", "atualizar"] }
    ]
  }
];

// Verificar permissão
const podeDeletar = await verificarPermissao(
  userId,
  "posts",
  "deletar",
  { autorId: post.autorId } // condição: só pode deletar próprios posts
);

// Middleware
app.use("/api/admin/*", requireRole("admin"));
app.use("/api/posts/*", requirePermission("posts", "atualizar"));
```

## ⚙️ Setup

```bash
deno task dev
```

## 🧪 Testes

```bash
deno task test
```

## 📝 Notas

- Implemente cache de permissões
- Use policies para regras complexas
- Considere permissões baseadas em contexto
- Implemente audit log completo
- Considere ABAC para casos avançados

---

**Dica:** Use o princípio do menor privilégio - sempre conceda apenas as permissões mínimas necessárias.