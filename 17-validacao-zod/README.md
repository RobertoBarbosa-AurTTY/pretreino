# Desafio 17: Validação com Zod

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Construir uma mini biblioteca de validação **inspirada no
[Zod](https://zod.dev)** (`z.string`, `z.email`, `z.number`, `z.object`,
`optional`, `default`) e usá-la para validar o corpo das requisições de uma API.

## 📋 Contexto Real

Tudo que chega pela rede é `unknown`: o cliente pode mandar campos faltando,
tipos errados ou lixo. Bibliotecas como Zod validam a entrada em tempo de
execução **e** inferem o tipo TypeScript a partir do schema, eliminando a
duplicação entre `interface` e validação. Implementar uma versão simples ajuda a
entender como elas funcionam por dentro.

O servidor em `src/index.ts` já usa os schemas; seu trabalho é o `src/zod.ts`.

## 📐 Requisitos

- [ ] Todo schema tem `_parse(data)`, que retorna `{ success: true, data }` ou
      `{ success: false, errors }` (**nunca lança**)
- [ ] Toda mensagem de erro contém o nome do campo passado na criação do schema
      (ex: `z.string("name")` → `"name deve ser uma string"`)
- [ ] `z.string(field)` aceita só `string` não vazia (após `trim`)
- [ ] `z.email(field)` aceita só string no formato `usuario@dominio.tld`, sem
      espaços
- [ ] `z.number(field)` aceita só `number` que não seja `NaN` (a string `"25"` é
      inválida)
- [ ] `.optional()` aceita `undefined` (retorna `data: undefined`); valores
      presentes continuam sendo validados
- [ ] `.default(value)` retorna `value` quando o dado é `undefined`
- [ ] `z.object(shape)` rejeita o que não for objeto (`null`, arrays,
      primitivos), valida cada campo, **acumula os erros de todos os campos** e
      retorna apenas as chaves do `shape` (chaves extras são descartadas)
- [ ] `zodValidate(schema, data)` retorna o dado tipado ou lança `ZodError` com
      `errors: string[]`
- [ ] `POST /api/usuarios` e `POST /api/produtos` respondem `400` com
      `{ error: "Validation error", details }` para dados inválidos

## 🗂️ Estrutura dos Dados

```typescript
export type ZodType<T> = {
  _type: string;
  _parse: (
    data: unknown,
  ) => { success: true; data: T } | { success: false; errors: string[] };
  optional: () => ZodType<T | undefined>;
  default: (value: T) => ZodType<T>;
};

class ZodError extends Error {
  errors: string[];
}

export const z = {
  string: zodString, // (fieldName?: string) => ZodType<string>
  email: zodEmail, // (fieldName?: string) => ZodType<string>
  number: zodNumber, // (fieldName?: string) => ZodType<number>
  object: zodObject, // (shape, name?) => ZodType<{ ...tipos inferidos }>
};

export function zodValidate<T>(schema: ZodType<T>, data: unknown): T;
```

Schemas usados pelo servidor (`src/index.ts`):

```typescript
const userSchema = z.object({
  name: z.string("name"),
  email: z.email("email"),
  age: z.number("age"),
});

const productSchema = z.object({
  name: z.string("name"),
  price: z.number("price"),
  description: z.string("description").optional(),
});
```

## 💡 Exemplo de Uso

```typescript
import { z, ZodError, zodValidate } from "./src/zod.ts";

const schema = z.object({ name: z.string("name"), age: z.number("age") });

schema._parse({ name: "Ana", age: 30, extra: 1 });
// { success: true, data: { name: "Ana", age: 30 } }

try {
  zodValidate(schema, { name: "" });
} catch (e) {
  if (e instanceof ZodError) console.log(e.errors); // [ "name ...", "age ..." ]
}
```

```bash
curl -X POST http://localhost:3005/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","age":25}'

curl -X POST http://localhost:3005/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalido"}'
# 400 { "error": "Validation error", "details": [...] }
```

## ⚙️ Setup

```bash
cd 17-validacao-zod
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Zod: documentação](https://zod.dev)
- [TypeScript: tipos condicionais e `infer`](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript: mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [typeof](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/typeof)
- [Expressões regulares](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions)

## 📝 Notas

- Não use a biblioteca Zod real aqui; a ideia é implementar a sua.
- Extra: `z.string().min(n)`, `z.array(schema)`, `.transform(fn)`, validação
  condicional com `.refine(fn, mensagem)`, e comparar com o Zod real
  (`npm:zod`).
