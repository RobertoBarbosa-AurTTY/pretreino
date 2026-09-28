# Desafio 03: Notificação por Email

**Dificuldade:** ⭐

## 🎯 Objetivo

Criar um serviço de envio de emails com fila, retry com backoff exponencial e
templates HTML, usando a API mock para simular o envio.

## 📋 Contexto Real

O sistema precisa enviar emails transacionais:

- Confirmação de cadastro
- Notificação de pedido
- Confirmação de pagamento

O provedor de email às vezes falha, então cada envio precisa de retry.

## 📐 Requisitos

Arquivo: `src/email.service.ts`

- [ ] `login(apiUrl, email, password)` faz `POST /api/auth/login` e retorna o
      `token`
- [ ] `renderTemplate(template, data, templatesDir)` lê
      `{templatesDir}/{template}.html` e substitui **todas** as ocorrências de
      `{{chave}}` por `data[chave]`
- [ ] `sendEmailViaAPI(email, apiUrl, token, timeoutMs?)` faz `POST /api/emails`
      com `{ to, subject, template, data }` e o header
      `Authorization: Bearer <token>`
- [ ] Em resposta 2xx, retorna `{ success: true, emailId }` com o `emailId` da
      API; em erro HTTP, erro de rede ou timeout, retorna
      `{ success: false, emailId: "", error }` **sem lançar exceção**
- [ ] `enqueueEmail(email, queue)` adiciona o email na fila com status
      `"pendente"`; lança erro se o `to` for um email inválido ou se já existir
      um email com o mesmo `id` na fila
- [ ] `processQueue(queue, config, apiUrl, token)` processa só os emails
      `"pendente"` e tenta cada um até `maxAttempts` vezes
- [ ] Entre tentativas espera `retryDelay × 2^(n-1)` ms (ex.: 1s, 2s, 4s)
- [ ] Atualiza `attempts` (total de tentativas feitas) e `status` para
      `"enviado"` ou `"falha"` em cada email
- [ ] Retorna um `SendResult` por email processado, com `emailId` igual ao `id`
      local do email
- [ ] Cada envio é abortado após `config.sendTimeout` ms
- [ ] `loadPendingEmails(filePath)` lê o JSON e retorna só os emails
      `"pendente"`
- [ ] `src/index.ts`: login → carregar → renderizar (log de preview) → processar
      → resumo (enviados / falhas)

## 🗂️ Estrutura dos Dados

```typescript
export interface Email {
  id: string;
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
  status: "pendente" | "enviado" | "falha";
  attempts: number;
}

export interface QueueConfig {
  maxAttempts: number;
  retryDelay: number;
  sendTimeout: number;
}

export interface SendResult {
  success: boolean;
  emailId: string;
  error?: string;
}
```

Dados de exemplo em `data/emails-pendentes.json` e templates em
`src/templates/`.

## 🔌 API

| Método | Rota                    | Uso                                    |
| ------ | ----------------------- | -------------------------------------- |
| `POST` | `/api/auth/login`       | Obter o token                          |
| `POST` | `/api/emails`           | Simular envio → `{ success, emailId }` |
| `POST` | `/api/emails?fail=true` | Força `500` (útil para testar retry)   |

Todas as rotas (exceto login) exigem `Authorization: Bearer <token>`. Detalhes
em [`../API.md`](../API.md).

## 💡 Exemplo de Uso

```typescript
import {
  enqueueEmail,
  login,
  processQueue,
  renderTemplate,
} from "./email.service.ts";
import type { Email } from "./email.service.ts";

const apiUrl = "https://api-mock-98te.onrender.com";
const token = await login(apiUrl, "joao@email.com", "123456");

const queue: Email[] = [];
await enqueueEmail({
  id: "123",
  to: "cliente@email.com",
  subject: "Confirmação de Pedido",
  template: "confirmacao",
  data: { nome: "João", pedido: "456", valor: "R$ 99,90" },
  status: "pendente",
  attempts: 0,
}, queue);

console.log(
  await renderTemplate("confirmacao", queue[0]!.data, "./src/templates"),
);

const results = await processQueue(
  queue,
  { maxAttempts: 3, retryDelay: 1000, sendTimeout: 30000 },
  apiUrl,
  token,
);
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Fetch API (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [`setTimeout()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout)
- [`AbortSignal.timeout()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
- [`String.prototype.replaceAll()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll)
- [Exponential backoff (Wikipedia)](https://en.wikipedia.org/wiki/Exponential_backoff)

## 📝 Notas

- Um `sleep` pode ser feito com
  `new Promise((resolve) => setTimeout(resolve, ms))`.
- Use `?fail=true` na URL de envio para ver o retry funcionando de verdade.
- Faça log de cada tentativa e das falhas definitivas (quem deveria ser
  avisado?).
- Valide o email antes de enfileirar: falhar cedo é mais barato.

---

**Dica:** Backoff exponencial: 1s, 2s, 4s, 8s... entre cada tentativa.
