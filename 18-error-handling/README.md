# Desafio 18: Error Handling

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar um sistema centralizado de tratamento de erros: hierarquia de
classes de erro, códigos padronizados, mapeamento para status HTTP, respostas
JSON consistentes e logging.

## 📋 Contexto Real

Sem um padrão, cada rota devolve erro de um jeito (`{ msg }`, `{ erro }`, texto
puro, stack trace…), o frontend não consegue tratar e detalhes internos vazam
para o cliente. Com erros tipados e um único `handleError`, basta lançar
`throw new NotFoundError("User", id)` em qualquer lugar e a resposta sai sempre
no mesmo formato.

As classes específicas e o servidor em `src/index.ts` já estão montados; você
implementa `getStatusCode`, `AppError.toJSON`, `handleError` e `logError` em
`src/errors.ts`.

## 📐 Requisitos

- [ ] `getStatusCode(code)` mapeia: `VALIDATION_ERROR`/`BAD_REQUEST` → 400,
      `UNAUTHORIZED` → 401, `FORBIDDEN` → 403, `NOT_FOUND` → 404, `CONFLICT` →
      409, `RATE_LIMITED` → 429, `INTERNAL_ERROR` → 500
- [ ] Toda instância de `AppError` (e subclasses) tem `statusCode` coerente com
      o `code`; sem `code`, usa `INTERNAL_ERROR`
- [ ] `toJSON()` retorna `{ error: true, code, message, details?, timestamp }`;
      inclui `stack` **somente** se `SHOW_STACK_TRACES=true`
- [ ] `handleError(error)` retorna uma `Response` com
      `Content-Type: application/json`:
  - `AppError` → status `error.statusCode`, corpo `error.toJSON()`
  - `SyntaxError` (JSON inválido no body) → 400 com `code: "BAD_REQUEST"`
  - qualquer outro valor (Error, string…) → 500 com `code: "INTERNAL_ERROR"` e
    `message: "Internal server error"`, **sem** expor a mensagem original
- [ ] `handleError` registra o erro com `logError`
- [ ] `logError(error, context?)` escreve uma linha com `console.error` contendo
      `code`, `message`, `context` e horário; não escreve nada quando
      `LOG_ERRORS=false` (lido a cada chamada)
- [ ] As rotas de `src/index.ts` respondem: `/api/usuarios/abc` → 400,
      `/api/usuarios/999` → 404, email duplicado → 409, `/api/protected` sem
      token → 401, `/api/error` → 500

## 🗂️ Estrutura dos Dados

```typescript
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  CONFLICT = "CONFLICT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  RATE_LIMITED = "RATE_LIMITED",
  BAD_REQUEST = "BAD_REQUEST",
}

export interface ErrorResponseBody {
  error: true;
  code: ErrorCode;
  message: string;
  details?: unknown;
  timestamp: string;
  stack?: string;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly timestamp: string;
}

// Subclasses: ValidationError, NotFoundError, UnauthorizedError,
// ForbiddenError, ConflictError
```

## 💡 Exemplo de Uso

```typescript
import { handleError, NotFoundError, ValidationError } from "./src/errors.ts";

try {
  throw new NotFoundError("User", 999);
} catch (error) {
  const response = handleError(error);
  // 404 { "error": true, "code": "NOT_FOUND",
  //       "message": "User with ID 999 not found", "timestamp": "..." }
}

new ValidationError("Name and email are required", {
  fields: ["name", "email"],
}).statusCode; // 400
```

```bash
curl -i http://localhost:3006/api/usuarios/abc   # 400
curl -i http://localhost:3006/api/usuarios/999   # 404
curl -i http://localhost:3006/api/protected      # 401
curl -i http://localhost:3006/api/error          # 500
```

## ⚙️ Setup

```bash
cd 18-error-handling
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Error e classes de erro customizadas](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Error#tipos_de_erro_personalizados)
- [instanceof](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/instanceof)
- [Códigos de status HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)
- [JSON.stringify e toJSON](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#comportamento_de_tojson)
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)

## 📝 Notas

- O formato `{ error: true, message, details? }` é o mesmo da mock API usada em
  outros desafios (veja [`../API.md`](../API.md)).
- Extra: `RateLimitError`, id de correlação por requisição, integração com um
  serviço de error reporting.
