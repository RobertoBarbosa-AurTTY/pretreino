# Fundamentos 09: Estruturas de Dados

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar do zero três estruturas que aparecem o tempo todo em backend — **LRU
cache**, **fila de prioridade (heap binário)** e **Trie** — entendendo o custo
(big-O) de cada operação e por que as estruturas nativas do JavaScript (`Map`,
arrays) ajudam ou atrapalham.

## 🧠 Por que isso importa

- **LRU:** o desafio 08 (cache de API externa) remove entradas quando o cache
  enche, e o desafio 43 (response caching) pede explicitamente a estratégia LRU.
  Um LRU mal feito (ordenar por "último acesso" a cada `set`) vira O(n log n)
  por operação.
- **Fila de prioridade:** o desafio 09 (processamento de fila) e o 24 (fila de
  mensageria) processam jobs; quando há prioridades, reordenar o array inteiro a
  cada `push` é O(n log n) — um heap faz em O(log n). O desafio 21/48
  (schedulers) também precisa do "próximo job a vencer", que é um min-heap por
  horário.
- **Trie:** o autocomplete do desafio 47 (search engine) é exatamente
  `startsWith(prefix)`. Filtrar um array de palavras com `w.startsWith(p)` é
  O(total de palavras); a Trie só percorre o ramo do prefixo.

## 📖 Conceito

### Big-O em uma frase

Big-O descreve **como o custo cresce** quando `n` cresce, ignorando constantes.
O(1) não depende de `n`; O(log n) dobra `n` e soma um passo; O(n) dobra `n` e
dobra o custo.

| Estrutura        | Acesso por chave | Inserir  | Remover o "primeiro" |
| ---------------- | ---------------- | -------- | -------------------- |
| Array            | O(n) (busca)     | O(1) fim | O(n) (`shift`)       |
| `Map`            | O(1)             | O(1)     | O(1) (`delete`)      |
| Heap binário     | —                | O(log n) | O(log n)             |
| Trie (palavra m) | O(m)             | O(m)     | O(m)                 |

### LRU

Precisa de duas coisas em O(1): achar a entrada pela chave e mover a entrada
para "mais recente". Duas abordagens clássicas:

1. **`Map` do JavaScript:** ele **preserva a ordem de inserção**. Apagar e
   reinserir uma chave a move para o final; `map.keys().next()` é a mais antiga.
2. **Hash map + lista duplamente ligada:** o `Map` aponta para o nó, e o nó pode
   ser removido/movido para a cabeça em O(1) mexendo só em `prev`/`next`. É como
   se faz em linguagens sem um `Map` ordenado (e é ótimo exercício).

### Heap binário

Uma árvore binária **completa** guardada num array, onde cada pai é "menor"
(maior prioridade) que os filhos. Para o índice `i`:

```
pai(i)       = Math.floor((i - 1) / 2)
esquerdo(i)  = 2 * i + 1
direito(i)   = 2 * i + 2
```

- `push`: coloca no fim e **sobe** (_sift up_) trocando com o pai enquanto for
  menor.
- `pop`: tira a raiz, move o último para a raiz e **desce** (_sift down_)
  trocando com o menor filho.

Como a árvore é completa, a altura é `log2(n)` — daí o O(log n).

### Trie

Cada nó representa um prefixo e tem filhos por caractere; um marcador `isWord`
indica que o caminho até ali forma uma palavra inteira.

```
(raiz) ─ d ─ e ─ l ─ t ─ a*
              ├ n ─ o* ─ l ─ a ─ n ─ d*
              └ v* ─ o ─ p ─ s*
```

`startsWith("de")` desce até o nó `d → e` e coleta, em profundidade (DFS), todas
as palavras abaixo dele.

## ✍️ Exercícios

Arquivo: `src/structures.ts`

