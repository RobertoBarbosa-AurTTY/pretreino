# Desafio 44: Webhook System

## 🎯 Objetivo

Implementar sistema completo de webhooks com registro, envio e retry.

## 📋 Contexto Real

Integrações entre sistemas:
- Notificações em tempo real
- Sincronização de dados
- Eventos de negócio

## 📐 Requisitos

- [ ] Criar registro de webhooks
- [ ] Enviar payloads assincronamente
- [ ] Implementar retry com backoff
- [ ] Validar assinatura
- [ ] Log de entregas

## 🗂️ Estrutura dos Dados

```typescript
interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: unknown;
  status: "pending" | "success" | "failed";
  attempts: number;
  lastError?: string;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Use HMAC para assinatura
- Implemente idempotência no receptor
- Limite taxa de envio

---

**Dica:** Sempre assine seus webhooks e valide no receptor.