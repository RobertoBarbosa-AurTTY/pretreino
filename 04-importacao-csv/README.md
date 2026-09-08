# Desafio 4: Importação de CSV

## 🎯 Objetivo

Criar um serviço que importa dados de CSV, valida e salva em banco de dados.

## 📋 Contexto Real

O time comercial precisa importar uma planilha de clientes:
- Ler arquivo CSV
- Validar dados linha por linha
- Tratar erros de formatação
- Inserir registros válidos
- Gerar relatório de erros

## 📐 Requisitos

- [ ] Ler arquivo CSV com headers
- [ ] Validar campos obrigatórios
- [ ] Validar formato de email e CPF
- [ ] Tratar linhas com erro
- [ ] Gerar relatório de importação

## 🗂️ Estrutura dos Dados

```typescript
interface ClienteCSV {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

interface ResultadoImportacao {
  totalLinhas: number;
  importados: number;
  erros: ErroImportacao[];
}

interface ErroImportacao {
  linha: number;
  campo: string;
  erro: string;
  valor: string;
}
```

## 💡 Exemplo de Uso

```typescript
const resultado = await importarCSV("clientes.csv");
console.log(`Importados: ${resultado.importados}`);
console.log(`Erros: ${resultado.erros.length}`);
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

- Use regex para validação de email/CPF
- Trate diferentes separadores (virgula, ponto-virgula)
- Considere encoding do arquivo (UTF-8, ISO-8859-1)
- Log detalhado para debugging

---

**Dica:** Sempre valide dados de entrada antes de processar. Dados inválidos podem quebrar o sistema.
