# Desafio 22: Autenticação Multi-Tenant

## 🎯 Objetivo

Implementar sistema de autenticação e autorização multi-tenant, onde cada tenant tem suas regras e configurações isoladas.

## 📋 Contexto Real

Aplicações SaaS precisam de isolamento:
- Dados separados por tenant
- Configurações customizáveis
- Regras de autorização específicas
- Audit trail por tenant

## 📐 Requisitos

- [ ] Implementar isolamento de dados por tenant
- [ ] Criar autenticação com contexto de tenant
- [ ] Gerenciar roles e permissões por tenant
- [ ] Implementar audit log por tenant
- [ ] Criar configurações customizáveis por tenant
- [ ] Garantir que um tenant não acesse dados do outro

## 🗂️ Estrutura dos Dados

```typescript
interface Tenant {
  id: string;
  nome: string;
  dominio: string;
  config: TenantConfig;
  status: "ativo" | "inativo" | "suspenso";
  criadoEm: string;
}

interface TenantConfig {
  maxUsuarios: number;
  funcionalidades: string[];
  branding: {
    logo?: string;
    corPrimaria: string;
  };
}

interface TenantUser {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  permissoes: string[];
}

interface TenantContext {
  tenantId: string;
  userId: string;
  roles: string[];
}
```

## 💡 Exemplo de Uso

```typescript
// Criar tenant
const tenant = await criarTenant({
  nome: "Empresa ABC",
  dominio: "abc.sistema.com",
  config: { maxUsuarios: 50, funcionalidades: ["basic", "reports"] }
});

// Login com contexto de tenant
const auth = await loginTenant("abc.sistema.com", "user@email.com", "senha");

// Acesso isolado - só retorna dados do tenant
const usuarios = await listarUsuarios(auth.tenantId);
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

- Use row-level security no banco
- Implemente tenant context no request
- Considere schema por tenant ou shared schema
- Implemente rate limiting por tenant
- Cache de configurações por tenant

---

**Dica:** Nunca confie apenas no frontend para filtrar por tenant - sempre valide no backend.