# Desafio 09: Processamento de Fila

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Criar um sistema de processamento de tarefas assíncronas com fila, workers em
paralelo, retry com backoff e timeout por tentativa.

## 📋 Contexto Real

O sistema precisa processar tarefas pesadas em background:

- Processamento de imagens
- Envio de emails em massa
- Geração de relatórios

Sem controle de concorrência o servidor fica sobrecarregado; sem retry, uma
falha temporária perde a tarefa.

## 📐 Requisitos

Arquivo: `src/queue.service.ts`

- [ ] `registerHandler(type, handler)` registra a função que executa as tarefas
      daquele `type`
- [ ] `add(task)` cria a tarefa com `id` único, `status: "pendente"`,
      `attempts: 0`, `maxAttempts = config.maxAttempts` e `createdAt` (ISO) e
      retorna o `id`
- [ ] `process()` processa todas as tarefas pendentes com no máximo
      `config.maxWorkers` tarefas executando ao mesmo tempo
- [ ] Cada tarefa é executada pelo handler do seu `type`, recebendo `data` e um
      `AbortSignal`; tipo sem handler resulta em falha
- [ ] Se o handler lançar erro, tenta de novo até `maxAttempts` vezes, esperando
      `retryDelay × 2^(n-1)` ms entre as tentativas
- [ ] Cada tentativa é abortada após `config.processingTimeout` ms (o `signal`
      do handler é abortado) e conta como falha
- [ ] Ao final, a tarefa fica `"concluida"` ou `"falha"` e recebe `processedAt`
- [ ] `process()` retorna um `ProcessingResult` por tarefa, com `success`,
      `duration` (ms) e `error` (mensagem do último erro) em caso de falha
- [ ] `getStatus()` retorna a contagem de tarefas por status
- [ ] `src/index.ts`: `loadTasks()` lê `data/fila-tarefas.json`, registra
      handlers simulados para os três tipos, processa e exibe os resultados

## 🗂️ Estrutura dos Dados

```typescript
export interface Task {
  id: string;
  type: string;
  data: unknown;
  status: "pendente" | "processando" | "concluida" | "falha";
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  processedAt?: string;
}

/** Input accepted by `Queue.add()` */
export type NewTask = Omit<
  Task,
  "id" | "status" | "attempts" | "maxAttempts" | "createdAt"
>;

/** Function that executes a task type; must stop when `signal` is aborted */
export type TaskHandler = (data: unknown, signal: AbortSignal) => Promise<void>;

export interface QueueConfig {
  maxWorkers: number;
  maxAttempts: number;
  retryDelay: number;
  processingTimeout: number;
}

export interface ProcessingResult {
  taskId: string;
  success: boolean;
  duration: number;
  error?: string;
}
```

Tarefas de exemplo (`NewTask[]`): `data/fila-tarefas.json`.

## 💡 Exemplo de Uso

```typescript
import { Queue } from "./queue.service.ts";

const queue = new Queue({
  maxWorkers: 3,
  maxAttempts: 3,
  retryDelay: 1000,
  processingTimeout: 30000,
});

queue.registerHandler("enviar_email", async (data, signal) => {
  console.log("Enviando email", data, signal.aborted);
});

await queue.add({ type: "enviar_email", data: { to: "cliente@email.com" } });
const results = await queue.process();
console.log(results, queue.getStatus());
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [`Promise.all()` / `Promise.allSettled()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [`AbortController` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/AbortController)
- [`AbortSignal.timeout()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
- [Event loop e concorrência (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Event_loop)
- [Exponential backoff (Wikipedia)](https://en.wikipedia.org/wiki/Exponential_backoff)

## 📝 Notas

- Um padrão simples: crie `maxWorkers` promises (workers) que ficam pegando a
  próxima tarefa pendente até a fila acabar, e aguarde todas.
- Marque a tarefa como `"processando"` ao retirá-la da fila para que dois
  workers não peguem a mesma.
- Log de início/fim de cada tarefa ajuda no debugging.

---

**Dica:** Limite a concorrência para não sobrecarregar o sistema.
