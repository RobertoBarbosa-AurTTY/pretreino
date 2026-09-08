# Desafio 7: Job de Backup Database

## 🎯 Objetivo

Criar um job que realiza backup de banco de dados e envia para armazenamento externo.

## 📋 Contexto Real

O time de infraestrutura precisa:
- Realizar backup automático do banco
- Comprimir arquivos de backup
- Enviar para storage (S3, Azure Blob)
- Manter backup dos últimos 7 dias
- Notificar em caso de falha

## 📐 Requisitos

- [ ] Exportar dados do banco para SQL/JSON
- [ ] Comprimir arquivo de backup
- [ ] Enviar para storage externo
- [ ] Limpar backups antigos (mais de 7 dias)
- [ ] Log de todas as operações

## 🗂️ Estrutura dos Dados

```typescript
interface ConfiguracaoBackup {
  bancoDados: string;
  host: string;
  port: number;
  usuario: string;
  senha: string;
  bucket: string;
  regiao: string;
  retencaoDias: number;
}

interface ResultadoBackup {
  success: boolean;
  arquivo: string;
  tamanho: number;
  dataInicio: string;
  dataFim: string;
  erro?: string;
}
```

## 💡 Exemplo de Uso

```typescript
const config: ConfiguracaoBackup = {
  bancoDados: "meubanco",
  host: "localhost",
  port: 5432,
  usuario: "admin",
  senha: "***",
  bucket: "meu-bucket-backup",
  regiao: "us-east-1",
  retencaoDias: 7
};

const resultado = await executarBackup(config);
console.log(`Backup: ${resultado.arquivo} (${resultado.tamanho} bytes)`);
```

## ⚙️ Setup

```bash
deno task dev
```

## 🧪 Testes

```bash
deno task test
```

## 📝 Notas

- Use `Deno.spawn` para comandos de backup
- Implemente compressão com zlib
- Valide integridade do backup após criação
- Notifique em caso de falha

---

**Dica:** Sempre teste a restauração do backup. Um backup que não pode ser restaurado não serve.
