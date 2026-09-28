# Desafio 45: Notification System

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Construir um serviço de notificações multicanal (email, SMS, push) com
templates, preferências por usuário, horário de silêncio com fila de envio e
métricas por canal.

## 📋 Contexto Real

Apps avisam o usuário sobre pedidos, pagamentos e alertas por vários canais. Um
bom sistema de notificações:

- Respeita os canais que o usuário aceitou receber
- Não acorda ninguém de madrugada (horário de silêncio)
- Separa o **conteúdo** (templates) da **entrega** (provedores de
  email/SMS/push)
- Mede entregas e falhas por canal (SMS custa dinheiro!)

## 📐 Requisitos

- [ ] `renderTemplate(template, data)` troca cada `{{chave}}` (espaços internos
      permitidos, ex: `{{ chave }}`) por `String(data[chave])`; placeholders sem
      valor em `data` ficam como estão
- [ ] `getPreferences(userId)` retorna as preferências salvas ou, se não houver,
      `{ userId, channels: ["email", "sms", "push"] }` (sem `quietHours`)
- [ ] `setPreferences(userId, prefs)` substitui as preferências do usuário
- [ ] `send(n)` retorna a `Notification` com `id` único e `status`:
  - `"sent"`: chamou o `ChannelSender` do canal com a mensagem renderizada
  - `"failed"` (com `error`): canal fora de `prefs.channels`, nenhum sender
    configurado para o canal, ou o sender lançou erro (use a mensagem dele)
  - `"pending"`: a hora atual (`now().getHours()`) está dentro de `quietHours` —
    não envia agora, coloca na fila
- [ ] `quietHours` vai de `start` (inclusive) a `end` (exclusive) e pode virar a
      noite: `{ start: 22, end: 7 }` cobre 22h–6h59
- [ ] `processQueue()` tenta enviar as notificações pendentes cujo usuário não
      está mais em silêncio e retorna as que foram processadas (já com o status
      final); as que continuam em silêncio permanecem na fila
- [ ] `getStats()` retorna `{ sent, failed }` para **cada** canal (`email`,
      `sms`, `push`), inclusive os que ainda não foram usados
- [ ] `src/index.ts`: cria o serviço com senders que só fazem `console.log`, usa
      `QUIET_HOURS_START`/`QUIET_HOURS_END` do `.env` como preferência de um
      usuário de exemplo e envia algumas notificações

## 🗂️ Estrutura dos Dados

```typescript
type Channel = "email" | "sms" | "push";

interface Notification {
  id: string;
  userId: string;
  channel: Channel;
  template: string;
  data: Record<string, unknown>;
  status: "pending" | "sent" | "failed";
  error?: string;
}

interface UserPreferences {
  userId: string;
  channels: Channel[];
  /** Horas locais (0–23): de `start` (inclusive) até `end` (exclusive). */
  quietHours?: { start: number; end: number };
}

/** Função que efetivamente entrega a mensagem em um canal. */
type ChannelSender = (
  notification: Notification,
  message: string,
) => Promise<void>;

interface NotificationServiceOptions {
  senders?: Partial<Record<Channel, ChannelSender>>;
  /** Relógio injetável (padrão: `() => new Date()`). */
  now?: () => Date;
}

interface ChannelStats {
  sent: number;
  failed: number;
}

interface NotificationService {
  send(
    notification: Omit<Notification, "id" | "status">,
  ): Promise<Notification>;
  getPreferences(userId: string): UserPreferences;
  setPreferences(userId: string, prefs: UserPreferences): void;
  processQueue(): Promise<Notification[]>;
  getStats(): Record<Channel, ChannelStats>;
}
```

## 💡 Exemplo de Uso

```typescript
import { createService, renderTemplate } from "./notification.service.ts";

const service = createService({
  senders: {
    email: async (n, message) =>
      console.log(`[email → ${n.userId}] ${message}`),
    sms: async (n, message) => console.log(`[sms → ${n.userId}] ${message}`),
  },
});

service.setPreferences("u1", {
  userId: "u1",
  channels: ["email"],
  quietHours: { start: 22, end: 7 },
});

const n = await service.send({
  userId: "u1",
  channel: "email",
  template: "Olá {{name}}, seu pedido {{orderId}} saiu para entrega",
  data: { name: "João", orderId: 42 },
});
console.log(n.status); // "sent" ou "pending" (se for de madrugada)

setInterval(() => service.processQueue(), 60_000);
console.log(service.getStats());
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [String.prototype.replace com função (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
- [Date.prototype.getHours (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/getHours)
- [Injeção de dependência (Wikipedia)](https://pt.wikipedia.org/wiki/Inje%C3%A7%C3%A3o_de_depend%C3%AAncia)
- [Record<Keys, Type> (TypeScript)](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)

## 📝 Notas

- Os senders são injetados: em produção seriam SendGrid, Twilio, FCM... (o
  endpoint `POST /api/emails` da [mock API](../API.md) é uma opção para
  experimentar um sender de email real — veja o desafio 03)
- Extra: rate limiting por canal e retry de falhas temporárias
- Extra: fallback de canal (push falhou → email)
