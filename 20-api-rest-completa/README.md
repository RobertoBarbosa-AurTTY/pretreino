# Desafio 20: API REST Completa

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar o serviço de produtos de uma API REST completa: CRUD, paginação,
busca textual, filtros, ordenação e listagem de categorias.

## 📋 Contexto Real

Toda listagem de e-commerce ou painel administrativo precisa de
`?page=2&limit=20&search=camisa&sort=price&direction=desc`. Sem paginação o
endpoint devolve milhares de registros; sem filtros o frontend precisa baixar
tudo e filtrar no cliente. Este desafio junta as práticas de REST dos desafios
anteriores em uma API só.

O servidor em `src/index.ts` (rotas, validação do body e leitura da query
string) já está montado; seu trabalho é o `src/product.service.ts`.

## 📐 Requisitos

- [ ] Produtos ficam em memória
- [ ] `createProduct(data)` atribui `id` numérico único (incremental) e
      `createdAt`/`updatedAt` em ISO 8601 (iguais na criação)
- [ ] `findById(id)` retorna o produto ou `undefined`
- [ ] `listProducts(page, limit, filters, sort)` aplica, nesta ordem: filtros →
      ordenação → paginação
- [ ] Filtro `search`: busca sem diferenciar maiúsculas/minúsculas em `name`
      **ou** `description`
- [ ] Filtros `category` (igualdade), `minPrice`/`maxPrice` (inclusivos) e
      `active`
- [ ] Ordenação por qualquer campo do produto, `asc` ou `desc` (números em ordem
      numérica, textos com `localeCompare`); padrão `id` `asc`
- [ ] Paginação com `page` começando em 1; `pagination` traz `page`, `limit`,
      `total` (itens após os filtros) e `totalPages = Math.ceil(total / limit)`;
      página além do fim retorna `data: []`
- [ ] `updateProduct(id, data)` altera só os campos informados, **nunca** muda
      `id` nem `createdAt`, atualiza `updatedAt` e retorna o produto, ou `null`
      se não existir
- [ ] `deleteProduct(id)` retorna `true` se removeu e `false` se não existir
- [ ] `listCategories()` retorna as categorias sem repetição, em ordem
      alfabética
- [ ] Status HTTP corretos em `src/index.ts`: `201` na criação, `400` para dados
      inválidos, `404` para id inexistente
- [ ] `?limit` padrão `DEFAULT_PAGE_SIZE` e máximo `MAX_PAGE_SIZE` (`.env`)

## 🗂️ Estrutura dos Dados

```typescript
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}
```

### Endpoints do servidor (`src/index.ts`)

| Método   | Rota                       | Descrição                                                                                  |
| -------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| `GET`    | `/api/produtos`            | Lista (`page`, `limit`, `search`, `category`, `minPrice`, `maxPrice`, `sort`, `direction`) |
| `GET`    | `/api/produtos/categorias` | Categorias                                                                                 |
| `GET`    | `/api/produtos/:id`        | Busca por id                                                                               |
| `POST`   | `/api/produtos`            | Cria (`name` e `price` obrigatórios)                                                       |
| `PUT`    | `/api/produtos/:id`        | Atualiza                                                                                   |
| `DELETE` | `/api/produtos/:id`        | Remove                                                                                     |

## 💡 Exemplo de Uso

```typescript
import { createProduct, listProducts } from "./src/product.service.ts";

createProduct({
  name: "Camisa",
  price: 99.9,
  category: "roupas",
  stock: 10,
  active: true,
});

listProducts(1, 10, { search: "camisa", maxPrice: 100 }, {
  field: "price",
  direction: "desc",
});
// { data: [ { id: 1, name: "Camisa", ... } ],
//   pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } }
```

```bash
curl "http://localhost:3008/api/produtos?page=1&limit=10&search=camisa&sort=price&direction=desc"

curl -X POST http://localhost:3008/api/produtos \
  -H "Content-Type: application/json" \
  -d '{"name":"Camisa","price":99.90,"category":"roupas"}'
```

## ⚙️ Setup

```bash
cd 20-api-rest-completa
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Métodos HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods)
- [URLSearchParams](https://developer.mozilla.org/pt-BR/docs/Web/API/URLSearchParams)
- [Array.prototype.sort](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [String.prototype.localeCompare](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
- [Array.prototype.slice](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

## 📝 Notas

- Os campos seguem o modelo `Product` da mock API (`name`, `price`, `stock`).
- Extra: documentação OpenAPI/Swagger, links HATEOAS na paginação, versionamento
  (`/api/v1`), `PATCH` parcial.
