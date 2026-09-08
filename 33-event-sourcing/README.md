# Desafio 33: Event Sourcing

## 🎯 Objetivo

Implementar padrão Event Sourcing para manter histórico completo de mudanças de estado.

## 📋 Contexto Real

Sistemas que precisam de auditoria completa:
- Sistema bancário
- E-commerce com histórico de pedidos
- CRMs com trilha de alterações

## 📐 Requisitos

- [ ] Criar Event Store
- [ ] Armazenar eventos imutáveis
- [ ] Reconstruir estado a partir de eventos
- [ ] Implementar snapshotting
- [ ] Criar projeções

## 🗂️ Estrutura dos Dados

```typescript
interface Event {
  id: string;
  aggregateId: string;
  tipo: string;
  dados: unknown;
  timestamp: string;
  version: number;
}

interface Aggregate {
  id: string;
  version: number;
  events: Event[];
}

interface Snapshot {
  aggregateId: string;
  state: unknown;
  version: number;
  timestamp: string;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Eventos são imutáveis
- Cada evento representa uma mudança de estado
- Snapshots otimizam reconstrução de estado

---

**Dica:** Eventos devem descrever o que aconteceu, não o que deve acontecer.