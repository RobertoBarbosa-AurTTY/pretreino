# Desafio 12: Autenticação JWT

## 🎯 Objetivo

Implementar sistema de autenticação completo com JWT (JSON Web Tokens).

## 📋 Requisitos

- [ ] Criar endpoint de login
- [ ] Gerar token JWT
- [ ] Validar token em rotas protegidas
- [ ] Implementar refresh token
- [ ] Armazenar tokens invalidados (logout)

## 🗂️ Estrutura

```
📁 12-autenticacao-jwt/
├── src/
│   ├── index.ts
│   ├── auth.service.ts
│   └── jwt.utils.ts
├── data/
│   └── usuarios.json
├── .env
└── README.md
```

## 💡 Exemplo de Uso

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"123456"}'

# Rota protegida
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer <token>"
```

## ⚙️ Setup

```bash
cd 12-autenticacao-jwt
cp .env.example .env
deno task dev
```

## 📝 Notas

- JWT secret deve estar no `.env`
- Tokens expiram após X minutos
- Refresh token para renovar acesso
