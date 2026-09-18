/**
 * Challenge 15: Rate Limiting
 * 
 * API with rate limiting implemented.
 */

import { rateLimit, getStats } from "./rateLimit.service.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3003");

// Rate limiters for different endpoints
const globalLimiter = rateLimit({ windowMs: 60000, maxRequests: 100 });
const authLimiter = rateLimit({ windowMs: 60000, maxRequests: 10 });
const apiLimiter = rateLimit({ windowMs: 60000, maxRequests: 50 });

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // CORS
  const baseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: baseHeaders });
  }

  // Global rate limit
  const globalResult = globalLimiter(req);
  
  if (!globalResult.allowed) {
    return new Response(
      JSON.stringify({ 
        error: "Rate limit exceeded",
        retryAfter: globalResult.headers["Retry-After"]
      }),
      { 
        status: 429, 
        headers: { ...baseHeaders, ...globalResult.headers }
      }
    );
  }

  // GET /health
  if (path === "/health") {
    return new Response(
      JSON.stringify({ status: "ok", service: "rate-limiting" }),
      { status: 200, headers: { ...baseHeaders, ...globalResult.headers } }
    );
  }

  // POST /api/login (more restrictive rate limit)
  if (path === "/api/login" && method === "POST") {
    const authResult = authLimiter(req);
    
    if (!authResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: "Too many login attempts",
          retryAfter: authResult.headers["Retry-After"]
        }),
        { 
          status: 429, 
          headers: { ...baseHeaders, ...authResult.headers }
        }
      );
    }
    
    // Simulate login
    return new Response(
      JSON.stringify({ message: "Login successful" }),
      { status: 200, headers: { ...baseHeaders, ...authResult.headers } }
    );
  }

  // GET /api/dados (default rate limit)
  if (path === "/api/dados" && method === "GET") {
    const apiResult = apiLimiter(req);
    
    if (!apiResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: "Too many API requests",
          retryAfter: apiResult.headers["Retry-After"]
        }),
        { 
          status: 429, 
          headers: { ...baseHeaders, ...apiResult.headers }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        data: [1, 2, 3],
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...baseHeaders, ...apiResult.headers } }
    );
  }

  // GET /api/stats
  if (path === "/api/stats" && method === "GET") {
    const stats = getStats();
    
    return new Response(
      JSON.stringify(stats),
      { status: 200, headers: { ...baseHeaders, ...globalResult.headers } }
    );
  }

  return new Response(
    JSON.stringify({ error: "Endpoint not found" }),
    { status: 404, headers: { ...baseHeaders, ...globalResult.headers } }
  );
}

console.log(`🚀 Rate Limiting API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET  /health`);
console.log(`   POST /api/login (10 req/min)`);
console.log(`   GET  /api/dados (50 req/min)`);
console.log(`   GET  /api/stats`);

Deno.serve({ port: PORT }, handler);
