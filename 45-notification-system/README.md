# Desafio 45: Notification System

## 🎯 Objetivo

Implementar sistema multi-canal de notificações (email, SMS, push).

## 📋 Contexto Real

Comunicação com usuários:
- Alertas importantes
- Marketing
- Transações

## 📐 Requisitos

- [ ] Suportar múltiplos canais
- [ ] Criar templates
- [ ] Implementar fila de envio
- [ ] Preferências do usuário
- [ ] Métricas por canal

## 🗂️ Estrutura dos Dados

```typescript
interface Notification {
  id: string;
  userId: string;
  channel: "email" | "sms" | "push";
  template: string;
  data: Record<string, unknown>;
  status: "pending" | "sent" | "failed";
}

interface UserPreferences {
  userId: string;
  channels: string[];
  quietHours?: { start: number; end: number };
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Respeite preferências do usuário
- Implemente rate limiting por canal
- Considere custos de SMS

---

**Dica:** Nunca envie notificações durante horário de silêncio.