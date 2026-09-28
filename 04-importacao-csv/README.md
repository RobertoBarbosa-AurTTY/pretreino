# Desafio 04: Importação de CSV

**Dificuldade:** ⭐

## 🎯 Objetivo

Criar um serviço que lê uma planilha CSV de clientes, valida cada linha e gera
um relatório da importação com os erros encontrados.

## 📋 Contexto Real

O time comercial precisa importar uma planilha de clientes:

- Ler o arquivo CSV
- Validar os dados linha por linha
- Tratar erros de formatação sem interromper a importação
- Contar os registros válidos
- Gerar um relatório de erros

## 📐 Requisitos

Arquivo: `src/importer.service.ts`

- [ ] `readCSV(filePath)` usa a primeira linha como cabeçalho e retorna um
      objeto por linha (`{ name, email, cpf, phone, ... }`)
- [ ] `readCSV` detecta o separador pelo cabeçalho (`;` ou `,`), remove espaços
      extras dos valores, aceita quebras de linha `\n` e `\r\n` e ignora linhas
      vazias
- [ ] `validateEmail(email)` retorna `true` só para o formato
      `usuario@dominio.tld` (sem espaços)
- [ ] `validateCPF(cpf)` aceita CPF com ou sem máscara (`529.982.247-25` ou
      `52998224725`), confere os **dois dígitos verificadores** e rejeita CPFs
      com todos os dígitos iguais
- [ ] `validateClient(client, line)` retorna um `ImportError` por problema:
  - campos obrigatórios `name`, `email` e `cpf` vazios ou ausentes
  - `email` ou `cpf` preenchidos mas inválidos
  - `phone` preenchido com quantidade de dígitos diferente de 10 ou 11
- [ ] Cada erro tem `line`, `field` (nome da coluna), `error` (mensagem) e
      `value` (valor original, `""` se ausente)
- [ ] `importCSV(filePath)` retorna `totalRows` (linhas de dados, sem o
      cabeçalho), `imported` (linhas sem nenhum erro) e todos os `errors`
- [ ] O número da linha é o da linha no arquivo: cabeçalho = 1, primeiro
      registro = 2
- [ ] `src/index.ts`: importar, exibir o resumo e gravar o relatório de erros
      (uma linha por erro) em `PASTA_ERROS/ARQUIVO_ERROS`

## 🗂️ Estrutura dos Dados

```typescript
export interface ClientCSV {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface ImportResult {
  totalRows: number;
  imported: number;
  errors: ImportError[];
}

export interface ImportError {
  line: number;
  field: string;
  error: string;
  value: string;
}
```

Dados de exemplo: `data/clientes.csv`.

## 💡 Exemplo de Uso

```typescript
import { importCSV, validateCPF } from "./importer.service.ts";

console.log(validateCPF("529.982.247-25")); // true

const result = await importCSV("./data/clientes.csv");
console.log(`Linhas: ${result.totalRows}`);
console.log(`Importados: ${result.imported}`);
console.log(`Erros: ${result.errors.length}`);
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Expressões regulares (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions)
- [`String.prototype.split()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [`Deno.readTextFile`](https://docs.deno.com/api/deno/~/Deno.readTextFile)
- [`TextDecoder` e encodings (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
- [CPF e dígitos verificadores (Wikipédia)](https://pt.wikipedia.org/wiki/Cadastro_de_Pessoas_F%C3%ADsicas)

## 📝 Notas

- Uma linha inválida não deve interromper a importação das demais.
- Arquivos exportados do Excel podem vir em `ISO-8859-1` (`latin1`); o
  `TextDecoder` resolve isso.
- A coluna `birthDate` do exemplo não é validada; use como extra se quiser.
- Log detalhado ajuda a encontrar o problema na planilha original.

---

**Dica:** Sempre valide dados de entrada antes de processar. Dados inválidos
podem quebrar o sistema.
