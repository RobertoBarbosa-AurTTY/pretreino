/**
 * Desafio 19: Middleware Chain
 * 
 * API com sistema de middlewares encadeados.
 */

import {
  createContext,
  compose,
  logger,
  requestId,
  timing,
  cors,
  authMiddleware
} from "./middleware.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3007");

const VALID_TOKEN = "meu_token_secreto";

// Dados simulados
const dados = [
  { id: 1, titulo: "Item 1" },
  { id: 2, titulo: "Item 2" },
  { id: 3, titulo: "Item 3" }
];

// Middlewares específicos da aplicação
const auth = authMiddleware(VALID_TOKEN);

// Handler principal
async function handler(req: Request): Promise<Response> {
  const ctx = createContext(req);
  
  // Definir handler final
  const finalHandler = async () => {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;
    
    const baseHeaders = {
      "Content-Type": "application/json"
    };
    
    // GET /api/dados (público)
    if (path === "/api/dados" && method === "GET") {
      return new Response(
        JSON.stringify(dados),
        { status: 200, headers: baseHeaders }
      );
    }
    
    // GET /api/protected (privado)
    if (path === "/api/protected" && method === "GET") {
      return new Response(
        JSON.stringify({ 
          message: "Dados protegidos",
          dados: [1, 2, 3]
        }),
        { status: 200, headers: baseHeaders }
      );
    }
    
    // GET /health
    if (path === "/health") {
      return new Response(
        JSON.stringify({ 
          status: "ok",
          service: "middleware-chain",
          requestId: ctx.get("requestId")
        }),
        { status: 200, headers: baseHeaders }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Endpoint não encontrado" }),
      { status: 404, headers: baseHeaders }
    );
  };
  
  // Compor middlewares para rota pública
  const publicMiddlewares = compose(logger, requestId, timing, cors);
  
  // Compor middlewares para rota protegida
  const protectedMiddlewares = compose(logger, requestId, timing, cors, auth);
  
  // Determinar middlewares baseado na rota
  const url = new URL(req.url);
  const isProtected = url.pathname.startsWith("/api/protected");
  
  const middlewares = isProtected ? protectedMiddlewares : publicMiddlewares;
  
  // Executar chain
  await middlewares(ctx, finalHandler);
  
  // Retornar resposta
  return ctx.res || new Response(
    JSON.stringify({ error: "Internal Server Error" }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

console.log(`🚀 Middleware Chain API rodando em http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET /api/dados (público)`);
console.log(`   GET /api/protected (privado)`);
console.log(`   GET /health`);

Deno.serve({ port: PORT }, handler);
