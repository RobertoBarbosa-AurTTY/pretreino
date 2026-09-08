# Desafio 9: Processamento de Fila

## 🎯 Objetivo

Criar um sistema de processamento de tarefas assíncronas com fila e workers.

## 📋 Contexto Real

O sistema precisa processar tarefas pesadas em background:
- Processamento de imagens
- Envio de emails em massa
- Geração de relatórios
- Sincronização de dados

## 📐 Requisitos

- [ ] Criar fila de tarefas
- [ ] Implementar workers para processamento
- [ ] Controle de concorrência
- [ ] Retry com backoff
- [ ] Monitoramento da fila

## 🗂️ Estrutura dos Dados

```typescript
interface Tarefa {
  id: string;
  tipo: string;
  dados: unknown;
  status: "pendente" | "processando" | "concluida" | "falha";
  tentativas: number;
  maxTentativas: number;
  dataCriacao: string;
  dataProcessamento?: string;
}

interface Worker {
  id: string;
  processando: boolean;
  tarefaAtual?: Tarefa;
}

interface FilaConfig {
  maxWorkers: number;
  maxTentativas: number;
  delayRetry: number;
  timeoutProcessamento: number;
}
```

## 💡 Exemplo de Uso

```typescript
const fila = new Fila({ maxWorkers: 3, maxTentatives: 3 });

// Adicionar tarefas
await fila.adicionar({ tipo: "enviar_email", dados: { para: "..." } });
await fila.adicionar({ tipo: "gerar_relatorio", dados: { ... } });

// Processar fila
await fila.processar();
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

- Use `Promise.allSettled` para processar em paralelo
- Implemente timeout para tarefas
- Considere usar `AbortController` para cancelamento
- Log detalhado para debugging

---

**Dica:** Limite a concorrência para não sobrecarregar o sistema.
