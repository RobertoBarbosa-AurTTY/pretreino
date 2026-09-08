# Desafio 42: Request Validation

## 🎯 Objetivo

Implementar validação robusta de requisições com schemas e sanitização.

## 📋 Contexto Real

Dados inválidos causam problemas:
- Erros de processamento
- Vulnerabilidades de segurança
- Inconsistências de dados

## 📐 Requisitos

- [ ] Criar schemas de validação
- [ ] Validar body, query e params
- [ ] Sanitizar entrada
- [ ] Retornar erros detalhados
- [ ] Suportar validação customizada

## 🗂️ Estrutura dos Dados

```typescript
interface ValidationSchema {
  [field: string]: {
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => boolean;
  };
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  sanitized: unknown;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Valide antes de processar
- Mensagens de erro claras para o cliente
- Considere usar Zod ou Joi

---

**Dica:** Nunca confie na entrada do cliente - sempre valide e sanatize.