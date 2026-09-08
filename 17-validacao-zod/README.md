# Desafio 17: Validação com Zod

## 🎯 Objetivo

Implementar validação de dados usando a biblioteca Zod.

## 📋 Requisitos

- [ ] Schemas de validação
- [ ] Validação de entrada
- [ ] Transformação de dados
- [ ] Mensagens de erro personalizadas
- [ ] Validação condicional

## 💡 Exemplo de Uso

```bash
# Dados válidos
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","idade":25}'

# Dados inválidos
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"","email":"invalido"}'
```

## ⚙️ Setup

```bash
cd 17-validacao-zod
deno task dev
```
