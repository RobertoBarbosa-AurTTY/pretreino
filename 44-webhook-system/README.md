# Desafio 44: Webhook System

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar o lado **emissor** de webhooks: registrar destinos, disparar eventos
com payload assinado (HMAC), tentar novamente com backoff e registrar cada
entrega.

## 📋 Contexto Real

Gateways de pagamento, GitHub e Stripe avisam outros sistemas via webhooks. Quem
envia precisa:

- Saber quais URLs querem receber quais eventos
- Assinar o payload para o receptor confirmar a origem
- Lidar com receptores fora do ar (retry com backoff)
- Manter um log de entregas para auditoria e reenvio

> O desafio 06 trata o lado **receptor**; aqui você constrói o emissor.

## 📐 Requisitos

- [ ] `register(webhook)` retorna o webhook com um `id` único gerado
- [ ] `signPayload(payload, secret)` retorna o HMAC-SHA256 em **hex minúsculo**
      de `JSON.stringify(payload)` usando `secret` como chave
- [ ] `verifySignature(payload, signature, secret)` retorna `true` somente se
      `signature` for igual a `signPayload(payload, secret)`
- [ ] `trigger(event, payload)` envia a entrega **apenas** para webhooks com
      `active: true` cujo `events` contém `event`
- [ ] Cada entrega é um `POST` para `webhook.url` com body
      `JSON.stringify(payload)` e os headers `Content-Type: application/json`,
      `X-Webhook-Event: <event>` e `X-Webhook-Signature: <assinatura>`
- [ ] Resposta 2xx = sucesso. Resposta não-2xx ou erro de rede = falha: tenta de
      novo até `maxAttempts` vezes (padrão 3), esperando
      `baseDelayMs * 2^(tentativa - 1)` entre tentativas
- [ ] Cada entrega vira um `WebhookDelivery` com `status` final
      (`"success"`/`"failed"`), número de `attempts` e `lastError` (mensagem do
      último erro ou status HTTP) em caso de falha
- [ ] `trigger` só resolve depois que todas as entregas terminaram e **nunca
      lança** por falha de entrega
- [ ] `getDeliveries(webhookId)` retorna as entregas daquele webhook (`[]` se
      não houver)
- [ ] `unregister(id)` remove o webhook: novos `trigger`s não o chamam mais
- [ ] `src/index.ts`: cria o serviço com `WEBHOOK_MAX_ATTEMPTS` e
      `WEBHOOK_BASE_DELAY_MS` do `.env`, registra um webhook e dispara um evento

## 🗂️ Estrutura dos Dados

```typescript
interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: unknown;
  status: "pending" | "success" | "failed";
  attempts: number;
  lastError?: string;
}

interface WebhookServiceOptions {
  /** Número máximo de tentativas por entrega (padrão: 3). */
  maxAttempts?: number;
  /** Atraso base do backoff exponencial, em ms (padrão: 1000). */
  baseDelayMs?: number;
}

interface WebhookService {
  register(webhook: Omit<Webhook, "id">): Webhook;
  unregister(id: string): void;
  trigger(event: string, payload: unknown): Promise<void>;
  getDeliveries(webhookId: string): WebhookDelivery[];
}
```

## 💡 Exemplo de Uso

```typescript
import {
  createService,
  signPayload,
  verifySignature,
} from "./webhook.service.ts";

const service = createService({ maxAttempts: 3, baseDelayMs: 500 });

const hook = service.register({
  url: "https://minha-loja.example/webhooks/pagamentos",
  events: ["pagamento.pago", "pagamento.falhou"],
  secret: "s3cr3t",
  active: true,
});

await service.trigger("pagamento.pago", { paymentId: "pag_123", amount: 150 });
console.log(service.getDeliveries(hook.id));

// No receptor:
const ok = await verifySignature(
  body,
  req.headers.get("X-Webhook-Signature")!,
  "s3cr3t",
);
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [SubtleCrypto.sign — HMAC (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign)
- [Fetch API (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [Promise.allSettled (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [Exponential backoff (Google Cloud)](https://cloud.google.com/storage/docs/retry-strategy#exponential-backoff)
- [crypto.randomUUID (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Crypto/randomUUID)

## 📝 Notas

- Compare assinaturas em tempo constante para evitar timing attacks
- O receptor deve ser idempotente: a mesma entrega pode chegar mais de uma vez
- Extra: limitar a taxa de envio por destino e desativar webhooks que falham
  sempre
