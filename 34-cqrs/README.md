# Desafio 34: CQRS

## 🎯 Objetivo

Implementar Command Query Responsibility Segregation para separar leituras e escritas.

## 📋 Contexto Real

Sistemas com alta carga de leitura:
- Redes sociais
- E-commerce com catálogo
- Dashboards em tempo real

## 📐 Requisitos

- [ ] Separar comandos de queries
- [ ] Criar handlers para cada operação
- [ ] Implementar read/write models separados
- [ ] Sincronizar models
- [ ] Criar projecções otimizadas

## 🗂️ Estrutura dos Dados

```typescript
interface Command {
  type: string;
  payload: unknown;
  timestamp: string;
}

interface Query {
  type: string;
  filters: Record<string, unknown>;
  pagination?: { page: number; limit: number };
}

interface CommandHandler {
  handle(command: Command): Promise<void>;
}

interface QueryHandler {
  handle(query: Query): Promise<unknown>;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Commands alteram estado, Queries retornam dados
- Pode usar bases de dados diferentes para cada modelo
- Útil para escalabilidade horizontal

---

**Dica:** Comece simples - separe as camadas antes de usar bases diferentes.