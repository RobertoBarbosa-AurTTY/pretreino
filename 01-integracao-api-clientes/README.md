# Desafio 01: Integração API de Clientes

**Dificuldade:** ⭐

## 🎯 Objetivo

Criar um serviço que autentica na API mock, busca a lista de clientes, filtra os
ativos e salva o resultado em um arquivo JSON.

## 📋 Contexto Real

Você recebeu uma tarefa do time de negócios:

- Buscar a lista de clientes em uma API externa (que exige autenticação)
- Filtrar apenas os clientes ativos
- Salvar em arquivo JSON para processamento posterior

## 📐 Requisitos

Arquivo: `src/client.service.ts`

- [ ] `login(config)` faz `POST {url}/api/auth/login` com `{ email, password }`
      em JSON e retorna o campo `token` da resposta
- [ ] `login` lança erro se a resposta não for 2xx (ex.: `401`)
- [ ] `fetchClients(config, token)` faz `GET {url}/api/clientes` enviando o
      header `Authorization: Bearer <token>`
- [ ] Em erro HTTP (status não 2xx) ou erro de rede, tenta novamente até
      `config.retries` vezes no total (padrão: 3); se todas falharem, lança erro
- [ ] Cada tentativa é abortada após `config.timeout` ms (padrão: 5000) e conta
      como falha
- [ ] Se a resposta não for um array, lança erro (validação da resposta)
- [ ] `filterActive(clients)` retorna só os clientes com `status === "ativo"`,
      sem alterar o array original
- [ ] `saveToFile(data, fileName)` grava o JSON formatado (indentação de 2
      espaços) e cria a pasta de destino se ela não existir
- [ ] `src/index.ts`: pipeline login → buscar → filtrar → salvar em
      `OUTPUT_DIR/OUTPUT_FILE`

## 🗂️ Estrutura dos Dados

```typescript
export interface Client {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "inativo" | "pendente";
  registrationDate: string;
}

export interface APIConfig {
  url: string;
  email: string;
  password: string;
  timeout?: number;
  retries?: number;
}
```

Um exemplo de resposta da API está em `data/clientes.json`.

## 🔌 API

| Método | Rota              | Uso                |
| ------ | ----------------- | ------------------ |
| `POST` | `/api/auth/login` | Obter o token      |
| `GET`  | `/api/clientes`   | Listar os clientes |

Todas as rotas (exceto login) exigem `Authorization: Bearer <token>`. Sem token
a API responde `401`. Detalhes em [`../API.md`](../API.md).

## 💡 Exemplo de Uso

```typescript
import {
  fetchClients,
  filterActive,
  login,
  saveToFile,
} from "./client.service.ts";

const config = {
  url: "https://api-mock-98te.onrender.com",
  email: "joao@email.com",
  password: "123456",
  timeout: 5000,
  retries: 3,
};

const token = await login(config);
const clients = await fetchClients(config, token);
const activeClients = filterActive(clients);
await saveToFile(activeClients, "./output/clientes-ativos.json");
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Fetch API (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [`AbortSignal.timeout()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
- [`Response.ok` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
- [Ler e escrever arquivos no Deno](https://docs.deno.com/examples/writing_files/)
- [`try...catch` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/try...catch)

## 📝 Notas

- A API roda em plano gratuito: a primeira requisição pode levar 30–60 s. Use um
  timeout generoso no `.env` na primeira execução.
- Um `fetch` só rejeita em erro de rede; status `4xx/5xx` precisam ser
  verificados com `response.ok`.
- Faça log de cada tentativa com falha para facilitar o debugging.

---

**Dica:** Sempre trate erros em chamadas de API. Uma requisição pode falhar por
timeout, rede ou erro do servidor.
