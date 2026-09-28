# Desafio 21: Job Scheduler

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar um agendador de tarefas (cron jobs) em memória, exposto por uma API
HTTP, capaz de calcular o próximo horário de execução a partir de uma expressão
cron, executar os comandos registrados e manter o histórico de execuções.

## 📋 Contexto Real

Todo backend tem tarefas recorrentes: backup do banco de madrugada, limpeza de
arquivos temporários, envio de relatórios, sincronização com sistemas externos.
Um scheduler precisa saber **quando** rodar cada job, **o que** executar e
**registrar** o resultado de cada execução para auditoria e troubleshooting.

## 📐 Requisitos

Arquivo: `src/scheduler.service.ts` (o servidor HTTP em `src/index.ts` já está
pronto).

- [ ] `getNextRun(cron, from)` aceita expressões de 5 campos
      (`minuto hora dia-do-mês mês dia-da-semana`) com `*`, números, listas
      (`1,15`) e passos (`*/5`)
- [ ] `getNextRun` retorna a próxima data **estritamente posterior** a `from`
      (segundos zerados), no fuso local
- [ ] `getNextRun` lança erro para expressão inválida (número de campos errado,
      valor fora do intervalo, texto)
- [ ] `createJob` gera `id` único, `createdAt` (ISO 8601), `active: true` e
      `nextRun` calculado; lança erro se o cron for inválido
- [ ] `listJobs` retorna todos os jobs; `getJobById` retorna `undefined` para id
      inexistente
- [ ] `toggleJob(id, active)` altera `active` e retorna o job atualizado, ou
      `null` se não existir; desativar cancela o agendamento
- [ ] `deleteJob` remove o job (e seu timer) e retorna `true`, ou `false` se não
      existir
- [ ] `registerCommand(command, handler)` associa um handler a um comando
- [ ] `executeJob(id)` executa o handler do comando do job, grava uma
      `Execution` com `start`/`end` e atualiza `lastRun`/`nextRun` do job
- [ ] Se o handler retornar uma string, ela vai em `result` e `status` é
      `"success"`; se lançar erro (ou o comando não tiver handler), `status` é
      `"error"` e `error` contém a mensagem
- [ ] `executeJob` rejeita quando o job não existe
- [ ] `listExecutions(jobId)` retorna as execuções do job em ordem cronológica
- [ ] `startAll()` liga o scheduler: cada job ativo é executado automaticamente
      no horário de `nextRun` e reagendado para o próximo; jobs criados/ativados
      com o scheduler ligado também são agendados
- [ ] `stopAll()` cancela todos os timers pendentes (nenhuma execução acontece
      depois)
- [ ] Extra: retry automático usando `MAX_RETRIES` e `RETRY_DELAY_MS` quando a
      execução falhar

## 🗂️ Estrutura dos Dados

```typescript
export interface Job {
  id: string;
  name: string;
  cron: string;
  command: string;
  active: boolean;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
}

export interface Execution {
  id: string;
  jobId: string;
  start: string;
  end?: string;
  status: "success" | "error" | "running";
  result?: string;
  error?: string;
}

export type CommandHandler = () => Promise<string | void> | string | void;
```

## 💡 Exemplo de Uso

```typescript
import {
  createJob,
  executeJob,
  getNextRun,
  registerCommand,
  startAll,
} from "./src/scheduler.service.ts";

registerCommand("backup", async () => {
  // ... faz o backup
  return "backup concluído";
});

getNextRun("*/5 * * * *", new Date(2024, 0, 15, 10, 2)); // 15/01/2024 10:05

const job = createJob({ name: "backup", cron: "0 * * * *", command: "backup" });
startAll();

const execution = await executeJob(job.id); // execução manual
console.log(execution.status); // "success"
```

Via HTTP (com `deno task dev` rodando):

```bash
curl -X POST http://localhost:3009/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"name":"backup","cron":"0 * * * *","command":"backup"}'

curl http://localhost:3009/api/jobs
curl -X PATCH http://localhost:3009/api/jobs/<id> -d '{"active":false}'
curl -X POST http://localhost:3009/api/jobs/<id>/executar
curl http://localhost:3009/api/jobs/<id>/execucoes
```

## ⚙️ Setup

```bash
cd 21-job-scheduler
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [setTimeout — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/setTimeout)
- [clearTimeout — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/clearTimeout)
- [Date — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Deno.cron — Deno](https://docs.deno.com/api/deno/~/Deno.cron)

## 📝 Notas

- Prefira `setTimeout` até o próximo `nextRun` (e reagendar após executar) em
  vez de `setInterval` fixo: cron não tem intervalo constante.
- Guarde os ids dos timers por job para conseguir cancelar em `toggleJob`,
  `deleteJob` e `stopAll`.
- Os dados ficam em memória; persistência é um extra.
- `Deno.cron` existe, mas o objetivo aqui é implementar o agendamento você
  mesmo.
