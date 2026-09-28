# Desafio 34: CQRS

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar Command Query Responsibility Segregation (CQRS): um barramento de
comandos (escrita) e um barramento de queries (leitura), cada um despachando
para handlers registrados por tipo.

## 📋 Contexto Real

Sistemas com alta carga de leitura:

- Redes sociais
- E-commerce com catálogo
- Dashboards em tempo real

Separar escrita e leitura permite otimizar cada lado (ex.: um read model
desnormalizado só para consultas).

## 📐 Requisitos

As classes ficam em `src/cqrs.service.ts`.

**`CommandBus`**

- [ ] `register(type, handler)` associa um `CommandHandler` a um tipo de comando
- [ ] Registrar um segundo handler para o mesmo tipo lança erro
- [ ] `dispatch(command)` chama o handler do `command.type` e aguarda sua
      conclusão
- [ ] `dispatch` de comando sem handler rejeita com erro
- [ ] Erros lançados pelo handler são propagados por `dispatch`

**`QueryBus`**

- [ ] `register(type, handler)` associa um `QueryHandler` a um tipo de query
      (duplicado lança erro)
- [ ] `execute(query)` retorna o resultado do handler do `query.type`
- [ ] `execute` de query sem handler rejeita com erro

**Pipeline (`src/index.ts`)**

- [ ] Um write model (ex.: lista de produtos) atualizado pelos command handlers
- [ ] Um read model separado (ex.: contagem por categoria) sincronizado a cada
      comando e consultado pelos query handlers

## 🗂️ Estrutura dos Dados

```typescript
export interface Command {
  type: string;
  payload: unknown;
  timestamp: string;
}

export interface Query {
  type: string;
  filters: Record<string, unknown>;
  pagination?: { page: number; limit: number };
}

export interface CommandHandler {
  handle(command: Command): Promise<void>;
}

export interface QueryHandler {
  handle(query: Query): Promise<unknown>;
}

export class CommandBus {
  register(type: string, handler: CommandHandler): void;
  dispatch(command: Command): Promise<void>;
}

export class QueryBus {
  register(type: string, handler: QueryHandler): void;
  execute(query: Query): Promise<unknown>;
}
```

## 💡 Exemplo de Uso

```typescript
import { CommandBus, QueryBus } from "./cqrs.service.ts";

const products: { name: string; category: string }[] = [];
const countByCategory = new Map<string, number>();

const commandBus = new CommandBus();
const queryBus = new QueryBus();

commandBus.register("CreateProduct", {
  async handle(cmd) {
    const product = cmd.payload as { name: string; category: string };
    products.push(product);
    countByCategory.set(
      product.category,
      (countByCategory.get(product.category) ?? 0) + 1,
    );
  },
});

queryBus.register("CountByCategory", {
  async handle(query) {
    return countByCategory.get(String(query.filters.category)) ?? 0;
  },
});

await commandBus.dispatch({
  type: "CreateProduct",
  payload: { name: "Caneta", category: "papelaria" },
  timestamp: new Date().toISOString(),
});

await queryBus.execute({
  type: "CountByCategory",
  filters: { category: "papelaria" },
}); // 1
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [CQRS (Martin Fowler)](https://martinfowler.com/bliki/CQRS.html)
- [Map (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Classes (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes)
- [async/await (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function)

## 📝 Notas

- Commands alteram estado e não retornam dados; Queries retornam dados e não
  alteram estado
- Em produção, write e read models podem usar bancos diferentes (sincronizados
  por eventos)
- Combina muito bem com o Desafio 33 (Event Sourcing)
- Comece simples: separe as camadas antes de usar bancos diferentes
