# Desafio 15: Rate Limiting

## 🎯 Objetivo

Implementar sistema de rate limiting para proteger APIs contra abuso.

## 📋 Requisitos

- [ ] Rate limiting por IP
- [ ] Rate limiting por endpoint
- [ ] Headers de resposta (X-RateLimit-*)
- [ ] Retry-After quando excedido
- [ ] Storage em memória e Redis

## 💡 Exemplo de Uso

```bash
# Requisições normais
curl http://localhost:3000/api/dados

# Headers de resposta
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## ⚙️ Setup

```bash
cd 15-rate-limiting
deno task dev
```
