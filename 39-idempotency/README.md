# Desafio 39: Idempotency

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar um serviço de chaves de idempotência para que uma mesma operação
(ex.: um pagamento) reenviada várias vezes seja processada **uma única vez**,
devolvendo a mesma resposta nas repetições.

## 📋 Contexto Real

Requisições podem ser reenviadas:

- Timeouts de rede (o cliente não sabe se o servidor processou)
- Retry automático de clientes e filas
- Usuário clicando duas vezes em "Pagar"

O cliente envia um header `Idempotency-Key`; o servidor usa essa chave para
detectar repetições.

## 📐 Requisitos

Tudo fica em `src/idempotency.service.ts` (armazenamento em memória).

**`createService(ttlMs)` → `check(key, request)`**

- [ ] Chave nunca vista → registra com `status: "processing"`, `createdAt` =
      agora, `expiresAt` = agora + `ttlMs`, e retorna `{ isNew: true }`
- [ ] Chave `completed` com o mesmo `request` → `{ isNew: false, response }` (a
      resposta salva)
- [ ] Chave ainda `processing` → rejeita com erro cuja mensagem contém
      `"in progress"`
- [ ] Mesma chave com `request` diferente (comparação por `JSON.stringify`) →
      rejeita com erro contendo `"mismatch"`
- [ ] Chave `failed` → permite nova tentativa: volta para `processing` e retorna
      `{ isNew: true }`
- [ ] Chaves expiradas (a partir de `expiresAt`) são tratadas como inexistentes

**`save(key, response)` / `fail(key)`**

- [ ] `save` guarda a resposta e muda o status para `completed`
- [ ] `fail` muda o status para `failed`
- [ ] Ambos rejeitam com erro contendo `"not found"` se a chave não existir

**`getStatus(key)`**

- [ ] Retorna o `IdempotencyKey` completo, ou `null` se não existir/expirou

## 🗂️ Estrutura dos Dados

```typescript
export interface IdempotencyKey {
  key: string;
  request: unknown;
  response?: unknown;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  expiresAt: string;
}

export interface IdempotencyResult {
  isNew: boolean;
  response?: unknown;
}

export interface IdempotencyService {
  check(key: string, request: unknown): Promise<IdempotencyResult>;
  save(key: string, response: unknown): Promise<void>;
  fail(key: string): Promise<void>;
  getStatus(key: string): Promise<IdempotencyKey | null>;
}
```

## 💡 Exemplo de Uso

```typescript
import { createService } from "./idempotency.service.ts";

const idempotency = createService(60 * 60 * 1000); // 1 hora

async function pay(key: string, body: { orderId: string; amount: number }) {
  const result = await idempotency.check(key, body);
  if (!result.isNew) return result.response; // repetição: devolve a mesma resposta

  try {
    const response = { paymentId: crypto.randomUUID(), status: "pago" };
    await idempotency.save(key, response);
    return response;
  } catch (error) {
    await idempotency.fail(key);
    throw error;
  }
}

await pay("abc-123", { orderId: "1", amount: 99.9 }); // processa
await pay("abc-123", { orderId: "1", amount: 99.9 }); // mesma resposta, sem reprocessar
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Idempotent (MDN Glossary)](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)
- [JSON.stringify() (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [Map (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Idempotent requests (Stripe)](https://docs.stripe.com/api/idempotent_requests)

## 📝 Notas

- A chave deve ser única por operação (geralmente um UUID gerado pelo cliente)
- Em HTTP, a chave vem no header `Idempotency-Key`; um `check` que rejeita com
  `"in progress"` vira `409 Conflict`, e `"mismatch"` vira `422`
- Extra: um middleware `withIdempotency(service, handler)` para `Deno.serve`, e
  limpeza periódica das chaves expiradas
- Idempotência é crucial para operações de pagamento
