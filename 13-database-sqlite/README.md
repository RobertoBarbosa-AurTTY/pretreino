# Desafio 13: Database SQLite

## 🎯 Objetivo

Implementar operações CRUD completas com banco de dados SQLite.

## 📋 Requisitos

- [ ] Criar tabela de usuários
- [ ] Implementar operações CRUD
- [ ] Usar prepared statements
- [ ] Implementar transações
- [ ] Criar migrações

## 🗂️ Estrutura

```
📁 13-database-sqlite/
├── src/
│   ├── index.ts
│   ├── database.ts
│   └── usuario.service.ts
├── data/
│   └── app.db
└── README.md
```

## 💡 Exemplo de Uso

```bash
# Criar usuário
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com"}'

# Listar usuários
curl http://localhost:3000/api/usuarios
```

## ⚙️ Setup

```bash
cd 13-database-sqlite
deno task dev
```
