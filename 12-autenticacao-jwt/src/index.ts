/**
 * Desafio 12: Autenticação JWT
 * 
 * API de autenticação completa com JWT.
 */

import { 
  login, 
  validarToken, 
  refresh, 
  logout,
  isAdmin 
} from "./auth.service.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3000");

// Dados de exemplo
const dadosProtegidos = [
  { id: 1, titulo: "Documento Secreto", conteudo: "Conteúdo confidencial" },
  { id: 2, titulo: "Relatório Anual", conteudo: "Dados financeiros" }
];

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // CORS
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // POST /api/login
  if (path === "/api/login" && method === "POST") {
    try {
      const body = await req.json();
      const { email, senha } = body;

      if (!email || !senha) {
        return new Response(
          JSON.stringify({ error: "Email e senha são obrigatórios" }),
          { status: 400, headers }
        );
      }

      const resultado = await login(email, senha);

      if (!resultado.success) {
        return new Response(
          JSON.stringify({ error: resultado.error }),
          { status: 401, headers }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Login realizado com sucesso",
          token: resultado.token,
          refreshToken: resultado.refreshToken
        }),
        { status: 200, headers }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "JSON inválido" }),
        { status: 400, headers }
      );
    }
  }

  // POST /api/refresh
  if (path === "/api/refresh" && method === "POST") {
    try {
      const body = await req.json();
      const { refreshToken } = body;

      if (!refreshToken) {
        return new Response(
          JSON.stringify({ error: "Refresh token é obrigatório" }),
          { status: 400, headers }
        );
      }

      const resultado = await refresh(refreshToken);

      if (!resultado.success) {
        return new Response(
          JSON.stringify({ error: resultado.error }),
          { status: 401, headers }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Token renovado",
          token: resultado.token,
          refreshToken: resultado.refreshToken
        }),
        { status: 200, headers }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "JSON inválido" }),
        { status: 400, headers }
      );
    }
  }

  // POST /api/logout
  if (path === "/api/logout" && method === "POST") {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token não fornecido" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    logout(token);

    return new Response(
      JSON.stringify({ message: "Logout realizado com sucesso" }),
      { status: 200, headers }
    );
  }

  // GET /api/profile
  if (path === "/api/profile" && method === "GET") {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token não fornecido" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await validarToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Token inválido ou expirado" }),
        { status: 401, headers }
      );
    }

    return new Response(
      JSON.stringify({
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      }),
      { status: 200, headers }
    );
  }

  // GET /api/documents (rota protegida)
  if (path === "/api/documents" && method === "GET") {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token não fornecido" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await validarToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Token inválido ou expirado" }),
        { status: 401, headers }
      );
    }

    return new Response(
      JSON.stringify(dadosProtegidos),
      { status: 200, headers }
    );
  }

  // DELETE /api/admin/users/:id (rota admin)
  if (path.startsWith("/api/admin/users/") && method === "DELETE") {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token não fornecido" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await validarToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Token inválido ou expirado" }),
        { status: 401, headers }
      );
    }

    if (!isAdmin(payload)) {
      return new Response(
        JSON.stringify({ error: "Acesso negado. Apenas admins." }),
        { status: 403, headers }
      );
    }

    const userId = path.split("/")[4];
    return new Response(
      JSON.stringify({ message: `Usuário ${userId} deletado` }),
      { status: 200, headers }
    );
  }

  // Health check
  if (path === "/health") {
    return new Response(
      JSON.stringify({ status: "ok", service: "auth-jwt" }),
      { status: 200, headers }
    );
  }

  return new Response(
    JSON.stringify({ error: "Endpoint não encontrado" }),
    { status: 404, headers }
  );
}

console.log(`🚀 Auth API rodando em http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   POST /api/login`);
console.log(`   POST /api/refresh`);
console.log(`   POST /api/logout`);
console.log(`   GET  /api/profile`);
console.log(`   GET  /api/documents`);
console.log(`   DELETE /api/admin/users/:id`);

Deno.serve({ port: PORT }, handler);
