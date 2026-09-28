# Desafio 16: WebSocket

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar o gerenciamento de clientes de um chat em tempo real com WebSocket:
registro de conexões, salas, broadcast e mensagens diretas.

## 📋 Contexto Real

Chats, notificações ao vivo, dashboards e jogos multiplayer mantêm uma conexão
aberta com cada cliente. O servidor precisa saber quem está conectado, em qual
sala, e enviar mensagens só para quem deve recebê-las, sem quebrar quando um
socket fecha no meio do caminho.

O servidor em `src/index.ts` (upgrade HTTP → WebSocket em `/ws` e tratamento das
mensagens `message`, `join`, `users`, `ping`, `username`) já está montado; seu
trabalho é o `src/websocket.service.ts`.

## 📐 Requisitos

- [ ] `generateId()` retorna ids únicos (string com pelo menos 8 caracteres)
- [ ] `addClient(client)` registra o cliente; `removeClient(id)` remove e não
      lança erro para id desconhecido
- [ ] `broadcast(message, excludeId?)` envia `JSON.stringify(message)` para
      todos os clientes da sala `message.room` (sem `room`: para todos os
      clientes), exceto o `excludeId`
- [ ] `broadcast` e `sendToClient` só chamam `ws.send` quando
      `ws.readyState === WebSocket.OPEN`
- [ ] `sendToClient(id, message)` envia só para aquele cliente; id desconhecido
      é ignorado sem erro
- [ ] `joinRoom(id, room)` move o cliente para a nova sala
- [ ] `listUsersInRoom(room)` retorna os `username` dos clientes da sala (lista
      vazia se não houver)
- [ ] `getStats()` retorna `totalClients` e `totalRooms` (salas com pelo menos
      um cliente)

## 🗂️ Estrutura dos Dados

```typescript
export interface WebSocketMessage {
  type: "message" | "join" | "leave" | "ping" | "pong" | "users" | "error";
  room?: string;
  content?: string;
  sender?: string;
  users?: string[];
  timestamp?: string;
}

export interface Client {
  id: string;
  ws: WebSocket;
  room: string;
  username: string;
  lastActivity: number;
}
```

### Mensagens aceitas pelo servidor (`src/index.ts`)

| `type`     | Campos     | Efeito                      |
| ---------- | ---------- | --------------------------- |
| `message`  | `content`  | Broadcast para a sala atual |
| `join`     | `room`     | Troca de sala               |
| `users`    | -          | Lista usuários da sala      |
| `ping`     | -          | Responde `pong` (heartbeat) |
| `username` | `username` | Troca o nome exibido        |

## 💡 Exemplo de Uso

```typescript
import {
  addClient,
  broadcast,
  generateId,
  listUsersInRoom,
} from "./src/websocket.service.ts";

addClient({
  id: generateId(),
  ws,
  room: "geral",
  username: "ana",
  lastActivity: Date.now(),
});
listUsersInRoom("geral"); // ["ana"]
broadcast({ type: "message", content: "Olá!", sender: "ana", room: "geral" });
```

```bash
# Com wscat (npm i -g wscat) ou pelo console do navegador
wscat -c ws://localhost:3004/ws
> {"type":"join","room":"dev"}
> {"type":"message","content":"Olá!"}
```

## ⚙️ Setup

```bash
cd 16-websocket
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [WebSocket API](https://developer.mozilla.org/pt-BR/docs/Web/API/WebSocket)
- [WebSocket.readyState](https://developer.mozilla.org/pt-BR/docs/Web/API/WebSocket/readyState)
- [Deno.upgradeWebSocket](https://docs.deno.com/api/deno/~/Deno.upgradeWebSocket)
- [Deno: servidor WebSocket](https://docs.deno.com/examples/http_server_websocket/)
- [Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)

## 📝 Notas

- Extra: desconectar clientes inativos (heartbeat com `lastActivity`), limite de
  conexões, histórico das últimas mensagens por sala, autenticação na conexão.