- [ ] `LRUCache<K, V>(capacity, onEvict?)`
  - [ ] `get`/`set`/`has`/`delete` em O(1); `capacity < 1` lança `RangeError`
  - [ ] `get` de chave existente a torna a mais recente; `has` **não** altera a
        ordem
  - [ ] `set` de chave existente atualiza o valor e a torna a mais recente
  - [ ] `set` de chave nova com cache cheio remove a menos recente e chama
        `onEvict(key, value)`
  - [ ] `keys()` devolve da menos recente para a mais recente; `size` é getter
- [ ] `PriorityQueue<T>(compare?)`
  - [ ] heap binário em array (sem `sort`)
  - [ ] `push`/`pop` O(log n), `peek`/`size`/`isEmpty` O(1)
  - [ ] padrão é min-heap; o comparador segue a convenção do `Array.sort`
  - [ ] `pop`/`peek` em fila vazia devolvem `undefined`
- [ ] `Trie`
  - [ ] `insert`/`has` em O(m), normalizando para minúsculas, sem duplicar
  - [ ] `has` só é `true` para palavras inteiras
  - [ ] `startsWith(prefix, limit?)` em ordem alfabética; `""` devolve todas
  - [ ] `delete(word)` remove só aquela palavra (limpar nós órfãos é bônus)
  - [ ] `size` conta palavras distintas

## 🔮 Preveja antes de rodar

**1.** Ordem de um `Map`

```ts
const m = new Map([["a", 1], ["b", 2], ["c", 3]]);
m.set("a", 10);
m.delete("b");
m.set("b", 20);
console.log([...m.keys()]);
```

**2.** `sort` padrão com números

```ts
console.log([10, 9, 1, 100].sort());
```

**3.** Heap como array

```ts
// min-heap após push de 5, 3, 8, 1 (nessa ordem), com sift up
// qual é o array interno?
```

**4.** Custo escondido

```ts
const queue = Array.from({ length: 100_000 }, (_, i) => i);
console.time("shift");
while (queue.length) queue.shift();
console.timeEnd("shift");
// comparado a um loop de 100_000 `pop()`, é mais rápido, igual ou mais lento?
```

<details><summary>Resposta</summary>

1. `["a", "c", "b"]` — `set` numa chave existente **não** muda a posição; só
   apagar e reinserir move para o fim.
2. `[1, 10, 100, 9]` — sem comparador, `sort` compara como **strings**.
3. `[1, 3, 8, 5]` — push 5 → `[5]`; push 3 sobe → `[3, 5]`; push 8 →
   `[3, 5, 8]`; push 1 entra no índice 3 (pai = 5), troca → `[3, 1, 8, 5]`,
   depois troca com a raiz → `[1, 3, 8, 5]`.
4. **Muito** mais lento — num teste com Deno 2, foram ~4 s de `shift` contra ~2
   ms de `pop`. `shift` precisa mover os elementos restantes (O(n) cada, O(n²)
   no total), enquanto `pop` é O(1). O V8 otimiza arrays pequenos, mas não conte
   com isso: filas grandes devem usar um índice de cabeça, um buffer circular ou
   uma lista ligada.

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

Enquanto as classes não estiverem implementadas, termina com `Not implemented`.

## 🚀 Desafio extra

1. Implemente o `LRUCache` das **duas** formas (com `Map` e com lista duplamente
   ligada) e compare o tempo de 1 milhão de operações com `performance.now()`.
2. Adicione TTL por entrada ao LRU e plugue-o no desafio 08 no lugar da remoção
   atual.
3. Faça a Trie devolver sugestões ordenadas por **frequência** (quantas vezes a
   palavra foi inserida) em vez de ordem alfabética — como no autocomplete do
   desafio 47.

## 📚 Referências

- [MDN — Map (ordem de iteração)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [javascript.info — Map and Set](https://javascript.info/map-set)
- [Wikipedia — Binary heap](https://en.wikipedia.org/wiki/Binary_heap)
- [Wikipedia — Trie](https://en.wikipedia.org/wiki/Trie)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
