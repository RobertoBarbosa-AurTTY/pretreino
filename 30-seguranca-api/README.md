# Desafio 30: Segurança de API

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar medidas de segurança para proteger uma API contra ataques comuns:
validação e sanitização de entrada, CORS, rate limiting por IP, headers de
segurança e detecção de injeção/XSS.

## 📋 Contexto Real

APIs públicas estão expostas a diversas ameaças:

- Injeção (SQL, NoSQL, comando)
- XSS (Cross-Site Scripting)
- Requisições de origens não autorizadas (CORS)
- Abuso/DDoS por excesso de requisições
- Clickjacking e sniffing de conteúdo

## 📐 Requisitos

Arquivo: `src/security.service.ts`.

- [ ] `validateInput(input, schema)` usa `schema.safeParse` (formato do Zod); em
      sucesso retorna
      `{ valid: true, errors: [], sanitized: sanitizeData(data) }`
- [ ] Em falha retorna `{ valid: false, sanitized: null, errors }`, com um
      `ValidationError` por issue: `field` = `path` unido por `"."`, `message` e
      `code`
- [ ] `sanitizeData(data)` escapa `&`, `<`, `>`, `"` e `'` (`&amp;`, `&lt;`,
      `&gt;`, `&quot;`, `&#39;`) em **todas** as strings, recursivamente em
      objetos e arrays; outros tipos ficam iguais
- [ ] `configureCORS(config)` retorna uma função `(req) => Response | null`:
  - `OPTIONS` de origem permitida (ou `origins` contendo `"*"`) → `204` com
    `Access-Control-Allow-Origin` (a origem), `Access-Control-Allow-Methods` e
    `Access-Control-Allow-Headers` (listas unidas por `", "`) e
    `Access-Control-Allow-Credentials: true` quando `credentials`
  - `OPTIONS` de origem não permitida → `403`
  - Qualquer outro método → `null` (a requisição segue)
- [ ] `configureRateLimit(config)` retorna `(req) => boolean`: identifica o
      cliente pelo primeiro IP de `X-Forwarded-For` e permite no máximo
      `maxRequests` por `windowMs`; cada IP tem seu próprio limite e a contagem
      zera após a janela
- [ ] `configureSecurityHeaders()` retorna ao menos:
      `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
      `Strict-Transport-Security` (com `max-age=`), `Content-Security-Policy` e
      `Referrer-Policy`
- [ ] `detectAttacks(req)` analisa o path e os **nomes e valores**
      (decodificados) dos parâmetros da query string e retorna um
      `SecurityEvent` (`type`, `ip`, `endpoint` = pathname, `timestamp`,
      `details`) ou `null`
- [ ] Detecta `xss`: `<script`, `javascript:`, atributos `on...=` (ex.:
      `onerror=`)
- [ ] Detecta `injection`: SQL (`' OR '1'='1`, `UNION SELECT`, `; DROP`, `--`),
      NoSQL (operadores `$ne`, `$gt`, `$where`...) e comando (`; rm`, `&&`,
      `` ` ``, `$(`)
- [ ] Requisições legítimas (ex.: `?name=Maria%20Silva&page=2`) retornam `null`
- [ ] `src/index.ts`: usar `CORS_ORIGINS` (lista separada por vírgula),
      `RATE_LIMIT_MAX` e `RATE_LIMIT_WINDOW` do ambiente

## 🗂️ Estrutura dos Dados

```typescript
export interface SecurityConfig {
  cors: {
    origins: string[];
    methods: string[];
    headers: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    message: string;
  };
  helmet: {
    contentSecurityPolicy: boolean;
    crossOriginEmbedderPolicy: boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  sanitized: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface SecurityEvent {
  type: "injection" | "xss" | "rate_limit" | "unauthorized_access";
  ip: string;
  userId?: string;
  endpoint: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface InputSanitizer {
  sanitize(input: unknown): unknown;
  isSafe(input: string): boolean;
}

/** Compatible with Zod's `safeParse` */
export interface ValidationSchema {
  safeParse(input: unknown):
    | { success: true; data: unknown }
    | {
      success: false;
      error: {
        issues: { path: PropertyKey[]; message: string; code: string }[];
      };
    };
}
```

## 💡 Exemplo de Uso

```typescript
import {
  configureCORS,
  configureRateLimit,
  configureSecurityHeaders,
  detectAttacks,
  validateInput,
} from "./src/security.service.ts";
import { z } from "npm:zod@^3";

const cors = configureCORS({
  origins: ["https://app.exemplo.com"],
  methods: ["GET", "POST"],
  headers: ["Content-Type", "Authorization"],
  credentials: true,
});
const allow = configureRateLimit({
  windowMs: 60_000,
  maxRequests: 100,
  message: "Too many requests",
});
const securityHeaders = configureSecurityHeaders();

const contactSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

Deno.serve(async (req) => {
  const preflight = cors(req);
  if (preflight) return preflight;
  if (!allow(req)) return new Response("Too many requests", { status: 429 });

  const attack = detectAttacks(req);
  if (attack) {
    return Response.json({ error: "Input inválido" }, { status: 400 });
  }

  const result = validateInput(await req.json(), contactSchema);
  if (!result.valid) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }

  return Response.json(result.sanitized, { headers: securityHeaders });
});
```

## ⚙️ Setup

```bash
cd 30-seguranca-api
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [CORS — MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)
- [Content-Security-Policy — MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/Content-Security-Policy)
- [URLSearchParams — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/URLSearchParams)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## 📝 Notas

- Detecção por padrões (regex) é uma camada extra, **não** substitui queries
  parametrizadas nem validação por schema.
- Nunca confie em dados do cliente, mesmo vindos de sistemas internos.
- Em produção, `X-Forwarded-For` só é confiável atrás de um proxy que você
  controla.
- `SecurityConfig.helmet` pode ligar/desligar headers específicos (extra).
