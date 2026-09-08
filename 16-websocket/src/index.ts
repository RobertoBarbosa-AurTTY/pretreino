/**
 * Desafio 16: WebSocket
 * 
 * Servidor WebSocket para chat em tempo real.
 */

import {
  gerarId,
  adicionarCliente,
  removerCliente,
  broadcast,
  entrarNaSala,
  listarUsuariosNaSala,
  obterEstatisticas
} from "./websocket.service.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3004");

// Servidor HTTP para health check
async function httpHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (url.pathname === "/health") {
    const stats = obterEstatisticas();
    return new Response(
      JSON.stringify({ status: "ok", ...stats }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  return new Response(
    JSON.stringify({ error: "Use WebSocket em ws://localhost:" + PORT }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}

// Handler do WebSocket
function websocketHandler(req: Request): Response {
  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  
  const clientId = gerarId();
  let username = `user_${clientId.substring(0, 4)}`;
  let room = "geral";
  
  ws.onopen = () => {
    // Adicionar cliente
    adicionarCliente({
      id: clientId,
      ws,
      room,
      username,
      lastActivity: Date.now()
    });
    
    // Enviar boas-vindas
    ws.send(JSON.stringify({
      type: "message",
      content: `Bem-vindo ao chat! Você está na sala: ${room}`,
      sender: "sistema",
      timestamp: new Date().toISOString()
    }));
    
    // Broadcast entrada
    broadcast({
      type: "message",
      content: `${username} entrou no chat`,
      sender: "sistema",
      room,
      timestamp: new Date().toISOString()
    }, clientId);
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "message":
          // Enviar mensagem para sala
          broadcast({
            type: "message",
            content: data.content,
            sender: username,
            room,
            timestamp: new Date().toISOString()
          });
          break;
          
        case "join":
          // Entrar em sala
          const novaSala = data.room || "geral";
          
          broadcast({
            type: "message",
            content: `${username} saiu da sala`,
            sender: "sistema",
            room,
            timestamp: new Date().toISOString()
          }, clientId);
          
          entrarNaSala(clientId, novaSala);
          room = novaSala;
          
          ws.send(JSON.stringify({
            type: "message",
            content: `Você entrou na sala: ${novaSala}`,
            sender: "sistema",
            timestamp: new Date().toISOString()
          }));
          
          broadcast({
            type: "message",
            content: `${username} entrou na sala`,
            sender: "sistema",
            room: novaSala,
            timestamp: new Date().toISOString()
          }, clientId);
          break;
          
        case "users":
          // Listar usuários na sala
          const usuarios = listarUsuariosNaSala(room);
          ws.send(JSON.stringify({
            type: "users",
            users: usuarios,
            room,
            timestamp: new Date().toISOString()
          }));
          break;
          
        case "ping":
          // Heartbeat
          ws.send(JSON.stringify({
            type: "pong",
            timestamp: new Date().toISOString()
          }));
          break;
          
        case "username":
          // Atualizar username
          const antigoUsername = username;
          username = data.username || username;
          
          broadcast({
            type: "message",
            content: `${antigoUsername} agora é ${username}`,
            sender: "sistema",
            room,
            timestamp: new Date().toISOString()
          });
          break;
          
        default:
          ws.send(JSON.stringify({
            type: "error",
            content: `Tipo desconhecido: ${data.type}`,
            timestamp: new Date().toISOString()
          }));
      }
    } catch {
      ws.send(JSON.stringify({
        type: "error",
        content: "JSON inválido",
        timestamp: new Date().toISOString()
      }));
    }
  };
  
  ws.onclose = () => {
    broadcast({
      type: "message",
      content: `${username} saiu do chat`,
      sender: "sistema",
      room,
      timestamp: new Date().toISOString()
    });
    
    removerCliente(clientId);
  };
  
  ws.onerror = (error) => {
    console.error(`❌ Erro no WebSocket:`, error);
    removerCliente(clientId);
  };
  
  return response;
}

// Iniciar servidor
console.log(`🚀 WebSocket Server rodando em ws://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   WebSocket: ws://localhost:${PORT}`);
console.log(`   HTTP: http://localhost:${PORT}/health`);

Deno.serve({ port: PORT }, (req) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/ws") {
    return websocketHandler(req);
  }
  
  return httpHandler(req);
});
