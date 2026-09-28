# Desafio 05: Monitoramento de Estoque

**Dificuldade:** ⭐

## 🎯 Objetivo

Criar um sistema que aplica as movimentações de estoque, classifica o nível de
cada produto e emite alertas com a quantidade sugerida para reposição.

## 📋 Contexto Real

O time de logística precisa:

- Registrar entradas e saídas de estoque
- Ser alertado quando um produto estiver com estoque baixo
- Receber uma sugestão de quantidade para reposição

## 📐 Requisitos

Arquivo: `src/stock.service.ts`

- [ ] `classifyLevel(currentStock, minStock)` retorna:
  - `"critico"` se `currentStock < minStock / 2`
  - `"baixo"` se `currentStock < minStock`
  - `"normal"` caso contrário
- [ ] `calculateRestockQuantity(currentStock, maxStock)` retorna
      `maxStock - currentStock`, nunca negativo
- [ ] `checkStock(products)` retorna um `StockAlert` para cada produto com nível
      diferente de `"normal"`, na mesma ordem da lista, com `suggestedQuantity`
      calculado por `calculateRestockQuantity`
- [ ] `applyMovements(products, movements)` retorna uma **nova** lista com o
      estoque atualizado (`entrada` soma, `saida` subtrai), sem alterar a lista
      original
- [ ] `applyMovements` lança erro se uma `saida` deixar o estoque negativo ou se
      o `productId` não existir
- [ ] `sendAlert(alert)` simula a notificação (log no console) e retorna `true`;
      para alertas de nível `"normal"` não notifica e retorna `false`
- [ ] `loadProducts(filePath)` e `loadMovements(filePath)` leem os arquivos
      JSON; se o arquivo não existir, o erro é propagado
- [ ] `src/index.ts`: carregar → aplicar movimentações (log de cada uma) →
      verificar → enviar alertas → exibir resumo

## 🗂️ Estrutura dos Dados

```typescript
export interface Product {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
}

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  suggestedQuantity: number;
  level: "critico" | "baixo" | "normal";
}

export interface StockMovement {
  productId: string;
  type: "entrada" | "saida";
  quantity: number;
  date: string;
  reason: string;
}
```

Dados de exemplo: `data/produtos.json` e `data/movimentacoes.json`.

## 💡 Exemplo de Uso

```typescript
import {
  applyMovements,
  checkStock,
  loadMovements,
  loadProducts,
  sendAlert,
} from "./stock.service.ts";

const products = await loadProducts("./data/produtos.json");
const movements = await loadMovements("./data/movimentacoes.json");
const updated = applyMovements(products, movements);

for (const alert of checkStock(updated)) {
  console.log(`⚠️ ${alert.productName}: ${alert.currentStock} unidades`);
  await sendAlert(alert);
}
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Funções puras e imutabilidade — spread (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [`Array.prototype.map()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`Array.prototype.filter()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [Tipos literais / union types (TypeScript)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
- [`JSON.parse()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

## 📝 Notas

- Mantenha as regras de negócio em funções puras: fica fácil testar.
- Extra: envie o alerta por email/webhook de verdade em vez de só logar.
- Extra: considere sazonalidade no cálculo de reposição.

---

**Dica:** Nível crítico = estoque < mínimo/2. Nível baixo = estoque < mínimo.
