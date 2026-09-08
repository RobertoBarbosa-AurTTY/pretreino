# Desafio 2: Relatório de Vendas

## 🎯 Objetivo

Criar um gerador de relatórios de vendas com filtros, agregações e exportação.

## 📋 Contexto Real

O time de vendas precisa de um relatório mensal que:
- Agrupar vendas por vendedor
- Calcular total de vendas por período
- Identificar top performers
- Exportar para CSV

## 📐 Requisitos

- [ ] Filtrar vendas por período (data início e fim)
- [ ] Agrupar por vendedor
- [ ] Calcular métricas (total, média, quantidade)
- [ ] Identificar top 3 vendedores
- [ ] Exportar para CSV

## 🗂️ Estrutura dos Dados

```typescript
interface Venda {
  id: string;
  vendedor: string;
  produto: string;
  valor: number;
  data: string;
}

interface RelatorioVendedor {
  vendedor: string;
  totalVendas: number;
  quantidadeVendas: number;
  ticketMedio: number;
}
```

## 💡 Exemplo de Uso

```typescript
const vendas = await carregarVendas();
const relatorio = gerarRelatorio(vendas, "2024-01-01", "2024-01-31");
console.log(`Top vendedor: ${relatorio.topVendedores[0].vendedor}`);
await exportarCSV(relatorio.vendedores, "relatorio-janeiro.csv");
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

- Use `Array.prototype.reduce()` para agregar dados
- Considere performance com grandes volumes
- Trate valores nulos ou inválidos
- Formate números para moeda brasileira

---

**Dica:** Separe as funções de filtro, agregação e exportação para maior reutilização.
