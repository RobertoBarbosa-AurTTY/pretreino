# Desafio 16: WebSocket

## 🎯 Objetivo

Implementar comunicação em tempo real usando WebSocket.

## 📋 Requisitos

- [ ] Servidor WebSocket funcional
- [ ] Broadcast de mensagens
- [ ] Salas/rooms
- [ ] Reconexão automática
- [ ] Heartbeat/ping-pong

## 💡 Exemplo de Uso

```bash
# Conectar ao WebSocket
wscat -c ws://localhost:3000/ws

# Enviar mensagem
{"type":"message","content":"Olá!"}

# Entrar em sala
{"type":"join","room":"geral"}
```

## ⚙️ Setup

```bash
cd 16-websocket
deno task dev
```
