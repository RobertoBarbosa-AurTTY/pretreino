# Desafio 02: Relatório de Vendas

**Dificuldade:** ⭐

## 🎯 Objetivo

Criar um gerador de relatórios de vendas com filtro por período, agregações por
vendedor e exportação para CSV.

## 📋 Contexto Real

O time de vendas precisa de um relatório mensal que:

- Agrupe as vendas por vendedor
- Calcule o total de vendas do período
- Identifique os top performers
- Seja exportado para CSV

## 📐 Requisitos

Arquivo: `src/report.service.ts`

- [ ] `loadSales(filePath)` lê um CSV separado por `;` com cabeçalho
      `id;seller;product;amount;date` e converte `amount` para `number`
- [ ] `loadSales` ignora linhas vazias e linhas com `amount` vazio ou não
      numérico
- [ ] `filterByPeriod(sales, start, end)` retorna as vendas com `date` entre
      `start` e `end`, **inclusive**
- [ ] `generateReport(sales, start, end)` considera só as vendas do período e
      retorna um `SellerReport` por vendedor com `totalSales`, `salesCount` e
      `averageTicket` (`totalSales / salesCount`)
- [ ] `sellers` vem ordenado por `totalSales` decrescente e `topSellers` contém
      os 3 primeiros
- [ ] `overallTotal` é a soma das vendas do período e `period` repete
      `{ start, end }`
- [ ] Sem vendas no período: `sellers` e `topSellers` vazios e
      `overallTotal = 0`
- [ ] `exportCSV(data, fileName)` grava o cabeçalho
      `seller;totalSales;salesCount;averageTicket` e uma linha por vendedor, com
      valores monetários com 2 casas decimais (ex.: `Maria;6500.00;1;6500.00`),
      criando a pasta de destino se necessário
- [ ] `src/index.ts`: pipeline carregar → gerar relatório → exportar, exibindo o
      top vendedor no console

## 🗂️ Estrutura dos Dados

```typescript
export interface Sale {
  id: string;
  seller: string;
  product: string;
  amount: number;
  date: string;
}

export interface SellerReport {
  seller: string;
  totalSales: number;
  salesCount: number;
  averageTicket: number;
}

export interface CompleteReport {
  period: { start: string; end: string };
  sellers: SellerReport[];
  topSellers: SellerReport[];
  overallTotal: number;
}
```

Dados de exemplo: `data/vendas.csv`.

## 💡 Exemplo de Uso

```typescript
import { exportCSV, generateReport, loadSales } from "./report.service.ts";

const sales = await loadSales("./data/vendas.csv");
const report = generateReport(sales, "2024-01-01", "2024-01-31");
console.log(`Top vendedor: ${report.topSellers[0]?.seller}`);
await exportCSV(report.sellers, "./output/relatorio-janeiro.csv");
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [`Array.prototype.reduce()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [`Array.prototype.sort()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [`Number.prototype.toFixed()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)
- [`Intl.NumberFormat` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Ler e escrever arquivos no Deno](https://docs.deno.com/examples/writing_files/)

## 📝 Notas

- Datas no formato `YYYY-MM-DD` podem ser comparadas como string.
- Separe filtro, agregação e exportação em funções puras para reaproveitar.
- Para exibir no console, formate como moeda brasileira com
  `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`; no CSV
  mantenha o formato numérico com ponto.
- Extra: `data/vendedores.json` traz a meta (`goal`) de cada vendedor; compare o
  total vendido com a meta.

---

**Dica:** Separe as funções de filtro, agregação e exportação para maior
reutilização.
