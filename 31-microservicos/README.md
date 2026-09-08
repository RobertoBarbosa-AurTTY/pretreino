# Desafio 31: Arquitetura de Microserviços

## 🎯 Objetivo

Projetar e implementar uma arquitetura de microserviços com comunicação síncrona e assíncrona.

## 📋 Contexto Real

Sistemas complexos se beneficiam de microserviços:
- Escala independente por serviço
- Deploy e desenvolvimento independentes
- Isolamento de falhas
- Flexibilidade tecnológica

## 📐 Requisitos

- [ ] Decompor domínio em microserviços
- [ ] Implementar comunicação HTTP/gRPC
- [ ] Criar eventos para comunicação assíncrona
- [ ] Implementar service discovery
- [ ] Criar API Gateway
- [ ] Implementar circuit breaker entre serviços

## 🗂️ Estrutura dos Dados

```typescript
interface MicroserviceConfig {
  nome: string;
  versao: string;
  porta: number;
  dependencias: string[];
  healthCheck: string;
}

interface ServiceEndpoint {
  servico: string;
  metodo: string;
  path: string;
  timeout: number;
  retries: number;
}

interface Event {
  id: string;
  tipo: string;
  origem: string;
  dados: unknown;
  timestamp: string;
  versao: string;
}

interface ServiceDiscovery {
  registrar(config: MicroserviceConfig): Promise<void>;
  discovering(servico: string): Promise<ServiceInstance>;
  listar(): Promise<ServiceInstance[]>;
}

interface ServiceInstance {
  nome: string;
  host: string;
  porta: number;
  status: "healthy" | "unhealthy";
  metadata: Record<string, unknown>;
}

interface ApiGateway {
  roteamento: Route[];
  middleware: Middleware[];
  rateLimit: RateLimitConfig;
}

interface CircuitBreaker {
  estado: "fechado" | "aberto" | "meio_aberto";
  falhasConsecutivas: number;
  ultimaFalha?: string;
  proximaTentativa?: string;
}
```

## 💡 Exemplo de Uso

```typescript
// Definir microserviços
const servicos: MicroserviceConfig[] = [
  { nome: "usuarios", versao: "1.0.0", porta: 3001, dependencias: [], healthCheck: "/health" },
  { nome: "pedidos", versao: "1.0.0", porta: 3002, dependencias: ["usuarios"], healthCheck: "/health" },
  { nome: "pagamentos", versao: "1.0.0", porta: 3003, dependencias: ["pedidos"], healthCheck: "/health" }
];

// Service Discovery
const discovery = new ServiceDiscovery();
await discovery.registrar(servicos[0]);
const instancia = await discovery.discovering("usuarios");

// Comunicação síncrona
const response = await httpClient.get(`http://${instancia.host}:${instancia.porta}/usuarios/123`);

// Comunicação assíncrona
await eventBus.publish({
  id: crypto.randomUUID(),
  tipo: "pedido.criado",
  origem: "pedidos",
  dados: { pedidoId: "123", userId: "456" },
  timestamp: new Date().toISOString(),
  versao: "1.0.0"
});

// API Gateway
const gateway = new ApiGateway({
  roteamento: [
    { path: "/api/usuarios/**", servico: "usuarios" },
    { path: "/api/pedidos/**", servico: "pedidos" }
  ]
});
```

## ⚙️ Setup

```bash
deno task dev
```

## 🧪 Testes

```bash
deno task test
```

## 📝 Notas

- Implemente distributed tracing
- Use saga pattern para transações distribuídas
- Implemente eventual consistency
- Considere CQRS para leituras
- Implemente health checks em todos os serviços

---

**Dica:** Comece com um monolito bem estruturado e extraia microserviços apenas quando necessário - não premature.