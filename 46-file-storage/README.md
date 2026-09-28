# Desafio 46: File Storage

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um serviço de armazenamento de arquivos em disco local com validação
de tipo e tamanho, nomes seguros e CRUD de metadados.

## 📋 Contexto Real

Avatares, notas fiscais em PDF, anexos de chamados... quase todo sistema recebe
arquivos. Um storage bem feito:

- Rejeita arquivos grandes demais ou de tipos não permitidos
- Nunca usa o nome enviado pelo usuário no disco (path traversal, colisões)
- Guarda metadados (nome original, tipo, tamanho, dono) para listar e buscar
- Pode trocar o disco local por S3 sem mudar quem usa o serviço

## 📐 Requisitos

- [ ] `createStorage(config)` retorna um `FileStorage` que grava em
      `config.basePath`, criando a pasta (recursivamente) se não existir
- [ ] `upload(file, metadata?)` grava o conteúdo e retorna
      `{ success: true, file }` com `id` único, `name` (nome original), `type`
      (`file.type`), `size` (bytes), `path` e `createdAt` (ISO 8601); `metadata`
      recebido fica em `file.metadata`
- [ ] O arquivo em disco se chama `<id><extensão original>` (ex:
      `3f2a...c1.pdf`) dentro de `basePath` — o nome original **não** aparece no
      `path`
- [ ] Arquivo com `size > maxFileSize` → `{ success: false, error }`, nada é
      gravado
- [ ] Se `allowedTypes` for informado, o `type` precisa bater exatamente com um
      item ou com um curinga (`"image/*"` aceita `image/png`); caso contrário
      `{ success: false, error }`
- [ ] `get(id)` retorna os metadados ou `null`
- [ ] `read(id)` retorna o conteúdo (`Uint8Array`) ou `null`
- [ ] `list()` retorna os metadados de todos os arquivos
- [ ] `delete(id)` apaga o arquivo do disco e os metadados e retorna `true`;
      para `id` desconhecido retorna `false`
- [ ] `src/index.ts`: usa `STORAGE_PATH`, `MAX_FILE_SIZE` e `ALLOWED_TYPES` do
      `.env` e demonstra upload, listagem e remoção

## 🗂️ Estrutura dos Dados

```typescript
interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface StorageConfig {
  basePath: string;
  /** Tamanho máximo em bytes. */
  maxFileSize?: number;
  /** MIME types aceitos; aceita curinga como `"image/*"`. */
  allowedTypes?: string[];
}

interface UploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
}

interface FileStorage {
  upload(file: File, metadata?: Record<string, unknown>): Promise<UploadResult>;
  get(id: string): FileMetadata | null;
  read(id: string): Promise<Uint8Array | null>;
  delete(id: string): Promise<boolean>;
  list(): FileMetadata[];
}
```

## 💡 Exemplo de Uso

```typescript
import { createStorage } from "./storage.service.ts";

const storage = createStorage({
  basePath: "./uploads",
  maxFileSize: 5 * 1024 * 1024,
  allowedTypes: ["image/*", "application/pdf"],
});

const file = new File(["%PDF-1.4 ..."], "nota-fiscal.pdf", {
  type: "application/pdf",
});
const result = await storage.upload(file, { owner: "u1" });

if (result.success) {
  console.log(result.file!.path); // ./uploads/3f2a...c1.pdf
  const bytes = await storage.read(result.file!.id);
  await storage.delete(result.file!.id);
} else {
  console.error(result.error);
}
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [File (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/File)
- [Deno.writeFile](https://docs.deno.com/api/deno/~/Deno.writeFile) e
  [Deno.mkdir](https://docs.deno.com/api/deno/~/Deno.mkdir)
- [@std/path — extname / join](https://jsr.io/@std/path)
- [crypto.randomUUID (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Crypto/randomUUID)
- [MIME types (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

## 📝 Notas

- Nunca use o nome original do arquivo no disco — gere UUIDs
- O `type` de `File` vem do cliente e pode mentir; em produção, confira os
  "magic bytes" do conteúdo
- Se usar `@std/path`, adicione ao `deno.json` do desafio:
  `"imports": { "@std/path": "jsr:@std/path@^1" }`
- Extra: persistir os metadados em um arquivo JSON, gerar thumbnails de imagens,
  adapter para S3
