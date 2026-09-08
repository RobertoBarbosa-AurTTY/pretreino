# Desafio 38: Distributed Lock

## 🎯 Objetivo

Implementar sistema de bloqueio distribuído para coordenação entre processos.

## 📋 Contexto Real

Recursos compartilhados precisam de sincronização:
- Processamento de pagamentos
- Atualização de estoque
- Jobs agendados

## 📐 Requisitos

- [ ] Criar lock distribuído
- [ ] Implementar timeout automático
- [ ] Criar retry com backoff
- [ ] Implementar deadlock detection
- [ ] Garantir atomicidade

## 🗂️ Estrutura dos Dados

```typescript
interface Lock {
  resource: string;
  owner: string;
  acquiredAt: string;
  expiresAt: string;
}

interface LockOptions {
  timeout: number;
  retries: number;
  retryDelay: number;
}

interface LockResult {
  success: boolean;
  lock?: Lock;
  error?: string;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Use Redis ou ZooKeeper para produção
- Lock deve ter TTL para evitar deadlocks
- Considere Redlock para alta disponibilidade

---

**Dica:** Nunca confie em locks sem timeout - processos podem crashar.