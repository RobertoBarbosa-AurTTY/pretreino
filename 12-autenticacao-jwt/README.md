# Desafio 12: Autenticação JWT

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar o serviço de autenticação de uma API com JWT: login, validação de
token em rotas protegidas, refresh token, logout e checagem de papel (admin).

## 📋 Contexto Real

APIs stateless usam JWT para identificar o usuário sem consultar o banco a cada
requisição. Na prática também é preciso renovar o acesso sem pedir a senha de
novo (refresh token) e conseguir "derrubar" um token antes de ele expirar
(logout / blacklist).

O arquivo `src/jwt.utils.ts` **já vem pronto**: `createToken`, `verifyToken`
(HMAC-SHA256 via Web Crypto) e `generateRefreshToken`. O servidor HTTP em
`src/index.ts` também já está montado. Seu trabalho é o `src/auth.service.ts`.

## 📐 Requisitos

- [ ] `findByEmail(email)` / `findById(id)` retornam o usuário da lista em
      memória ou `undefined`
- [ ] `login(email, password)` com credenciais corretas retorna
      `{ success: true, token, refreshToken }`; o `token` é um JWT (3 partes
      separadas por `.`) com `userId`, `email` e `role`
- [ ] `login` com email desconhecido ou senha errada retorna
      `{ success: false, error }` sem `token`
- [ ] O token expira após `TOKEN_EXPIRY_MINUTES` minutos (padrão 60) e é
      assinado com `JWT_SECRET`
- [ ] `validateToken(token)` retorna o `TokenPayload` para token válido e `null`
      para token malformado, com assinatura adulterada, expirado ou invalidado
      por logout
- [ ] `refresh(refreshToken)` com refresh token válido retorna um novo `token` e
      um **novo** `refreshToken`; o refresh token usado deixa de valer
- [ ] `refresh` com refresh token desconhecido retorna
      `{ success: false, error }`
- [ ] `logout(token)` invalida o token (depois disso `validateToken` retorna
      `null`) e retorna `true`
- [ ] `isAdmin(payload)` retorna `true` somente se `role === "admin"`
- [ ] A senha nunca aparece nas respostas da API

## 🗂️ Estrutura dos Dados

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  error?: string;
}
```

Os usuários de exemplo estão em `src/auth.service.ts` (e espelhados em
`data/usuarios.json`):

| email             | password | role  |
| ----------------- | -------- | ----- |
| `joao@email.com`  | `123456` | admin |
| `maria@email.com` | `abcdef` | user  |

### Endpoints do servidor (`src/index.ts`)

| Método   | Rota                   | Descrição                     |
| -------- | ---------------------- | ----------------------------- |
| `POST`   | `/api/login`           | `{ email, password }` → JWT   |
| `POST`   | `/api/refresh`         | `{ refreshToken }` → novo JWT |
| `POST`   | `/api/logout`          | Invalida o token do header    |
| `GET`    | `/api/profile`         | Dados do token (protegida)    |
| `GET`    | `/api/documents`       | Dados protegidos              |
| `DELETE` | `/api/admin/users/:id` | Somente admin                 |
| `GET`    | `/health`              | Health check                  |

## 💡 Exemplo de Uso

```typescript
import { isAdmin, login, logout, validateToken } from "./src/auth.service.ts";

const { token } = await login("joao@email.com", "123456");
const payload = await validateToken(token!);
// { userId: "1", email: "joao@email.com", role: "admin", iat, exp }
isAdmin(payload!); // true

logout(token!);
await validateToken(token!); // null
```

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'

curl http://localhost:3000/api/profile -H "Authorization: Bearer <token>"
```

## ⚙️ Setup

```bash
cd 12-autenticacao-jwt
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [JWT: introdução (jwt.io)](https://jwt.io/introduction)
- [SubtleCrypto.sign (HMAC)](https://developer.mozilla.org/pt-BR/docs/Web/API/SubtleCrypto/sign)
- [Header Authorization](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/Authorization)
- [Set e Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve)

## 📝 Notas

- Use as funções de `src/jwt.utils.ts`; não é preciso reimplementar o JWT.
- Senhas em texto puro só porque é um estudo; em produção use hash (bcrypt,
  argon2).
- Extra: rate limiting no login e log de auditoria.
