# Desafio 36: API Gateway

## 🎯 Objetivo

Implementar API Gateway para roteamento, autenticação e rate limiting centralizado.

## 📋 Contexto Real

Microserviços precisam de ponto único:
- Roteamento para múltiplos serviços
- Autenticação centralizada
- Rate limiting global
- Load balancing

## 📐 Requisitos

- [ ] Criar roteamento baseado em path
- [ ] Implementar proxy reverso
- [ ] Adicionar autenticação
- [ ] Configurar rate limiting
- [ ] Implementar load balancing

## 🗂️ Estrutura dos Dados

```typescript
interface Route {
  path: string;
  service: string;
  stripPrefix?: boolean;
}

interface GatewayConfig {
  routes: Route[];
  auth?: AuthConfig;
  rateLimit?: RateLimitConfig;
}

interface ProxyRequest {
  originalReq: Request;
  targetService: string;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Gateway é o ponto de entrada único
- Considere caching no gateway
- Implemente health checks dos serviços

---

**Dica:** Mantenha o gateway leve - lógica complexa deve ficar nos serviços.