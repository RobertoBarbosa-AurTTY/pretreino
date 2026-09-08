# Desafio 32: Versionamento de API

## 🎯 Objetivo

Implementar versionamento de API para manter compatibilidade retroativa enquanto lança novas funcionalidades.

## 📋 Contexto Real

APIs precisam evoluir sem quebrar clientes:
- Clientes em diferentes versões
- Depreciação gradual de endpoints
- Migração suave entre versões

## 📐 Requisitos

- [ ] Criar rotas versionadas (/v1, /v2)
- [ ] Implementar deprecation headers
- [ ] Criar middleware de versionamento
- [ ] Suportar múltiplas versões simultaneamente
- [ ] Documentar mudanças entre versões

## 🗂️ Estrutura dos Dados

```typescript
interface ApiVersion {
  versao: string;
  status: "ativa" | "deprecada" | "obsoleta";
  dataDeprecacao?: string;
  dataRemocao?: string;
}

interface VersionedRequest {
  version: string;
  path: string;
  headers: Record<string, string>;
}

interface DeprecationInfo {
  versao: string;
  mensagem: string;
  link?: string;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Use URL path versioning (/v1, /v2)
- Implemente headers de depreciação
- Considere versionamento por header Accept
- Mantenha docs atualizadas

---

**Dica:** Nunca remova uma versão abruptamente - sempre deprecie antes.