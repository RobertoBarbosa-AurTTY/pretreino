# Desafio 40: Event Driven Architecture

## 🎯 Objetivo

Implementar arquitetura orientada a eventos com producers e consumers.

## 📋 Contexto Real

Sistemas desacoplados:
- Microserviços comunicando via eventos
- Processamento assíncrono
- Reação a mudanças de estado

## 📐 Requisitos

- [ ] Criar Event Bus
- [ ] Implementar producers
- [ ] Criar consumers
- [ ] Configurar dead letter queue
- [ ] Implementar replay de eventos

## 🗂️ Estrutura dos Dados

```typescript
interface Event {
  id: string;
  type: string;
  payload: unknown;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface EventHandler {
  handle(event: Event): Promise<void>;
}

interface EventBus {
  publish(event: Event): Promise<void>;
  subscribe(type: string, handler: EventHandler): void;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Eventos devem ser imutáveis
- Considere ordem de eventos
- Implemente idempotência no consumer

---

**Dica:** Eventos representam fatos, não comandos.