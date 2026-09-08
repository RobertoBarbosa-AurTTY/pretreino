# Desafio 5: Monitoramento de Estoque

## 🎯 Objetivo

Criar um sistema que monitora estoque e envia alertas quando produtos atingirem nível mínimo.

## 📋 Contexto Real

O time de logística precisa:
- Monitorar estoque em tempo real
- Alertar quando estoque baixo
- Sugerir reposição automática
- Gerar relatório de movimentação

## 📐 Requisitos

- [ ] Verificar estoque de produtos
- [ ] Configurar nível mínimo por produto
- [ ] Enviar alerta quando estoque baixo
- [ ] Calcular quantidade sugerida para reposição
- [ ] Log de todas as movimentações

## 🗂️ Estrutura dos Dados

```typescript
interface Produto {
  id: string;
  nome: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  preco: number;
}

interface AlertaEstoque {
  produtoId: string;
  produtoNome: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  quantidadeSugerida: number;
  nivel: "critico" | "baixo" | "normal";
}

interface MovimentacaoEstoque {
  produtoId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
  motivo: string;
}
```

## 💡 Exemplo de Uso

```typescript
const produtos = await carregarProdutos();
const alertas = verificarEstoque(produtos);

for (const alerta of alertas) {
  console.log(`⚠️ ${alerta.produtoNome}: ${alerta.estoqueAtual} unidades`);
  await enviarAlerta(alerta);
}
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

- Use enum para níveis de alerta
- Implemente notificação (email, webhook, etc.)
- Considere sazonalidade no cálculo de reposição
- Mantenha histórico de movimentações

---

**Dica:** Nível crítico = estoque < mínimo/2. Nível baixo = estoque < mínimo.
