# Desafio 25: API GraphQL

## 🎯 Objetivo

Criar uma API GraphQL completa com resolvers, subscriptions e tratamento de erros.

## 📋 Contexto Real

GraphQL oferece flexibilidade para clientes:
- Clientes buscam apenas dados necessários
- Reduz over-fetching e under-fetching
- Subscriptions para dados em tempo real
- Schema auto-documentado

## 📐 Requisitos

- [ ] Definir schema GraphQL completo
- [ ] Implementar resolvers para queries e mutations
- [ ] Criar subscriptions para tempo real
- [ ] Implementar autenticação no GraphQL
- [ ] Tratar erros de forma elegante
- [ ] Criar dataloader para resolver N+1

## 🗂️ Estrutura dos Dados

```typescript
// Schema GraphQL
interface User {
  id: ID!;
  nome: String!;
  email: String!;
  posts: [Post!]!;
  criadoEm: String!;
}

interface Post {
  id: ID!;
  titulo: String!;
  conteudo: String!;
  autor: User!;
  publicado: Boolean!;
  criadoEm: String!;
}

interface Query {
  usuarios: [User!]!;
  usuario(id: ID!): User
  posts(filtro: PostFilter): [Post!]!
}

interface Mutation {
  criarUsuario(input: CreateUserInput!): User!
  atualizarUsuario(id: ID!, input: UpdateUserInput!): User!
  deletarUsuario(id: ID!): Boolean!
  criarPost(input: CreatePostInput!): Post!
}

interface Subscription {
  postCriado: Post!
  notificacao(userId: ID!): Notificacao!
}
```

## 💡 Exemplo de Uso

```graphql
# Query
query {
  usuarios {
    id
    nome
    email
    posts {
      titulo
    }
  }
}

# Mutation
mutation {
  criarUsuario(input: {
    nome: "João"
    email: "joao@email.com"
  }) {
    id
    nome
  }
}

# Subscription
subscription {
  postCriado {
    id
    titulo
    autor {
      nome
    }
  }
}
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

- Use GraphQL Yoga ou Apollo Server
- Implemente depth limiting para segurança
- Use directives para autorização
- Implemente persisted queries
- Considere schema stitching para microserviços

---

**Dica:** Sempre implemente depth limiting para prevenir ataques de queries complexas que podem sobrecarregar o servidor.