# Desafio 07: Job de Backup Database

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Criar um job que exporta os dados do "banco", comprime o backup, envia para um
storage e remove backups antigos.

## 📋 Contexto Real

O time de infraestrutura precisa:

- Realizar backup automático do banco
- Comprimir os arquivos de backup
- Enviar para um storage externo (S3, Azure Blob...)
- Manter só os backups dos últimos 7 dias
- Saber quando algo falhou

Neste desafio o banco é **simulado** por um arquivo JSON (`data/produtos.json`)
e o storage é **simulado** por uma pasta local, para rodar sem infraestrutura.

## 📐 Requisitos

Arquivo: `src/backup.service.ts`

- [ ] `exportDatabase(config)` lê `config.sourceFile`, confere que é um JSON
      válido e grava `{folder}/backup-{database}-{timestamp}.json`, criando a
      pasta se necessário; retorna o caminho do arquivo
- [ ] O `timestamp` do nome não pode conter `:` (inválido no Windows), ex.:
      `2024-01-20T10-30-00-000Z`
- [ ] `exportDatabase` lança erro se `sourceFile` não existir
- [ ] `compressFile(filePath)` gera `{filePath}.gz` com gzip, remove o arquivo
      original e retorna o caminho do `.gz`
- [ ] `sendToStorage(filePath, config)` copia o arquivo para
      `{folder}/storage/{bucket}/` e retorna `true`; se o arquivo não existir
      retorna `false` sem lançar
- [ ] `cleanOldBackups(config)` remove de `folder` os arquivos que começam com
      `backup-` e foram modificados há mais de `retentionDays` dias; outros
      arquivos ficam; retorna quantos foram removidos
- [ ] `executeBackup(config)` executa exportar → comprimir → enviar → limpar e
      retorna `success: true`, `file` (o `.gz`), `size` (bytes do `.gz`),
      `startDate` e `endDate` (ISO 8601)
- [ ] Se qualquer etapa falhar, `executeBackup` retorna `success: false` com
      `error` preenchido, **sem lançar exceção**
- [ ] `src/index.ts`: executar o backup e exibir o resultado (arquivo, tamanho,
      duração ou erro)

## 🗂️ Estrutura dos Dados

```typescript
export interface BackupConfig {
  database: string;
  host: string;
  port: number;
  user: string;
  password: string;
  bucket: string;
  region: string;
  retentionDays: number;
  folder: string;
  sourceFile: string;
}

export interface BackupResult {
  success: boolean;
  file: string;
  size: number;
  startDate: string;
  endDate: string;
  error?: string;
}
```

## 💡 Exemplo de Uso

```typescript
import { executeBackup } from "./backup.service.ts";

const result = await executeBackup({
  database: "meubanco",
  host: "localhost",
  port: 5432,
  user: "admin",
  password: "***",
  bucket: "meu-bucket-backup",
  region: "us-east-1",
  retentionDays: 7,
  folder: "./backups",
  sourceFile: "./data/produtos.json",
});

console.log(`Backup: ${result.file} (${result.size} bytes)`);
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [`CompressionStream` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream)
- [`Deno.readDir` e `Deno.stat`](https://docs.deno.com/api/deno/~/Deno.readDir)
- [`Deno.copyFile`](https://docs.deno.com/api/deno/~/Deno.copyFile)
- [`Deno.Command` (subprocessos)](https://docs.deno.com/api/deno/~/Deno.Command)
- [`DecompressionStream` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)

## 📝 Notas

- `host`, `port`, `user` e `password` não são usados pela versão simulada; num
  banco real você chamaria `pg_dump` com `Deno.Command` usando esses campos.
- Valide a integridade: descomprima o `.gz` e confira que o JSON é válido.
- Extra: enviar para um S3 de verdade e notificar em caso de falha.

---

**Dica:** Sempre teste a restauração do backup. Um backup que não pode ser
restaurado não serve.
