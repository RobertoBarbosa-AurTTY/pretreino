# Desafio 06: Webhook de Pagamento

**Dificuldade:** ⭐

## 🎯 Objetivo

Criar um serviço que valida eventos de pagamento e os envia como webhooks para a
API mock, com autenticação, assinatura e proteção contra envios duplicados.

## 📋 Contexto Real

Gateways de pagamento (Stripe, PagSeguro...) notificam o sistema via webhook.
Aqui você fica do lado de quem **envia** o webhook:

- Validar a estrutura de cada evento antes de enviar
- Enviar com autenticação e assinatura
- Tratar respostas de erro sem derrubar o processo
- Não enviar o mesmo pagamento duas vezes

## 📐 Requisitos

Arquivo: `src/webhook.handler.ts`

- [ ] `login(apiUrl, email, password)` faz `POST /api/auth/login` e retorna o
      `token`; lança erro se a resposta não for 2xx
- [ ] `validateWebhook(webhook)` é um _type guard_ que retorna `true` só se:
  - `event` for `"pagamento.pago"`, `"pagamento.falhou"` ou
    `"pagamento.reembolsado"`
  - `data.paymentId`, `data.orderId` e `data.method` forem strings não vazias
  - `data.amount` for um `number` maior que zero
  - `data.date` for uma data ISO 8601 válida
- [ ] `validateWebhook` retorna `false` (sem lançar) para `null`, arrays,
      primitivos ou objetos sem `data`
- [ ] `sendWebhook(webhook, apiUrl, secret, token)` faz `POST /api/webhooks` com
      o webhook em JSON e os headers `Authorization: Bearer <token>` e
      `X-Webhook-Signature: <secret>`
- [ ] Em resposta 2xx retorna `{ success: true, message, paymentId }` com os
      valores da API
- [ ] Em erro HTTP retorna `{ success: false, message }` com a `message` da API;
      em erro de rede retorna `success: false`; **nunca lança exceção**
- [ ] `loadPendingWebhooks(filePath)` lê a lista do JSON e retorna só os
      webhooks válidos (os inválidos são ignorados com log)
- [ ] `src/index.ts`: login → carregar → enviar cada webhook uma única vez
      (ignorar `paymentId` repetido) → exibir resumo

## 🗂️ Estrutura dos Dados

```typescript
export interface PaymentWebhook {
  event: "pagamento.pago" | "pagamento.falhou" | "pagamento.reembolsado";
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    method: string;
    date: string;
  };
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  paymentId?: string;
}
```

`data/exemplo-webhook.json` contém webhooks válidos, um duplicado e um inválido.

## 🔌 API

| Método | Rota              | Uso                                                      |
| ------ | ----------------- | -------------------------------------------------------- |
| `POST` | `/api/auth/login` | Obter o token                                            |
| `POST` | `/api/webhooks`   | Recebe o webhook → `201 { success, message, paymentId }` |

`/api/webhooks` exige `Authorization: Bearer <token>` **e** o header
`X-Webhook-Signature` com o segredo configurado no servidor. Com um segredo
errado a API responde `401 { "message": "Invalid webhook signature" }`. Detalhes
em [`../API.md`](../API.md).

## 💡 Exemplo de Uso

```typescript
import { loadPendingWebhooks, login, sendWebhook } from "./webhook.handler.ts";

const apiUrl = "https://api-mock-98te.onrender.com";
const token = await login(apiUrl, "joao@email.com", "123456");
const webhooks = await loadPendingWebhooks("./data/exemplo-webhook.json");

for (const webhook of webhooks) {
  const result = await sendWebhook(webhook, apiUrl, "seu_secret_aqui", token);
  console.log(result.success ? "✅" : "❌", result.message);
}
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Type guards / narrowing (TypeScript)](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Fetch API — headers (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Headers)
- [Webhook (Wikipedia)](https://en.wikipedia.org/wiki/Webhook)
- [`SubtleCrypto.sign()` / HMAC (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign)
- [Idempotência (MDN Glossary)](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)

## 📝 Notas

- Em provedores reais a assinatura costuma ser um HMAC-SHA256 do corpo com o
  segredo; a API mock simplifica e compara o segredo diretamente.
- Webhooks podem ser reenviados: use um `Set` de `paymentId` já enviados para
  garantir idempotência.
- Nunca faça commit do `.env` com o segredo real.
- Log detalhado de cada envio ajuda na auditoria.

---

**Dica:** Webhooks podem ser reenviados. Implemente verificação de duplicatas.
