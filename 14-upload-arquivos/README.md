# Desafio 14: Upload de Arquivos

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar o serviço de upload de arquivos com validação de tipo e tamanho,
armazenamento local seguro, listagem e remoção.

## 📋 Contexto Real

Fotos de perfil, notas fiscais em PDF, anexos de chamados: quase toda aplicação
recebe arquivos. Sem validação, o servidor aceita executáveis, lota o disco com
arquivos gigantes ou permite que um nome como `../../etc/passwd` grave fora da
pasta de uploads (path traversal).

O servidor HTTP em `src/index.ts` já está montado (recebe `multipart/form-data`
com os campos `file` e `description`); seu trabalho é o `src/upload.service.ts`.

## 📐 Requisitos

- [ ] Configuração lida do ambiente: `UPLOAD_DIR` (padrão `./uploads`),
      `MAX_FILE_SIZE` em bytes (padrão 10 MB) e `ALLOWED_TYPES` (lista separada
      por vírgula)
- [ ] `validateFile(type, size)` retorna `null` se o tipo está em
      `ALLOWED_TYPES` e `size <= MAX_FILE_SIZE`; caso contrário retorna uma
      mensagem de erro (string)
- [ ] `saveFile(file, description?)` valida o arquivo; se inválido retorna
      `{ success: false, error }` e **não grava nada**
- [ ] Se válido, cria `UPLOAD_DIR` se necessário, grava o conteúdo e retorna
      `{ success: true, file }` com `id` único, `originalName`, `type`, `size`,
      `description`, `path` e `createdAt` (ISO 8601)
- [ ] O nome gravado em disco (`name`) é gerado/sanitizado: sem `..`, `/` ou
      `\`; o `path` final fica sempre dentro de `UPLOAD_DIR`
- [ ] Dois uploads com o mesmo nome original não se sobrescrevem
- [ ] `listFiles()` retorna os arquivos salvos; `findById(id)` retorna o arquivo
      ou `undefined`
- [ ] `deleteFile(id)` apaga o arquivo do disco e do registro e retorna `true`;
      retorna `false` se o `id` não existir
- [ ] `formatSize(bytes)`: abaixo de 1024 → `"500 B"`; acima, uma casa decimal
      com `KB`, `MB` ou `GB` (`1536` → `"1.5 KB"`, `10485760` → `"10.0 MB"`)

## 🗂️ Estrutura dos Dados

```typescript
export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  description?: string;
  path: string;
  createdAt: string;
}

export interface UploadResult {
  success: boolean;
  file?: UploadedFile;
  error?: string;
}
```

### Endpoints do servidor (`src/index.ts`)

| Método   | Rota                | Descrição                                    |
| -------- | ------------------- | -------------------------------------------- |
| `POST`   | `/api/upload`       | `multipart/form-data`: `file`, `description` |
| `GET`    | `/api/arquivos`     | Lista arquivos                               |
| `GET`    | `/api/arquivos/:id` | Metadados de um arquivo                      |
| `DELETE` | `/api/arquivos/:id` | Remove arquivo                               |
| `GET`    | `/health`           | Health check                                 |

## 💡 Exemplo de Uso

```typescript
import { formatSize, listFiles, saveFile } from "./src/upload.service.ts";

const file = new File(["conteúdo"], "nota.pdf", { type: "application/pdf" });
const result = await saveFile(file, "Nota fiscal");
// { success: true, file: { id: "...", originalName: "nota.pdf", ... } }

listFiles().length; // 1
formatSize(1536); // "1.5 KB"
```

```bash
curl -X POST http://localhost:3002/api/upload \
  -F "file=@foto.png" \
  -F "description=Foto de perfil"

curl http://localhost:3002/api/arquivos
```

## ⚙️ Setup

```bash
cd 14-upload-arquivos
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [File](https://developer.mozilla.org/pt-BR/docs/Web/API/File) e
  [Request.formData](https://developer.mozilla.org/pt-BR/docs/Web/API/Request/formData)
- [Tipos MIME](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/MIME_types)
- [Deno.writeFile](https://docs.deno.com/api/deno/~/Deno.writeFile) e
  [Deno.remove](https://docs.deno.com/api/deno/~/Deno.remove)
- [OWASP: Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [crypto.randomUUID](https://developer.mozilla.org/pt-BR/docs/Web/API/Crypto/randomUUID)

## 📝 Notas

- O registro dos arquivos pode ficar em memória; os arquivos ficam no disco.
- A pasta `uploads/` não deve ser versionada.
- Extra: múltiplos arquivos por requisição, thumbnails, download
  (`GET /api/arquivos/:id/download`).
