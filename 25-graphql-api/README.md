# Desafio 25: API GraphQL

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Criar uma API GraphQL com schema, resolvers de queries e mutations,
subscriptions e tratamento de erros, usando a biblioteca `graphql` (graphql-js).

## 📋 Contexto Real

GraphQL dá flexibilidade aos clientes:

- O cliente busca apenas os campos de que precisa
- Reduz over-fetching e under-fetching
- Subscriptions entregam dados em tempo real
- O schema é auto-documentado

## 📐 Requisitos

Arquivo: `src/graphql.service.ts` (dados em memória). A dependência `graphql`
(`npm:graphql@^16`) já está no `deno.json`.

- [ ] `createSchema()` retorna o SDL (string) com os tipos `User`, `Post`, os
      inputs e as operações abaixo:
  - `Query`: `users: [User!]!`, `user(id: ID!): User`,
    `posts(filter: PostFilter): [Post!]!`
  - `Mutation`: `createUser(input: CreateUserInput!): User!`,
    `updateUser(id: ID!, input: UpdateUserInput!): User!`,
    `deleteUser(id: ID!): Boolean!`,
    `createPost(input: CreatePostInput!): Post!`
  - `Subscription`: `postCreated: Post!`
- [ ] `resolveCreateUser` gera `id`, `createdAt` (ISO 8601) e `posts: []`;
      rejeita email já cadastrado
- [ ] `resolveUsers` lista todos os usuários; `resolveUser(id)` retorna `null`
      se não existir
- [ ] `resolveCreatePost` cria o post com `published` padrão `false`, associa ao
      autor (aparece em `author.posts`) e rejeita `authorId` inexistente
- [ ] `resolvePosts(filter?)` filtra por `authorId` e/ou `published`
- [ ] `executeQuery`/`executeMutation(source, variables?)` executam a operação
      no schema e resolvem com o `data` do resultado
- [ ] `executeQuery`/`executeMutation` rejeitam quando o resultado tem `errors`
      (campo inexistente, erro de sintaxe, erro de resolver)
- [ ] `updateUser` altera apenas os campos enviados; `deleteUser` remove o
      usuário e retorna `true` (ou `false` se não existir)
- [ ] `subscribe("subscription { postCreated { ... } }", callback)` chama
      `callback` com `{ postCreated: {...} }` (só com os campos pedidos) a cada
      post criado e retorna uma função que cancela a inscrição
- [ ] `src/index.ts`: servir `POST /graphql` na porta `PORT` (extra: GraphiQL em
      `GET /graphql` quando `PLAYGROUND=true`)

## 🗂️ Estrutura dos Dados

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  posts: Post[];
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  published: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
  published?: boolean;
}

export interface PostFilter {
  authorId?: string;
  published?: boolean;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  executeMutation,
  executeQuery,
  subscribe,
} from "./src/graphql.service.ts";

const unsubscribe = subscribe<{ postCreated: { title: string } }>(
  "subscription { postCreated { title } }",
  (data) => console.log("Novo post:", data.postCreated.title),
);

const { createUser } = await executeMutation<{ createUser: { id: string } }>(
  `mutation ($input: CreateUserInput!) { createUser(input: $input) { id } }`,
  { input: { name: "João", email: "joao@email.com" } },
);

await executeMutation(
  `mutation ($id: ID!) { createPost(input: { title: "Olá", content: "...", authorId: $id }) { id } }`,
  { id: createUser.id },
);

const data = await executeQuery(`{ users { name posts { title } } }`);
unsubscribe();
```

## ⚙️ Setup

```bash
cd 25-graphql-api
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Schemas e tipos — graphql.org](https://graphql.org/learn/schema/)
- [graphql-js: `graphql()` e `buildSchema()`](https://graphql.org/graphql-js/graphql/)
- [Subscriptions — graphql.org](https://graphql.org/learn/subscriptions/)
- [npm packages no Deno](https://docs.deno.com/runtime/fundamentals/node/#using-npm-packages)
- [Deno.serve — Deno](https://docs.deno.com/api/deno/~/Deno.serve)

## 📝 Notas

- `User.posts` e `Post.author` são circulares: resolva-os via resolvers de campo
  em vez de guardar objetos aninhados.
- Para subscriptions, um pub/sub simples em memória resolve; `subscribe()` do
  graphql-js é uma opção mais completa.
- Implemente depth limiting para evitar queries abusivas (extra).
- DataLoader resolve o problema de N+1 (extra).
