/**
 * Desafio 18: Error Handling
 * 
 * API com tratamento de erros centralizado.
 */

import { 
  AppError, 
  ValidationError, 
  NotFoundError,
  UnauthorizedError,
  handleError 
} from "./errors.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3006");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

// Dados simulados
const usuarios = [
  { id: 1, nome: "João", email: "joao@email.com" },
  { id: 2, nome: "Maria", email: "maria@email.com" }
];

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    // GET /api/usuarios
    if (path === "/api/usuarios" && method === "GET") {
      return new Response(
        JSON.stringify(usuarios),
        { status: 200, headers }
      );
    }

    // GET /api/usuarios/:id
    if (path.startsWith("/api/usuarios/") && method === "GET") {
      const id = parseInt(path.split("/")[3]);
      
      if (isNaN(id)) {
        throw new ValidationError("ID deve ser um número");
      }
      
      const usuario = usuarios.find(u => u.id === id);
      
      if (!usuario) {
        throw new NotFoundError("Usuário", id);
      }
      
      return new Response(
        JSON.stringify(usuario),
        { status: 200, headers }
      );
    }

    // POST /api/usuarios
    if (path === "/api/usuarios" && method === "POST") {
      const body = await req.json();
      
      if (!body.nome || !body.email) {
        throw new ValidationError("Nome e email são obrigatórios", {
          campos: ["nome", "email"]
        });
      }
      
      if (usuarios.some(u => u.email === body.email)) {
        throw new AppError("Email já cadastrado", "CONFLICT" as any);
      }
      
      const novoUsuario = {
        id: usuarios.length + 1,
        ...body
      };
      
      usuarios.push(novoUsuario);
      
      return new Response(
        JSON.stringify(novoUsuario),
        { status: 201, headers }
      );
    }

    // GET /api/protected (rota que exige auth)
    if (path === "/api/protected" && method === "GET") {
      const authHeader = req.headers.get("Authorization");
      
      if (!authHeader) {
        throw new UnauthorizedError("Token de autenticação necessário");
      }
      
      if (!authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Formato de token inválido");
      }
      
      return new Response(
        JSON.stringify({ message: "Acesso autorizado", dados: "secreto" }),
        { status: 200, headers }
      );
    }

    // GET /api/error (força erro 500)
    if (path === "/api/error" && method === "GET") {
      throw new Error("Erro simulado do servidor");
    }

    // GET /health
    if (path === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", service: "error-handling" }),
        { status: 200, headers }
      );
    }

    // Endpoint não encontrado
    throw new NotFoundError("Endpoint", path);

  } catch (error) {
    return handleError(error);
  }
}

console.log(`🚀 Error Handling API rodando em http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET /api/usuarios`);
console.log(`   GET /api/usuarios/:id`);
console.log(`   POST /api/usuarios`);
console.log(`   GET /api/protected`);
console.log(`   GET /api/error`);

Deno.serve({ port: PORT }, handler);
