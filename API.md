# Mock API

API usada pelos desafios que fazem requisições HTTP (`fetch`).

- **Base URL:** `https://api-mock-98te.onrender.com`
- **Documentação interativa:**
  [`/docs`](https://api-mock-98te.onrender.com/docs)
- **OpenAPI:**
  [`/openapi.json`](https://api-mock-98te.onrender.com/openapi.json)

> ⏳ A API roda no plano gratuito do Render: depois de um tempo parada ela
> "dorme", e a **primeira requisição pode levar 30–60 s**. Faça um `GET /health`
> antes de começar, ou use um timeout generoso na primeira chamada.

## Autenticação

Todas as rotas exigem `Authorization: Bearer <token>`, **exceto**
`POST /api/auth/login` e `GET /health`.

```bash
curl -X POST https://api-mock-98te.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

```json
{
  "token": "07ac07...",
  "tokenType": "Bearer",
  "expiresAt": "2026-09-29T18:57:03.987Z",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "Desenvolvedor"
  }
}
```

Credenciais de teste: `joao@email.com` / `123456` (variáveis `API_EMAIL` e
`API_PASSWORD` nos `.env.example`).

Sem token (ou com token inválido) a API responde
`401 { "error": true, "message": "Unauthorized" }`.

## Endpoints

| Método                 | Rota                               | Descrição                                                                |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `GET`                  | `/health`                          | Health check (sem auth)                                                  |
| `POST`                 | `/api/auth/login`                  | Login → token (sem auth)                                                 |
| `GET`                  | `/api/auth/me`                     | Usuário do token                                                         |
| `POST`                 | `/api/auth/logout`                 | Invalida o token                                                         |
| `GET`                  | `/api/clientes?status=ativo`       | Lista clientes (filtro opcional por `status`)                            |
| `GET/PUT/PATCH/DELETE` | `/api/clientes/:id`                | CRUD de cliente                                                          |
| `POST`                 | `/api/clientes`                    | Cria cliente                                                             |
| `GET/POST`             | `/api/usuarios`                    | Lista / cria usuários                                                    |
| `GET/PUT/PATCH/DELETE` | `/api/usuarios/:id`                | CRUD de usuário                                                          |
| `GET/POST`             | `/api/produtos`                    | Lista / cria produtos                                                    |
| `GET/PUT/PATCH/DELETE` | `/api/produtos/:id`                | CRUD de produto                                                          |
| `GET`                  | `/api/metricas?name=response_time` | Lista métricas                                                           |
| `POST`                 | `/api/metricas`                    | Registra métrica                                                         |
| `POST`                 | `/api/emails`                      | Simula envio de email (`?fail=true` força falha, útil para testar retry) |
| `POST`                 | `/api/webhooks`                    | Recebe webhook de pagamento (header `X-Webhook-Signature`)               |

## Modelos

```typescript
interface Client {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "inativo" | "pendente";
  registrationDate: string; // "2024-01-15"
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Metric {
  name: string;
  value: number;
  timestamp: string; // ISO 8601
  tags?: Record<string, string>;
}

interface EmailInput {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}
// → { success: true, emailId: "email_1" }

interface PaymentWebhook {
  event: "pagamento.pago" | "pagamento.falhou" | "pagamento.reembolsado";
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    method: string;
    date: string; // ISO 8601
  };
}
// → 201 { success: true, message: "Webhook received", paymentId: "pag_123456" }
```

Erros seguem o formato
`{ "error": true, "message": string, "details"?: unknown }`. Algumas rotas podem
devolver `500` simulado, o que é útil para praticar retry.
