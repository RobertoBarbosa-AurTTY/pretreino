# Desafio 29: Processamento Assíncrono

## 🎯 Objetivo

Implementar um sistema de processamento assíncrono com workers, filas de prioridade e gerenciamento de concorrência.

## 📋 Contexto Real

Tarefas pesadas precisam de processamento assíncrono:
- Processamento de imagens/vídeos
- Geração de relatórios
- Importação/exportação de dados
- Jobs de manutenção

## 📐 Requisitos

- [ ] Criar pool de workers
- [ ] Implementar fila de prioridade
- [ ] Gerenciar concorrência (semáforo)
- [ ] Implementar progress tracking
- [ ] Criar sistema de cancelamento
- [ ] Tratar erros e retry de workers

## 🗂️ Estrutura dos Dados

```typescript
interface Task<TInput, TOutput> {
  id: string;
  tipo: string;
  input: TInput;
  prioridade: "baixa" | "media" | "alta" | "critica";
  status: "pendente" | "processando" | "concluida" | "falha" | "cancelada";
  resultado?: TOutput;
  erro?: string;
  progresso: number;
  criadaEm: string;
  iniciadaEm?: string;
  concluidaEm?: string;
  tentativas: number;
  maxTentativas: number;
}

interface WorkerConfig {
  maxConcorrentes: number;
  timeout: number;
  healthCheckInterval: number;
}

interface TaskQueue {
  fila: Task<unknown, unknown>[];
  processando: Map<string, Task<unknown, unknown>>;
  concluidas: Task<unknown, unknown>[];
}

interface ProgressUpdate {
  taskId: string;
  progresso: number;
  mensagem?: string;
  etapa?: string;
}

interface WorkerStats {
  totalProcessadas: number;
  concluidas: number;
  falhas: number;
  tempoMedio: number;
  filaAtual: number;
}
```

## 💡 Exemplo de Uso

```typescript
// Criar worker pool
const pool = new WorkerPool({
  maxConcorrentes: 5,
  timeout: 30000,
  healthCheckInterval: 10000
});

// Registrar handler
pool.register("processar-imagem", async (input) => {
  const resultado = await processarImagem(input.url);
  return { urlProcessada: resultado.url };
});

// Adicionar tarefa
const task = await pool.adicionar({
  tipo: "processar-imagem",
  input: { url: "https://example.com/foto.jpg" },
  prioridade: "alta"
});

// Acompanhar progresso
pool.on("progress", (update: ProgressUpdate) => {
  console.log(`Task ${update.taskId}: ${update.progresso}%`);
});

// Cancelar tarefa
await pool.cancelar(task.id);
```

## ⚙️ Setup

```bash
deno task dev
```

## 🧪 Testes

```bash
deno task test
```

## 📝 Notas

- Implemente graceful shutdown
- Use semáforo para limitar concorrência
- Implemente dead letter queue para tarefas falhas
- Considere distributed workers para escala
- Implemente métricas de performance

---

**Dica:** Implemente health check nos workers para detectar travamentos e reiniciar automaticamente.