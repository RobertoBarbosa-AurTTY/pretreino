# Desafio 18: Error Handling

## 🎯 Objetivo

Implementar sistema centralizado de tratamento de erros.

## 📋 Requisitos

- [ ] Classes de erro customizadas
- [ ] Middleware de erro
- [ ] Error codes padronizados
- [ ] Logging de erros
- [ ] Respostas de erro consistentes

## 💡 Exemplo de Uso

```bash
# Erro 400
curl http://localhost:3000/api/usuarios/invalido

# Erro 404
curl http://localhost:3000/api/usuarios/999

# Erro 500
curl http://localhost:3000/api/error
```

## ⚙️ Setup

```bash
cd 18-error-handling
deno task dev
```
