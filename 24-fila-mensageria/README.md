# Desafio 24: Fila de Mensageria

## 🎯 Objetivo

Implementar um sistema de filas para processamento assíncrono de tarefas usando um broker de mensagens.

## 📋 Contexto Real

Sistemas distribuídos precisam de filas:
- Processamento de pedidos
- Envio de notificações
- Processamento de imagens
- Integrações com sistemas externos

## 📐 Requisitos

- [ ] Configurar broker de mensagens (RabbitMQ/SQS/Redis)
- [ ] Criar producer para enviar mensagens
- [ ] Implementar consumer para processar mensagens
- [ ] Tratar erros com retry e dead letter queue
- [ ] Implementar prioridade de filas
- [ ] Monitorar tamanho das filas

## 🗂️ Estrutura dos Dados

```typescript
interface Mensagem<T> {
  id: string;
  tipo: string;
  payload: T;
  metadata: {
    criadaEm: string;
    tentativas: number;
    maxTentativas: number;
    fila: string;
  };
}

interface FilaConfig {
  nome: string;
  duravel: boolean;
  maxRetries: number;
  deadLetterQueue?: string;
  prefetch?: number;
}

interface ResultadoProcessamento {
  sucesso: boolean;
  mensagemId: string;
  processadaEm: string;
  erro?: string;
}

interface MetricasFila {
  fila: string;
  pendentes: number;
  processando: number;
  falhas: number;
  concluidas: number;
}
```

## 💡 Exemplo de Uso

```typescript
// Configurar fila
const filaPedidos = new Fila<Pedido>({
  nome: "pedidos",
  duravel: true,
  maxRetries: 3,
  deadLetterQueue: "pedidos-dlq"
});

// Enviar mensagem
await filaPedidos.enviar({
  tipo: "novo_pedido",
  payload: { id: "123", itens: [...] }
});

// Consumir mensagens
await filaPedidos.consumir(async (mensagem) => {
  await processarPedido(mensagem.payload);
  return { sucesso: true };
});
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

- Use AMQP para RabbitMQ
- Implemente exponential backoff para retries
- Considere idempotência no processamento
- Monitore filas com métricas
- Implemente graceful shutdown

---

**Dica:** Sempre processe mensagens de forma idempotente, pois mensagens podem ser reprocessadas em caso de falha.