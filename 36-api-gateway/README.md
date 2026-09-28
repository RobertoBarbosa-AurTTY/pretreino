# Desafio 36: API Gateway

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um API Gateway: ponto de entrada único que roteia requisições por
prefixo de path para serviços internos (proxy reverso), com autenticação por API
key e rate limiting centralizados.

## 📋 Contexto Real

Microserviços precisam de um ponto único de entrada:

- Roteamento para múltiplos serviços (`/api/users` → serviço de usuários)
- Autenticação centralizada (os serviços internos não repetem essa lógica)
- Rate limiting global por cliente
- Tratamento uniforme de falhas dos serviços

## 📐 Requisitos

Tudo fica em `src/gateway.service.ts`.

**`createGateway(config)` → `handle(req)`**

- [ ] Encontra a rota cujo `path` é prefixo do path da requisição: casa se o
      path é igual ao prefixo ou começa com `prefixo + "/"` (`/api/users` casa
      `/api/users/42`, mas **não** `/api/usersx`)
- [ ] Se mais de uma rota casar, usa a de prefixo mais longo
- [ ] Sem rota correspondente → `404` (nenhuma chamada ao upstream)
- [ ] Encaminha a requisição com `proxyRequest` e devolve a resposta do serviço
- [ ] Se o upstream falhar (erro de rede no `fetch`) → `502 Bad Gateway`
- [ ] `addRoute(route)` e `removeRoute(path)` alteram as rotas em tempo de
      execução
- [ ] Se `config.apiKey` estiver definido, requisições sem header `X-API-Key`
      igual → `401` (sem chamar o upstream)
- [ ] Se `config.rateLimit` estiver definido, cada cliente (header
      `X-Forwarded-For`, ou `"anonymous"`) pode fazer no máximo `maxRequests`
      por janela de `windowMs` ms; excedente → `429`. Clientes diferentes têm
      contadores independentes

**`proxyRequest(req, route)`**

- [ ] URL de destino = `route.service` + path + query string da requisição
      original
- [ ] Com `stripPrefix: true`, remove `route.path` do início do path
      (`/api/orders/7` → `/7`; se sobrar vazio, usa `/`)
- [ ] Preserva método, headers e corpo da requisição original

## 🗂️ Estrutura dos Dados

```typescript
export interface Route {
  path: string; // path prefix, e.g. "/api/users"
  service: string; // upstream base URL, e.g. "http://localhost:3001"
  stripPrefix?: boolean;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface GatewayConfig {
  routes: Route[];
  port?: number;
  apiKey?: string; // when set, requests must send header X-API-Key
  rateLimit?: RateLimitConfig; // per client (header X-Forwarded-For)
}

export interface Gateway {
  addRoute(route: Route): void;
  removeRoute(path: string): void;
  handle(req: Request): Promise<Response>;
}
```

## 💡 Exemplo de Uso

```typescript
import { createGateway } from "./gateway.service.ts";

const gateway = createGateway({
  routes: [
    { path: "/api/users", service: "http://localhost:3001" },
    {
      path: "/api/orders",
      service: "http://localhost:3002",
      stripPrefix: true,
    },
  ],
  apiKey: "minha-chave",
  rateLimit: { windowMs: 60_000, maxRequests: 100 },
});

Deno.serve({ port: 3000 }, (req) => gateway.handle(req));

// GET http://localhost:3000/api/orders/7  (X-API-Key: minha-chave)
//   → GET http://localhost:3002/7
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Fetch API (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [URL (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/URL)
- [Request (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [502 Bad Gateway (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502)
- [Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve)

## 📝 Notas

- A ordem das checagens sugerida é: autenticação → rate limit → roteamento →
  proxy
- Para testar manualmente, suba dois servidores simples nas portas 3001 e 3002
- Extras: load balancing entre várias instâncias de um serviço (veja os Desafios
  37 e 50), cache no gateway, health checks dos serviços
- Mantenha o gateway leve — lógica de negócio fica nos serviços
