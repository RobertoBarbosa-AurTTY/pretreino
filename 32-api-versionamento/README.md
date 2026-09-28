# Desafio 32: Versionamento de API

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar versionamento de API por path (`/v1`, `/v2`) para manter
compatibilidade retroativa enquanto novas versões são lançadas, sinalizando
versões deprecadas por headers HTTP.

## 📋 Contexto Real

APIs precisam evoluir sem quebrar clientes:

- Clientes antigos continuam usando `/v1` enquanto novos usam `/v2`
- Versões antigas são deprecadas gradualmente (com aviso) antes de serem
  removidas
- Clientes precisam saber, pela própria resposta, que devem migrar

## 📐 Requisitos

Todas as funções ficam em `src/versioning.service.ts`.

**`createRouter(versions)`**

- [ ] `get(version, path, handler)` e `post(version, path, handler)` registram
      handlers por versão, método e path
- [ ] Registrar rota para uma versão que não está em `versions` lança erro
- [ ] `handle(req)` extrai a versão do início do path (`/v2/users` → versão
      `v2`, rota `/users`) e chama o handler correspondente
- [ ] Mesmo path com métodos diferentes (GET/POST) chama handlers diferentes
- [ ] Versão desconhecida ou rota inexistente → `404`
- [ ] Versão com `status: "obsoleta"` → `410 Gone` (o handler não é chamado)
- [ ] Respostas de versões `"deprecada"` passam por `addDeprecationHeaders`

**`versioningMiddleware(req)`**

- [ ] Retorna uma nova `Request` com o header `X-API-Version` preenchido
- [ ] Prioridade: versão no path (`/v2/...`) → header `Accept-Version` → padrão
      `v1`

**`addDeprecationHeaders(response, version)`**

- [ ] Para versão `"deprecada"`: adiciona `Deprecation: true` e, se houver
      `removalDate`, `Sunset` com a data em formato HTTP
      (`new Date(removalDate).toUTCString()`)
- [ ] Preserva status e corpo da resposta original
- [ ] Para versão `"ativa"`: não adiciona `Deprecation` nem `Sunset`

## 🗂️ Estrutura dos Dados

```typescript
export interface ApiVersion {
  version: string; // e.g. "v1"
  status: "ativa" | "deprecada" | "obsoleta";
  deprecationDate?: string;
  removalDate?: string;
}

export type Handler = (req: Request) => Response | Promise<Response>;

export interface Router {
  get(version: string, path: string, handler: Handler): void;
  post(version: string, path: string, handler: Handler): void;
  handle(req: Request): Promise<Response>;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  addDeprecationHeaders,
  createRouter,
  versioningMiddleware,
} from "./versioning.service.ts";

const router = createRouter([
  { version: "v1", status: "deprecada", removalDate: "2026-12-31" },
  { version: "v2", status: "ativa" },
]);

router.get("v1", "/users", () => Response.json([{ nome: "Ana" }]));
router.get("v2", "/users", () => Response.json({ data: [{ name: "Ana" }] }));

Deno.serve({ port: 3000 }, (req) => router.handle(req));

// GET /v1/users → 200 + headers Deprecation / Sunset
// GET /v2/users → 200
// GET /v9/users → 404
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Request (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [Response (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Response)
- [Headers (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
- [410 Gone (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410)
- [Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve)

## 📝 Notas

- Uma `Response` tem headers imutáveis em alguns casos: crie uma nova `Response`
  copiando corpo, status e headers
- Headers de referência: `Deprecation` (RFC 9745) e `Sunset` (RFC 8594)
- Extra: versionamento pelo header `Accept` (`application/vnd.api.v2+json`)
- Nunca remova uma versão abruptamente — sempre deprecie antes
