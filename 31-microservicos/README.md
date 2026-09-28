# Desafio 31: Arquitetura de Microserviços

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Construir, em memória e com HTTP nativo do Deno, as peças básicas de uma
arquitetura de microserviços: serviço com health check, service discovery,
roteamento de API Gateway, circuit breaker entre serviços e comunicação
assíncrona por eventos.

## 📋 Contexto Real

Sistemas complexos se beneficiam de microserviços:

- Escala independente por serviço
- Deploy e desenvolvimento independentes
- Isolamento de falhas (um serviço fora do ar não derruba os outros)
- Comunicação síncrona (HTTP) e assíncrona (eventos)

## 📐 Requisitos

Todas as funções ficam em `src/microservice.service.ts`.

**`createMicroservice(config)`**

- [ ] `start()` sobe um servidor HTTP (`Deno.serve`) na porta `config.port`
- [ ] `GET config.healthCheck` responde `200`; outras rotas respondem `404`
- [ ] `healthCheck()` retorna `true` enquanto o serviço está rodando e `false`
      depois de `stop()`
- [ ] `stop()` encerra o servidor (sem deixar recursos abertos)

**`configureServiceDiscovery(url)`** (registro em memória)

- [ ] `register(config)` cria uma `ServiceInstance` com `name`,
      `host: "localhost"`, `port`, `status: "healthy"` e `metadata` contendo
      `version` e `dependencies`
- [ ] Registrar de novo um serviço com o mesmo `name` substitui o registro
      anterior
- [ ] `discover(name)` retorna a instância registrada; se não existir, lança
      erro
- [ ] `list()` retorna todas as instâncias registradas

**`createApiGateway({ port, routes })`**

- [ ] `routing` contém as rotas recebidas; `middleware` começa vazio;
      `rateLimit` tem um valor padrão (ex.:
      `{ windowMs: 60000, maxRequests: 100 }`)
- [ ] `resolveRoute(path)`: um padrão terminado em `/**` casa com o prefixo e
      qualquer subcaminho (`/api/usuarios/**` casa `/api/usuarios` e
      `/api/usuarios/123`)
- [ ] Padrões sem `/**` só casam com o caminho exato; sem correspondência
      retorna `null`

**`configureCircuitBreaker(service, options?)`**

- [ ] Padrões: `failureThreshold = 5`, `resetTimeout = 30000` ms; começa com
      `status: "fechado"`
- [ ] Cada falha incrementa `consecutiveFailures`; um sucesso zera o contador
- [ ] Ao atingir `failureThreshold` falhas consecutivas, `status` vira
      `"aberto"` e `execute()` rejeita **sem chamar** a função
- [ ] Após `resetTimeout` ms, a próxima chamada é permitida (`"meio_aberto"`);
      se tiver sucesso volta para `"fechado"`, se falhar volta para `"aberto"`

**`publishEvent(event)` / `subscribeEvent(type, handler)`**

- [ ] `publishEvent` gera `id` (UUID) e `timestamp` (ISO 8601) e entrega o
      evento a todos os inscritos no `type`, aguardando os handlers
- [ ] Inscritos em outros tipos não recebem o evento
- [ ] `subscribeEvent` retorna uma função que cancela a inscrição
- [ ] Um handler que lança erro não impede a entrega aos demais

## 🗂️ Estrutura dos Dados

```typescript
export interface MicroserviceConfig {
  name: string;
  version: string;
  port: number;
  dependencies: string[];
  healthCheck: string;
}

export interface ServiceEndpoint {
  service: string;
  method: string;
  path: string;
  timeout: number;
  retries: number;
}

export interface Event {
  id: string;
  type: string;
  source: string;
  data: unknown;
  timestamp: string;
  version: string;
}

export interface ServiceDiscovery {
  register(config: MicroserviceConfig): Promise<void>;
  discover(service: string): Promise<ServiceInstance>;
  list(): Promise<ServiceInstance[]>;
}

export interface ServiceInstance {
  name: string;
  host: string;
  port: number;
  status: "healthy" | "unhealthy";
  metadata: Record<string, unknown>;
}

export interface ApiGateway {
  routing: Route[];
  middleware: Middleware[];
  rateLimit: RateLimitConfig;
  resolveRoute(path: string): Route | null;
}

export interface CircuitBreaker {
  status: "fechado" | "aberto" | "meio_aberto";
  consecutiveFailures: number;
  lastFailure?: string;
  nextAttempt?: string;
  execute<T>(fn: () => Promise<T>): Promise<T>;
}

export interface Route {
  path: string;
  service: string;
  method?: string;
}

export interface Middleware {
  name: string;
  handler: (req: Request) => Promise<Request | Response>;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface Microservice {
  start(): Promise<void>;
  stop(): Promise<void>;
  healthCheck(): Promise<boolean>;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  configureCircuitBreaker,
  configureServiceDiscovery,
  createApiGateway,
  createMicroservice,
  publishEvent,
  subscribeEvent,
} from "./microservice.service.ts";

const usersConfig = {
  name: "usuarios",
  version: "1.0.0",
  port: 3001,
  dependencies: [],
  healthCheck: "/health",
};

const users = createMicroservice(usersConfig);
await users.start();

const discovery = configureServiceDiscovery("http://localhost:8500");
await discovery.register(usersConfig);
const instance = await discovery.discover("usuarios");

const breaker = configureCircuitBreaker("usuarios", { failureThreshold: 3 });
const res = await breaker.execute(() =>
  fetch(`http://${instance.host}:${instance.port}/health`)
);

const gateway = createApiGateway({
  port: 3000,
  routes: [{ path: "/api/usuarios/**", service: "usuarios" }],
});
gateway.resolveRoute("/api/usuarios/123"); // { path: "/api/usuarios/**", service: "usuarios" }

subscribeEvent("pedido.criado", async (event) => console.log(event.data));
await publishEvent({
  type: "pedido.criado",
  source: "pedidos",
  data: { orderId: "123" },
  version: "1.0.0",
});
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Deno.serve (servidor HTTP)](https://docs.deno.com/api/deno/~/Deno.serve)
- [Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- [Circuit Breaker (Martin Fowler)](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Microservices (Martin Fowler)](https://martinfowler.com/articles/microservices.html)

## 📝 Notas

- Tudo roda em memória: `DISCOVERY_URL` e `EVENT_BUS_URL` são apenas
  informativos
- Extras opcionais: distributed tracing, saga pattern para transações
  distribuídas, health checks periódicos que marcam instâncias como `unhealthy`
- Comece com um monolito bem estruturado e extraia microserviços apenas quando
  necessário
