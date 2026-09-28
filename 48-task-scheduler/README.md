# Desafio 48: Task Scheduler

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um agendador de tarefas baseado em expressões cron, com parser de
cron próprio, retry, pausa/retomada e histórico de execuções.

## 📋 Contexto Real

Backups noturnos, envio de relatórios às 9h de dias úteis, limpeza de cache a
cada 15 minutos... todo backend tem jobs recorrentes. Um scheduler precisa:

- Entender expressões cron e calcular a próxima execução
- Executar tarefas assíncronas sem travar as outras
- Registrar sucesso/falha de cada execução
- Permitir pausar, retomar e remover jobs

> O desafio 21 introduz jobs agendados; aqui você implementa o parser de cron e
> o scheduler do zero.

## 📐 Requisitos

- [ ] `parseCron(expression, from?)` aceita 5 campos
      `minuto hora dia-do-mês mês dia-da-semana` (dia-da-semana `0–6`, domingo =
      `0`) e retorna a **próxima** data, em **UTC** com segundos zerados,
      **estritamente depois** de `from` (padrão: agora)
- [ ] Cada campo aceita `*`, número, lista (`8,20`), faixa (`1-5`) e passo
      (`*/15`); quando dia-do-mês e dia-da-semana forem restritos ao mesmo
      tempo, ambos precisam bater (simplificação)
- [ ] Expressão inválida (número de campos ≠ 5, valor fora da faixa, texto) →
      lança `Error` cuja mensagem contém `"Invalid cron"`
- [ ] `addJob(job)` valida o cron (lança se inválido) e retorna o job com `id`
      único, `active: true` e `nextRun` (ISO 8601)
- [ ] Na hora de `nextRun`, o scheduler executa `task()`; ao terminar, grava um
      `JobExecution` (`start`, `end`, `status` `"success"` ou `"failed"` com
      `error` = mensagem) e atualiza `lastRun` e `nextRun` do job
- [ ] Se a task falhar e o job tiver `retries: n`, tenta de novo imediatamente
      até `n` vezes; a execução só é `"failed"` se todas falharem (continua
      sendo **uma** execução no histórico)
- [ ] `pauseJob(id)` → `active: false` e não executa; `resumeJob(id)` →
      `active: true` e reagenda a partir de agora
- [ ] `removeJob(id)` cancela o job e o remove de `getJobs()`
- [ ] `getExecutions(jobId)` retorna o histórico em ordem cronológica
- [ ] `stop()` cancela todos os timers pendentes
- [ ] `src/index.ts`: registra ao menos dois jobs e imprime as execuções

## 🗂️ Estrutura dos Dados

```typescript
interface ScheduledJob {
  id: string;
  name: string;
  /** Expressão cron de 5 campos (minuto hora dia mês dia-da-semana), em UTC. */
  cron: string;
  task: () => Promise<void>;
  active: boolean;
  /** Tentativas extras imediatas quando a task falha (padrão: 0). */
  retries?: number;
  lastRun?: string;
  nextRun?: string;
}

interface JobExecution {
  jobId: string;
  start: string;
  end?: string;
  status: "running" | "success" | "failed";
  error?: string;
}

interface Scheduler {
  addJob(job: Omit<ScheduledJob, "id" | "active">): ScheduledJob;
  removeJob(id: string): void;
  pauseJob(id: string): void;
  resumeJob(id: string): void;
  getJobs(): ScheduledJob[];
  getExecutions(jobId: string): JobExecution[];
  /** Cancela todos os timers (nenhum job roda depois disso). */
  stop(): void;
}
```

## 💡 Exemplo de Uso

```typescript
import { createScheduler, parseCron } from "./scheduler.service.ts";

console.log(parseCron("0 9 * * 1-5").toISOString()); // próxima 9h UTC de dia útil

const scheduler = createScheduler();

const job = scheduler.addJob({
  name: "limpar-cache",
  cron: "*/15 * * * *",
  retries: 2,
  task: async () => {
    console.log("limpando cache...");
  },
});

// mais tarde
console.log(scheduler.getExecutions(job.id));
scheduler.pauseJob(job.id);
scheduler.stop();
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Formato cron (crontab.guru)](https://crontab.guru/)
- [setTimeout (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout)
- [Date — métodos UTC (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCHours)
- [Deno.cron](https://docs.deno.com/api/deno/~/Deno.cron) — a versão pronta,
  para comparar depois

## 📝 Notas

- Valide a expressão cron antes de registrar o job
- `setTimeout` com atrasos muito longos (> ~24,8 dias) estoura; reagende em
  etapas se precisar
- Extra: limitar execuções simultâneas (não iniciar se a anterior ainda está
  `"running"`) e lock distribuído para múltiplas instâncias
