/**
 * Challenge 19: Middleware Chain
 * 
 * API with a chained middleware system.
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

const VALID_TOKEN = "my_secret_token";

// Simulated data
const data = [
  { id: 1, title: "Item 1" },
  { id: 2, title: "Item 2" },
  { id: 3, title: "Item 3" }
];

// Application-specific middlewares
const auth = authMiddleware(VALID_TOKEN);

// Main handler
async function handler(req: Request): Promise<Response> {
  const ctx = createContext(req);
  
  // Define final handler
  const finalHandler = async () => {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;
    
    const baseHeaders = {
      "Content-Type": "application/json"
    };
    
    // GET /api/dados (public)
    if (path === "/api/dados" && method === "GET") {
      return new Response(
        JSON.stringify(data),
        { status: 200, headers: baseHeaders }
      );
    }
    
    // GET /api/protected (private)
    if (path === "/api/protected" && method === "GET") {
      return new Response(
        JSON.stringify({ 
          message: "Protected data",
          data: [1, 2, 3]
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
      JSON.stringify({ error: "Endpoint not found" }),
      { status: 404, headers: baseHeaders }
    );
  };
  
  // Compose middlewares for public route
  const publicMiddlewares = compose(logger, requestId, timing, cors);
  
  // Compose middlewares for protected route
  const protectedMiddlewares = compose(logger, requestId, timing, cors, auth);
  
  // Determine middlewares based on route
  const url = new URL(req.url);
  const isProtected = url.pathname.startsWith("/api/protected");
  
  const middlewares = isProtected ? protectedMiddlewares : publicMiddlewares;
  
  // Run chain
  await middlewares(ctx, finalHandler);
  
  // Return response
  return ctx.res || new Response(
    JSON.stringify({ error: "Internal Server Error" }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

console.log(`🚀 Middleware Chain API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET /api/dados (public)`);
console.log(`   GET /api/protected (private)`);
console.log(`   GET /health`);

Deno.serve({ port: PORT }, handler);
