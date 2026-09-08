/**
 * Desafio 17: Validação com Zod
 * 
 * API com validação usando Zod.
 */

import { z, zodValidate, ZodError } from "./zod.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3005");

// Schemas de validação
const usuarioSchema = z.object({
  nome: z.string("nome"),
  email: z.email("email"),
  idade: z.number("idade")
});

const produtoSchema = z.object({
  nome: z.string("nome"),
  preco: z.number("preco"),
  descricao: z.string("descricao").optional()
});

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

// Dados simulados
const usuarios: any[] = [];
const produtos: any[] = [];

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // POST /api/usuarios
  if (path === "/api/usuarios" && method === "POST") {
    try {
      const body = await req.json();
      const usuarioValidado = zodValidate(usuarioSchema, body);
      
      const novoUsuario = {
        id: usuarios.length + 1,
        ...usuarioValidado,
        criadoEm: new Date().toISOString()
      };
      
      usuarios.push(novoUsuario);
      
      return new Response(
        JSON.stringify({ message: "Usuário criado", usuario: novoUsuario }),
        { status: 201, headers }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return new Response(
          JSON.stringify({ 
            error: "Erro de validação",
            detalhes: error.errors
          }),
          { status: 400, headers }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "JSON inválido" }),
        { status: 400, headers }
      );
    }
  }

  // POST /api/produtos
  if (path === "/api/produtos" && method === "POST") {
    try {
      const body = await req.json();
      const produtoValidado = zodValidate(produtoSchema, body);
      
      const novoProduto = {
        id: produtos.length + 1,
        ...produtoValidado,
        criadoEm: new Date().toISOString()
      };
      
      produtos.push(novoProduto);
      
      return new Response(
        JSON.stringify({ message: "Produto criado", produto: novoProduto }),
        { status: 201, headers }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return new Response(
          JSON.stringify({ 
            error: "Erro de validação",
            detalhes: error.errors
          }),
          { status: 400, headers }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "JSON inválido" }),
        { status: 400, headers }
      );
    }
  }

  // GET /api/usuarios
  if (path === "/api/usuarios" && method === "GET") {
    return new Response(
      JSON.stringify(usuarios),
      { status: 200, headers }
    );
  }

  // GET /api/produtos
  if (path === "/api/produtos" && method === "GET") {
    return new Response(
      JSON.stringify(produtos),
      { status: 200, headers }
    );
  }

  // GET /health
  if (path === "/health") {
    return new Response(
      JSON.stringify({ status: "ok", service: "validation" }),
      { status: 200, headers }
    );
  }

  return new Response(
    JSON.stringify({ error: "Endpoint não encontrado" }),
    { status: 404, headers }
  );
}

console.log(`🚀 Validation API rodando em http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   POST /api/usuarios`);
console.log(`   POST /api/produtos`);
console.log(`   GET  /api/usuarios`);
console.log(`   GET  /api/produtos`);

Deno.serve({ port: PORT }, handler);
