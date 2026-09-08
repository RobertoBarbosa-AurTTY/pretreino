# Desafio: Validador de CPF em TypeScript

## 📋 Sobre o Desafio

Este desafio é projetado para praticar lógica de programação, manipulação de strings, arrays e operações matemáticas em TypeScript.

## 🎯 Objetivo

Criar uma função que valide um número de CPF (Cadastro de Pessoas Físicas) brasileiro, verificando se os dígitos verificadores estão corretos.

## 📐 Regras de Validação

### Estrutura do CPF
- O CPF deve ter **11 dígitos**
- Aceita formatos: `XXX.XXX.XXX-XX` ou `XXXXXXXXXXX`

### Cálculo dos Dígitos Verificadores

#### Primeiro Dígito (posição 10):
```
Pesos: 10, 9, 8, 7, 6, 5, 4, 3, 2
Fórmula: (soma dos produtos) % 11
Se resultado = 0 ou 1 → dígito = 0
Caso contrário → dígito = 11 - resultado
```

#### Segundo Dígito (posição 11):
```
Pesos: 11, 10, 9, 8, 7, 6, 5, 4, 3, 2
Fórmula: (soma dos produtos) % 11
Se resultado = 0 ou 1 → dígito = 0
Caso contrário → dígito = 11 - resultado
```

### Regra Adicional
- CPFs com todos os dígitos iguais são considerados **inválidos** (ex: 111.111.111-11)

## 🚀 Requisitos

- [ ] Criar função `validarCPF(cpf: string | number): boolean`
- [ ] Remover caracteres especiais (`.`, `-`, `,`)
- [ ] Validar tamanho (11 dígitos)
- [ ] Implementar cálculo dos dígitos verificadores
- [ ] Validar CPFs com todos dígitos iguais
- [ ] Criar testes unitários usando `Deno.test`

## 📁 Estrutura do Projeto

```
src/
├── index.ts          # Código principal
├── validarCPF.ts     # Função de validação
└── __tests__/
    └── validarCPF.test.ts  # Testes unitários
```

## 💡 Exemplos

```typescript
// CPF válido
validarCPF("529.982.247-25")  // true
validarCPF("12345678909")     // true

// CPF inválido
validarCPF("111.111.111-11")  // false
validarCPF("123.456.789-00")  // false
```

## 🏆 Desafios Extras

1. Retornar objeto com detalhes do erro:
   ```typescript
   validarCPF("123.456.789-00")
   // { valido: false, erro: "Dígito verificador inválido" }
   ```

2. Implementar testes unitários com o framework de testes nativo do Deno:
   ```typescript
   import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

   Deno.test("deve validar CPF correto", () => {
     assertEquals(validarCPF("529.982.247-25"), true);
   });
   ```

3. Criar função para gerar CPFs válidos aleatoriamente

## ⚙️ Setup

```bash
# Verificar se Deno está instalado
deno --version

# Criar estrutura do projeto
mkdir src
touch src/index.ts
touch src/validarCPF.ts
touch deno.json
```

### Configuração do `deno.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  },
  "tasks": {
    "dev": "deno run --watch src/index.ts",
    "test": "deno test src/__tests__/validarCPF.test.ts"
  }
}
```

## 📝 Notas

- O desafio foca em lógica de programação pura
- Não utilize bibliotecas externas para validação
- Prefira abordagens funcionais
- Considere edge cases (strings vazias, caracteres especiais)
- Deno possui suporte nativo a TypeScript
- Utilize as assertivas do Deno para testes: `https://deno.land/std/testing/asserts.ts`

---

**Dica:** Comece implementando a remoção de caracteres especiais e a validação de tamanho antes de implementar o cálculo dos dígitos verificadores.
