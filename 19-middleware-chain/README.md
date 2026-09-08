# Desafio 19: Middleware Chain

## 🎯 Objetivo

Implementar sistema de middlewares encadeados para APIs.

## 📋 Requisitos

- [ ] Sistema de middlewares
- [ ] Next function
- [ ] Middlewares pré e pós-execução
- [ ] Middlewares condicionais
- [ ] Composição de middlewares

## 💡 Exemplo de Uso

```bash
# Com todos os middlewares
curl http://localhost:3000/api/dados

# Headers de middleware
X-Request-Id: abc123
X-Process-Time: 15ms
```

## ⚙️ Setup

```bash
cd 19-middleware-chain
deno task dev
```
