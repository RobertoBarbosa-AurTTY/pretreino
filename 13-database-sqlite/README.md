# Desafio 13: Database SQLite

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar a camada de acesso a dados (CRUD de usuários) sobre SQLite e expô-la
em uma API REST.

## 📋 Contexto Real

Quase todo backend precisa persistir dados. SQLite é um banco relacional
embutido (um único arquivo, sem servidor) muito usado em protótipos, apps
desktop/mobile, testes e serviços pequenos. Os mesmos conceitos (tabelas,
prepared statements, constraints, transações) valem para PostgreSQL e MySQL.

O servidor HTTP em `src/index.ts` já está montado; seu trabalho é o
`src/database.ts`.

## 📐 Requisitos

- [ ] Usar SQLite via [`node:sqlite`](https://docs.deno.com/api/node/sqlite/)
      (`DatabaseSync`), abrindo o banco em `DATABASE_PATH` (padrão `:memory:`
      quando a variável não existir)
- [ ] `createTable()` cria a tabela `users` (`id` autoincremento, `name`,
      `email` **UNIQUE**, `createdAt`, `updatedAt`) se ela ainda não existir;
      chamar de novo não apaga dados nem lança erro
- [ ] `create({ name, email })` insere e retorna o usuário com `id`, `createdAt`
      e `updatedAt` (datas ISO 8601)
- [ ] `create` lança erro se o email já estiver cadastrado
- [ ] `findById(id)` / `findByEmail(email)` retornam o usuário ou `undefined`
- [ ] `listAll()` retorna todos os usuários; `count()` retorna a quantidade
- [ ] `update(id, data)` altera só os campos informados (`name`, `email`),
      atualiza `updatedAt` e retorna o usuário atualizado, ou `null` se o `id`
      não existir
- [ ] `remove(id)` retorna `true` se apagou e `false` se o `id` não existir
- [ ] Todas as queries usam **prepared statements** com parâmetros (`?`), nunca
      concatenação de strings

## 🗂️ Estrutura dos Dados

```typescript
export interface User {
  id?: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Endpoints do servidor (`src/index.ts`)

| Método   | Rota                | Descrição      |
| -------- | ------------------- | -------------- |
| `GET`    | `/api/usuarios`     | Lista usuários |
| `GET`    | `/api/usuarios/:id` | Busca por id   |
| `POST`   | `/api/usuarios`     | Cria usuário   |
| `PUT`    | `/api/usuarios/:id` | Atualiza       |
| `DELETE` | `/api/usuarios/:id` | Remove         |

## 💡 Exemplo de Uso

```typescript
import { create, createTable, findByEmail, update } from "./src/database.ts";

createTable();
const user = create({ name: "João", email: "joao@email.com" });
// { id: 1, name: "João", email: "joao@email.com", createdAt: "...", updatedAt: "..." }

update(user.id!, { name: "João Silva" });
findByEmail("joao@email.com")?.name; // "João Silva"
```

```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com"}'

curl http://localhost:3001/api/usuarios
```

## ⚙️ Setup

```bash
cd 13-database-sqlite
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Deno: node:sqlite](https://docs.deno.com/api/node/sqlite/)
- [SQLite: CREATE TABLE](https://www.sqlite.org/lang_createtable.html)
- [SQLite: INSERT](https://www.sqlite.org/lang_insert.html)
- [Utility types: Omit e Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## 📝 Notas

- O arquivo do banco (`app.db`) não deve ser versionado.
- Extra: migrações versionadas, paginação em `listAll`, transação ao inserir
  vários usuários de uma vez.
