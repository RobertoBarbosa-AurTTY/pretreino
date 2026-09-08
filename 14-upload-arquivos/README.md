# Desafio 14: Upload de Arquivos

## 🎯 Objetivo

Implementar sistema de upload de arquivos com validação e armazenamento.

## 📋 Requisitos

- [ ] Upload de múltiplos arquivos
- [ ] Validação de tipo e tamanho
- [ ] Armazenamento local
- [ ] Progresso de upload
- [ ] Listagem de arquivos

## 💡 Exemplo de Uso

```bash
# Upload
curl -X POST http://localhost:3000/api/upload \
  -F "arquivo=@foto.jpg" \
  -F "descricao=Foto de perfil"

# Listar arquivos
curl http://localhost:3000/api/arquivos
```

## ⚙️ Setup

```bash
cd 14-upload-arquivos
deno task dev
```
