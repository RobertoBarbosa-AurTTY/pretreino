# Desafio 42: Request Validation

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um validador de requisições baseado em schema, com mensagens de erro
detalhadas e sanitização da entrada — sem usar bibliotecas prontas.

## 📋 Contexto Real

Dados inválidos que chegam à API causam:

- Erros de processamento (o famoso `undefined is not a function`)
- Vulnerabilidades de segurança (XSS, mass assignment)
- Inconsistências no banco de dados

Todo endpoint deveria validar `body`, `query` e `params` antes de processar.

## 📐 Requisitos

- [ ] `validate(data, schema)` retorna `{ valid, errors, sanitized }`; `valid` é
      `true` se e somente se `errors` estiver vazio
- [ ] Campo com `required: true` ausente (`undefined`, `null` ou `""`) → erro
      com `code: "required"`; campo opcional ausente não gera erro
- [ ] Tipos suportados: `"string"`, `"number"` (não `NaN`), `"boolean"`,
      `"array"` e `"email"` (string no formato `x@y.z`); tipo errado →
      `code: "type"`
- [ ] `min`/`max`: comparam o **tamanho** para string, email e array e o
      **valor** para number → `code: "min"` / `"max"`
- [ ] `pattern` (só para strings) → `code: "pattern"`; `custom(value)`
      retornando `false` → `code: "custom"`
- [ ] No máximo **um erro por campo**, verificado na ordem
      `required → type → min → max → pattern → custom`; cada erro tem `field`,
      `code` e uma `message` legível
- [ ] Entrada que não é um objeto → `valid: false` com um erro
      `{ field: "_root", code: "type" }`
- [ ] A validação usa os valores **originais**; `sanitized` é igual a
      `sanitize(data, schema)`
- [ ] `sanitize(data, schema)` retorna um novo objeto só com os campos do
      schema, com strings aparadas (`trim`) e `<`/`>` escapados para
      `&lt;`/`&gt;`
- [ ] `src/index.ts`: servidor HTTP na porta `PORT` que valida o body de um
      `POST` e responde `400` com a lista de `errors` quando inválido

## 🗂️ Estrutura dos Dados

```typescript
type FieldType = "string" | "number" | "boolean" | "email" | "array";

interface ValidationSchema {
  [field: string]: {
    type: FieldType;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => boolean;
  };
}

type ValidationErrorCode =
  | "required"
  | "type"
  | "min"
  | "max"
  | "pattern"
  | "custom";

interface ValidationError {
  field: string;
  message: string;
  code: ValidationErrorCode;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  sanitized: unknown;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  sanitize,
  validate,
  type ValidationSchema,
} from "./validation.service.ts";

const schema: ValidationSchema = {
  name: { type: "string", required: true, min: 3 },
  email: { type: "email", required: true },
  age: { type: "number", min: 18 },
};

const result = validate({ name: "Jo", email: "x" }, schema);
// result.valid === false
// result.errors → [{ field: "name", code: "min", ... }, { field: "email", code: "type", ... }]

sanitize({ name: "  <b>Ana</b> ", admin: true }, schema);
// → { name: "&lt;b&gt;Ana&lt;/b&gt;" }
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [typeof (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/typeof)
- [Expressões regulares (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions)
- [Type narrowing (TypeScript)](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve)

## 📝 Notas

- Nunca confie na entrada do cliente: valide antes de processar
- Mensagens de erro claras ajudam quem consome a API
- Depois de implementar à mão, compare com [Zod](https://zod.dev) (desafio 17)
