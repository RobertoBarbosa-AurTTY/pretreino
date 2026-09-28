# Desafio 29: Processamento Assíncrono

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar um pool de workers em memória com fila de prioridade, limite de
concorrência, acompanhamento de progresso, cancelamento, timeout e retry.

## 📋 Contexto Real

Tarefas pesadas não devem travar a requisição do usuário:

- Processamento de imagens/vídeos
- Geração de relatórios
- Importação/exportação de dados
- Jobs de manutenção

A API aceita a tarefa, devolve um id e o processamento acontece em segundo
plano, com progresso consultável.

## 📐 Requisitos

Arquivo: `src/worker.service.ts`. Tudo é feito pelo objeto retornado por
`createPool(config)`.

- [ ] `register(type, handler)` associa um handler a um tipo de tarefa
- [ ] `add(task)` retorna a tarefa com `id` único, `status: "pending"`,
      `progress: 0`, `attempts: 0`, `createdAt` (ISO 8601) e `maxAttempts`
      (padrão `3`)
- [ ] `add` rejeita tipo sem handler registrado e qualquer tarefa depois de
      `shutdown()`
- [ ] No máximo `maxConcurrent` tarefas ficam em `"processing"` ao mesmo tempo
- [ ] A próxima tarefa a rodar é a de maior prioridade
      (`critical > high > medium > low`); dentro da mesma prioridade, a mais
      antiga (FIFO)
- [ ] Ao iniciar: `status: "processing"`, `startedAt` preenchido e `attempts`
      incrementado
- [ ] Sucesso: `status: "completed"`, `result` = retorno do handler,
      `progress: 100`, `completedAt` preenchido
- [ ] Erro do handler: tenta de novo até `maxAttempts`; se todas falharem,
      `status: "failed"` e `error` com a mensagem do último erro
- [ ] Handler que passar de `timeout` ms conta como falha, com `error` contendo
      `"timeout"`, e seu `signal` é abortado
- [ ] `wait(taskId)` resolve com a tarefa quando ela chega a `completed`,
      `failed` ou `canceled`; `get(taskId)` retorna o estado atual
- [ ] `cancel(taskId)`: tarefa pendente sai da fila sem rodar; tarefa em
      processamento tem o `signal` abortado; nos dois casos fica `"canceled"` e
      retorna `true`. Retorna `false` para tarefa inexistente ou já finalizada
- [ ] `onProgress(callback)` recebe `{ taskId, progress, message }` a cada
      chamada de `context.onProgress` dentro do handler; retorna função para
      cancelar a inscrição
- [ ] `stats()` retorna `totalProcessed` (concluídas + falhas), `completed`,
      `failures`, `avgTime` (ms médios das concluídas) e `currentQueue`
      (pendentes)
- [ ] `shutdown()` para de aceitar tarefas, aguarda as já aceitas terminarem e
      limpa qualquer timer
- [ ] Extra: health check a cada `healthCheckInterval` ms para detectar workers
      travados

## 🗂️ Estrutura dos Dados

```typescript
export interface Task<TInput, TOutput> {
  id: string;
  type: string;
  input: TInput;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "processing" | "completed" | "failed" | "canceled";
  result?: TOutput;
  error?: string;
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  attempts: number;
  maxAttempts: number;
}

export interface WorkerConfig {
  maxConcurrent: number;
  timeout: number;
  healthCheckInterval: number;
}

export interface ProgressUpdate {
  taskId: string;
  progress: number;
  message?: string;
  stage?: string;
}

export interface WorkerStats {
  totalProcessed: number;
  completed: number;
  failures: number;
  avgTime: number;
  currentQueue: number;
}

export type NewTask<TInput> =
  & Pick<Task<TInput, unknown>, "type" | "input" | "priority">
  & { maxAttempts?: number };

export type TaskHandler<TInput, TOutput> = (
  input: TInput,
  context: {
    /** Report progress (0-100) */
    onProgress: (progress: number, message?: string) => void;
    /** Aborted when the task is canceled or times out */
    signal: AbortSignal;
  },
) => Promise<TOutput>;

export interface WorkerPool {
  register<TInput, TOutput>(
    type: string,
    handler: TaskHandler<TInput, TOutput>,
  ): void;
  add<TInput>(task: NewTask<TInput>): Promise<Task<TInput, unknown>>;
  get(taskId: string): Task<unknown, unknown> | undefined;
  wait(taskId: string): Promise<Task<unknown, unknown>>;
  cancel(taskId: string): Promise<boolean>;
  onProgress(callback: (update: ProgressUpdate) => void): () => void;
  stats(): WorkerStats;
  shutdown(): Promise<void>;
}
```

## 💡 Exemplo de Uso

```typescript
import { createPool } from "./src/worker.service.ts";

const pool = createPool({
  maxConcurrent: 5,
  timeout: 30_000,
  healthCheckInterval: 10_000,
});

pool.register<{ url: string }, { processedUrl: string }>(
  "process-image",
  async (input, { onProgress, signal }) => {
    onProgress(50, "redimensionando");
    // ... use `signal` para interromper trabalho cancelado
    return { processedUrl: `${input.url}?w=800` };
  },
);

pool.onProgress((update) =>
  console.log(`Task ${update.taskId}: ${update.progress}%`)
);

const task = await pool.add({
  type: "process-image",
  input: { url: "https://example.com/foto.jpg" },
  priority: "high",
});

const done = await pool.wait(task.id);
console.log(done.status, done.result, pool.stats());

await pool.shutdown();
```

## ⚙️ Setup

```bash
cd 29-processamento-assincrono
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [AbortController — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/AbortController)
- [Promise.race — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [Semáforo (computação) — Wikipedia](https://pt.wikipedia.org/wiki/Sem%C3%A1foro_(computa%C3%A7%C3%A3o))
- [Web Workers no Deno](https://docs.deno.com/runtime/reference/web_platform_apis/#web-workers)

## 📝 Notas

- Guarde cópias (snapshots) ou o objeto vivo da tarefa, mas seja consistente:
  `wait` e `get` devem refletir o estado final.
- Limpe o timer de timeout assim que o handler terminar para não deixar timers
  pendentes.
- Para CPU pesada de verdade, `Worker` (Web Workers) roda em outra thread; aqui
  o foco é a orquestração.
- Tarefas que falham definitivamente podem ir para uma dead letter queue
  (extra).
