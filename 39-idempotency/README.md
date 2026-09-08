# Desafio 39: Idempotency

## 🎯 Objetivo

Implementar idempotência em requisições para prevenir processamento duplicado.

## 📋 Contexto Real

Requisições podem ser reenviadas:
- Timeouts de rede
- Retry automático
- Falhas intermediárias

## 📐 Requisitos

- [ ] Criar chave de idempotência
- [ ] Armazenar respostas
- [ ] Validar requisições duplicadas
- [ ] Implementar expiração
- [ ] Criar API para consultar status

## 🗂️ Estrutura dos Dados

```typescript
interface IdempotencyKey {
  key: string;
  request: unknown;
  response?: unknown;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  expiresAt: string;
}

interface IdempotencyResult {
  isNew: boolean;
  response?: unknown;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Chave deve ser única por operação
- Use header Idempotency-Key
- Respostas devem expirar após tempo

---

**Dica:** Idempotência é crucial para operações de pagamento.