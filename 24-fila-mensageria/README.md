# Desafio 24: Fila de Mensageria

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar um sistema de filas para processamento assíncrono de mensagens, com
producer, consumer, retry, dead letter queue (DLQ) e métricas.

## 📋 Contexto Real

Sistemas distribuídos usam filas para desacoplar quem produz de quem processa:

- Processamento de pedidos
- Envio de notificações
- Processamento de imagens
- Integrações com sistemas externos

Neste desafio o broker é **em memória**; adaptar a mesma API para
RabbitMQ/Redis/SQS é um extra.

## 📐 Requisitos

Arquivo: `src/queue.service.ts`.

- [ ] `createQueue(config)` registra a fila; se `deadLetterQueue` for informado,
      a DLQ também é criada (se ainda não existir)
- [ ] `sendMessage(queue, { type, payload })` gera `id` único, preenche
      `metadata` (`createdAt` ISO 8601, `attempts: 0`,
      `maxAttempts = config.maxRetries`, `queue`) e retorna o `id`
- [ ] `sendMessage` rejeita quando a fila não existe (ou foi fechada)
- [ ] `consumeMessages(queue, handler)` processa as mensagens pendentes em ordem
      FIFO até a fila esvaziar e resolve com um `ProcessingResult` final por
      mensagem (`messageId`, `processedAt`, `success`, `error?`)
- [ ] Antes de cada chamada ao handler, `metadata.attempts` é incrementado (1 na
      primeira tentativa)
- [ ] Se o handler retornar `{ success: false }` ou lançar erro, a mensagem é
      reprocessada; o handler é chamado no máximo `maxAttempts` vezes por
      mensagem
- [ ] Quando o handler lança erro, `error` no resultado contém a mensagem do
      erro
- [ ] Mensagem que esgota as tentativas conta em `failures` e, se houver
      `deadLetterQueue`, é enviada (com o mesmo `id`) para a DLQ
- [ ] `getMetrics(queue)` retorna `pending`, `processing`, `failures` e
      `completed` da fila
- [ ] `closeQueue(queue)` remove a fila; envios posteriores são rejeitados
- [ ] Extra: respeitar `prefetch` (quantas mensagens processar em paralelo) e
      backoff exponencial entre tentativas

## 🗂️ Estrutura dos Dados

```typescript
export interface Message<T> {
  id: string;
  type: string;
  payload: T;
  metadata: {
    createdAt: string;
    attempts: number;
    maxAttempts: number;
    queue: string;
  };
}

export interface QueueConfig {
  name: string;
  durable: boolean;
  maxRetries: number;
  deadLetterQueue?: string;
  prefetch?: number;
}

export interface ProcessingResult {
  success: boolean;
  messageId: string;
  processedAt: string;
  error?: string;
}

export interface QueueMetrics {
  queue: string;
  pending: number;
  processing: number;
  failures: number;
  completed: number;
}

export type HandlerResult = Omit<ProcessingResult, "messageId" | "processedAt">;
```

## 💡 Exemplo de Uso

```typescript
import {
  consumeMessages,
  createQueue,
  getMetrics,
  sendMessage,
} from "./src/queue.service.ts";

await createQueue({
  name: "orders",
  durable: true,
  maxRetries: 3,
  deadLetterQueue: "orders-dlq",
});

await sendMessage("orders", { type: "new_order", payload: { id: "123" } });

const results = await consumeMessages<{ id: string }>("orders", async (msg) => {
  console.log(
    `Processando pedido ${msg.payload.id} (tentativa ${msg.metadata.attempts})`,
  );
  return { success: true };
});

console.log(results, await getMetrics("orders"));
```

## ⚙️ Setup

```bash
cd 24-fila-mensageria
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Array.prototype.shift — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
- [Promise — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Dead letter exchanges — RabbitMQ](https://www.rabbitmq.com/docs/dlx)
- [Deno KV Queues — Deno](https://docs.deno.com/deploy/kv/manual/queue_overview/)

## 📝 Notas

- Processe mensagens de forma **idempotente**: em caso de falha, a mesma
  mensagem pode ser entregue de novo.
- `BROKER_URL` só é necessário se você fizer o extra de usar um broker real
  (ex.: `npm:amqplib` para RabbitMQ).
- Implemente graceful shutdown: ao fechar a fila, termine a mensagem em
  processamento antes de sair.
- Prioridade de mensagens é um bom extra.
