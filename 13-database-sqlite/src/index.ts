/**
 * Desafio 13: Database SQLite
 * 
 * API REST com operações CRUD no banco de dados.
 */

import { 
  listarTodos, 
  buscarPorId, 
  criar, 
  atualizar, 
  deletar,
  criarTabela 
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
    const usuarios = listarTodos();
    return new Response(JSON.stringify(usuarios), { status: 200, headers });
  }

  // GET /api/usuarios/:id
  if (path.startsWith("/api/usuarios/") && method === "GET") {
    const id = parseInt(path.split("/")[3]);
    const usuario = buscarPorId(id);
    
    if (!usuario) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404, headers }
      );
    }
    
    return new Response(JSON.stringify(usuario), { status: 200, headers });
  }

  // POST /api/usuarios
  if (path === "/api/usuarios" && method === "POST") {
    try {
      const body = await req.json();
      
      if (!body.nome || !body.email) {
        return new Response(
          JSON.stringify({ error: "Nome e email são obrigatórios" }),
          { status: 400, headers }
        );
      }
      
      const usuario = criar(body);
      return new Response(JSON.stringify(usuario), { status: 201, headers });
    } catch {
      return new Response(
        JSON.stringify({ error: "JSON inválido" }),
        { status: 400, headers }
      );
    }
  }

  // PUT /api/usuarios/:id
  if (path.startsWith("/api/usuarios/") && method === "PUT") {
    try {
      const id = parseInt(path.split("/")[3]);
      const body = await req.json();
      
      const usuario = atualizar(id, body);
      
      if (!usuario) {
        return new Response(
          JSON.stringify({ error: "Usuário não encontrado" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(usuario), { status: 200, headers });
    } catch {
      return new Response(
        JSON.stringify({ error: "JSON inválido" }),
        { status: 400, headers }
      );
    }
  }

  // DELETE /api/usuarios/:id
  if (path.startsWith("/api/usuarios/") && method === "DELETE") {
    const id = parseInt(path.split("/")[3]);
    const sucesso = deletar(id);
    
    if (!sucesso) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404, headers }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "Usuário deletado" }),
      { status: 200, headers }
    );
  }

  return new Response(
    JSON.stringify({ error: "Endpoint não encontrado" }),
    { status: 404, headers }
  );
}

criarTabela();

console.log(`🚀 SQLite API rodando em http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET    /api/usuarios`);
console.log(`   GET    /api/usuarios/:id`);
console.log(`   POST   /api/usuarios`);
console.log(`   PUT    /api/usuarios/:id`);
console.log(`   DELETE /api/usuarios/:id`);

Deno.serve({ port: PORT }, handler);
