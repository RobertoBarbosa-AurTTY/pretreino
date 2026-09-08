# Desafio 20: API REST Completa

## 🎯 Objetivo

Implementar uma API REST completa seguindo boas práticas.

## 📋 Requisitos

- [ ] CRUD completo
- [ ] Validação de dados
- [ ] Paginação
- [ ] Filtros e busca
- [ ] Ordenação
- [ ] Documentação

## 💡 Exemplo de Uso

```bash
# Listar com paginação e filtros
curl "http://localhost:3000/api/produtos?page=1&limit=10&search=camisa&sort=preco"

# Criar
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Camisa","preco":99.90}'
```

## ⚙️ Setup

```bash
cd 20-api-rest-completa
deno task dev
```
