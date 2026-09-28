# Desafio 11: Validador de CPF

**Dificuldade:** ⭐

## 🎯 Objetivo

Implementar a validação, formatação e geração de CPFs brasileiros, verificando
os dígitos verificadores, e processar listas de CPFs lidas de arquivos.

## 📋 Contexto Real

Todo sistema brasileiro que cadastra pessoas físicas (e-commerce, bancos, ERPs)
precisa validar CPF antes de salvar ou enviar para outro sistema. A validação
local evita chamadas desnecessárias a serviços externos e rejeita erros de
digitação logo na entrada.

### Regras do CPF

- O CPF tem **11 dígitos**; aceita `XXX.XXX.XXX-XX` ou `XXXXXXXXXXX`.
- **1º dígito verificador:** multiplique os 9 primeiros dígitos pelos pesos
  `10, 9, …, 2`, some e calcule `resto = soma % 11`. Se `resto < 2` → dígito
  `0`; senão → `11 - resto`.
- **2º dígito verificador:** mesma conta com os 10 primeiros dígitos e pesos
  `11, 10, …, 2`.
- CPFs com todos os dígitos iguais (ex: `111.111.111-11`) são **inválidos**.

## 📐 Requisitos

- [ ] `validateCpf(cpf)` retorna `true` para CPFs válidos, com ou sem pontuação
      (`.` e `-`)
- [ ] `validateCpf` retorna `false` para: dígito verificador incorreto, menos ou
      mais de 11 dígitos, string vazia, letras, todos os dígitos iguais
- [ ] `formatCpf(cpf)` recebe um CPF com ou sem pontuação e retorna
      `XXX.XXX.XXX-XX`
- [ ] `formatCpf` lança erro se a entrada não tiver exatamente 11 dígitos
- [ ] `generateCpf()` retorna uma string de 11 dígitos (sem pontuação) que passa
      em `validateCpf`
- [ ] `validateCpfList(cpfs)` retorna `{ valid, invalid }` com os CPFs originais
      separados, preservando a ordem de entrada
- [ ] `readCpfsFromFile(path)` lê um CPF por linha, remove espaços nas pontas e
      ignora linhas vazias (aceita `\n` e `\r\n`)
- [ ] `saveCpfsToFile(cpfs, path)` grava um CPF por linha
- [ ] `src/index.ts`: no modo `validate`, lê `INPUT_FILE` e mostra válidos e
      inválidos; no modo `generate`, gera `GENERATE_COUNT` CPFs e salva em
      `OUTPUT_FILE`
- [ ] Nenhuma biblioteca externa de validação

## 🗂️ Estrutura dos Dados

```typescript
export function validateCpf(cpf: string): boolean;
export function formatCpf(cpf: string): string;
export function generateCpf(): string;
export function validateCpfList(
  cpfs: string[],
): { valid: string[]; invalid: string[] };
export async function readCpfsFromFile(filePath: string): Promise<string[]>;
export async function saveCpfsToFile(
  cpfs: string[],
  filePath: string,
): Promise<void>;
```

Arquivos de exemplo em `data/`:

- `data/cpfs-validos.txt`: CPFs válidos, um por linha
- `data/cpfs-invalidos.txt`: CPFs inválidos, um por linha

## 💡 Exemplo de Uso

```typescript
import {
  formatCpf,
  generateCpf,
  validateCpf,
  validateCpfList,
} from "./src/cpf.service.ts";

validateCpf("529.982.247-25"); // true
validateCpf("12345678909"); // true
validateCpf("111.111.111-11"); // false
validateCpf("123.456.789-00"); // false

formatCpf("52998224725"); // "529.982.247-25"

const cpf = generateCpf(); // ex: "04817263540"
validateCpf(cpf); // true

validateCpfList(["529.982.247-25", "111.111.111-11"]);
// { valid: ["529.982.247-25"], invalid: ["111.111.111-11"] }
```

## ⚙️ Setup

```bash
cd 11-validar-cpf
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [String.prototype.replace com regex](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
- [Array.prototype.reduce](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [Operador resto (%)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Remainder)
- [Deno: leitura e escrita de arquivos](https://docs.deno.com/examples/reading_files/)

## 📝 Notas

- Foco em lógica pura: prefira funções pequenas e sem efeitos colaterais.
- Comece removendo os caracteres não numéricos e validando o tamanho; depois
  implemente o cálculo dos dígitos.
- Extra: retornar o motivo da invalidação (ex: `"Dígito verificador inválido"`).
