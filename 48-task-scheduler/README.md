# Desafio 48: Task Scheduler

## 🎯 Objetivo

Implementar agendador de tarefas com cron jobs e fila de execução.

## 📋 Contexto Real

Automação de tarefas:
- Jobs de manutenção
- Relatórios periódicos
- Limpeza de dados

## 📐 Requisitos

- [ ] Criar jobs com expressões cron
- [ ] Executar tarefas assincronamente
- [ ] Retry em caso de falha
- [ ] Log de execuções
- [ ] Dashboard de status

## 🗂️ Estrutura dos Dados

```typescript
interface ScheduledJob {
  id: string;
  nome: string;
  cron: string;
  task: () => Promise<void>;
  ativo: boolean;
  ultimaExecucao?: string;
  proximaExecucao?: string;
}

interface JobExecution {
  jobId: string;
  inicio: string;
  fim?: string;
  status: "running" | "success" | "failed";
  erro?: string;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Use biblioteca cron (ex: cron-parser)
- Implemente distributed locking para múltiplas instâncias
- Limite execuções simultâneas

---

**Dica:** Valide expressões cron antes de registrar.