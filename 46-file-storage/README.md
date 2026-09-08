# Desafio 46: File Storage

## 🎯 Objetivo

Implementar sistema de armazenamento de arquivos com metadados.

## 📋 Contexto Real

Upload e gestão de arquivos:
- Imagens de perfil
- Documentos
- Anexos

## 📐 Requisitos

- [ ] Upload de arquivos
- [ ] Validação de tipo/tamanho
- [ ] Armazenamento local/S3
- [ ] CRUD de metadados
- [ ] Thumbnails automáticos

## 🗂️ Estrutura dos Dados

```typescript
interface FileMetadata {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  caminho: string;
  criadoEm: string;
}

interface UploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Valide tipos permitidos
- Limite tamanho máximo
- Gere nomes únicos

---

**Dica:** Nunca use nomes originais de arquivos - gere UUIDs.