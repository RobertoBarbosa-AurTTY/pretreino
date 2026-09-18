/**
 * Challenge 16: WebSocket
 * 
 * WebSocket server for real-time chat.
 */

import {
  generateId,
  addClient,
  removeClient,
  broadcast,
  joinRoom,
  listUsersInRoom,
  getStats
} from "./websocket.service.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3004");

// HTTP server for health check
async function httpHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (url.pathname === "/health") {
    const stats = getStats();
    return new Response(
      JSON.stringify({ status: "ok", ...stats }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  return new Response(
    JSON.stringify({ error: "Use WebSocket at ws://localhost:" + PORT }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}

// WebSocket handler
function websocketHandler(req: Request): Response {
  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  
  const clientId = generateId();
  let username = `user_${clientId.substring(0, 4)}`;
  let room = "geral";
  
  ws.onopen = () => {
    // Add client
    addClient({
      id: clientId,
      ws,
      room,
      username,
      lastActivity: Date.now()
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: "message",
      content: `Welcome to the chat! You are in room: ${room}`,
      sender: "system",
      timestamp: new Date().toISOString()
    }));
    
    // Broadcast entry
    broadcast({
      type: "message",
      content: `${username} joined the chat`,
      sender: "system",
      room,
      timestamp: new Date().toISOString()
    }, clientId);
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "message":
          // Send message to room
          broadcast({
            type: "message",
            content: data.content,
            sender: username,
            room,
            timestamp: new Date().toISOString()
          });
          break;
          
        case "join":
          // Join room
          const newRoom = data.room || "geral";
          
          broadcast({
            type: "message",
            content: `${username} left the room`,
            sender: "system",
            room,
            timestamp: new Date().toISOString()
          }, clientId);
          
          joinRoom(clientId, newRoom);
          room = newRoom;
          
          ws.send(JSON.stringify({
            type: "message",
            content: `You joined the room: ${newRoom}`,
            sender: "system",
            timestamp: new Date().toISOString()
          }));
          
          broadcast({
            type: "message",
            content: `${username} joined the room`,
            sender: "system",
            room: newRoom,
            timestamp: new Date().toISOString()
          }, clientId);
          break;
          
        case "users":
          // List users in room
          const users = listUsersInRoom(room);
          ws.send(JSON.stringify({
            type: "users",
            users: users,
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
          // Update username
          const oldUsername = username;
          username = data.username || username;
          
          broadcast({
            type: "message",
            content: `${oldUsername} is now ${username}`,
            sender: "system",
            room,
            timestamp: new Date().toISOString()
          });
          break;
          
        default:
          ws.send(JSON.stringify({
            type: "error",
            content: `Unknown type: ${data.type}`,
            timestamp: new Date().toISOString()
          }));
      }
    } catch {
      ws.send(JSON.stringify({
        type: "error",
        content: "Invalid JSON",
        timestamp: new Date().toISOString()
      }));
    }
  };
  
  ws.onclose = () => {
    broadcast({
      type: "message",
      content: `${username} left the chat`,
      sender: "system",
      room,
      timestamp: new Date().toISOString()
    });
    
    removeClient(clientId);
  };
  
  ws.onerror = (error) => {
    console.error(`❌ WebSocket error:`, error);
    removeClient(clientId);
  };
  
  return response;
}

// Start server
console.log(`🚀 WebSocket Server running at ws://localhost:${PORT}`);
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
