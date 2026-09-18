/**
 * Challenge 13: SQLite Database
 * 
 * REST API with CRUD operations on the database.
 */

import { 
  listAll, 
  findById, 
  create, 
  update, 
  remove,
  createTable 
} from "./database.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3001");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // GET /api/usuarios
  if (path === "/api/usuarios" && method === "GET") {
    const users = listAll();
    return new Response(JSON.stringify(users), { status: 200, headers });
  }

  // GET /api/usuarios/:id
  if (path.startsWith("/api/usuarios/") && method === "GET") {
    const id = parseInt(path.split("/")[3]);
    const user = findById(id);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers }
      );
    }
    
    return new Response(JSON.stringify(user), { status: 200, headers });
  }

  // POST /api/usuarios
  if (path === "/api/usuarios" && method === "POST") {
    try {
      const body = await req.json();
      
      if (!body.nome || !body.email) {
        return new Response(
          JSON.stringify({ error: "Name and email are required" }),
          { status: 400, headers }
        );
      }
      
      const user = create(body);
      return new Response(JSON.stringify(user), { status: 201, headers });
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers }
      );
    }
  }

  // PUT /api/usuarios/:id
  if (path.startsWith("/api/usuarios/") && method === "PUT") {
    try {
      const id = parseInt(path.split("/")[3]);
      const body = await req.json();
      
      const user = update(id, body);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(user), { status: 200, headers });
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers }
      );
    }
  }

  // DELETE /api/usuarios/:id
  if (path.startsWith("/api/usuarios/") && method === "DELETE") {
    const id = parseInt(path.split("/")[3]);
    const success = remove(id);
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "User deleted" }),
      { status: 200, headers }
    );
  }

  return new Response(
    JSON.stringify({ error: "Endpoint not found" }),
    { status: 404, headers }
  );
}

createTable();

console.log(`🚀 SQLite API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET    /api/usuarios`);
console.log(`   GET    /api/usuarios/:id`);
console.log(`   POST   /api/usuarios`);
console.log(`   PUT    /api/usuarios/:id`);
console.log(`   DELETE /api/usuarios/:id`);

Deno.serve({ port: PORT }, handler);
