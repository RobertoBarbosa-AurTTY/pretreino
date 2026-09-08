# Desafio 21: Job Scheduler

## 🎯 Objetivo

Implementar sistema de agendamento de tarefas (cron jobs).

## 📋 Requisitos

- [ ] Agendamento por cron expression
- [ ] Jobs periódicos
- [ ] Jobs one-shot
- [ ] Retry automático
- [ ] Logging de execuções

## 💡 Exemplo de Uso

```bash
# Criar job
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"nome":"backup","cron":"0 * * * *","comando":"backup"}'

# Listar jobs
curl http://localhost:3000/api/jobs

# Ver execuções
curl http://localhost:3000/api/jobs/1/execucoes
```

## ⚙️ Setup

```bash
cd 21-job-scheduler
deno task dev
```
