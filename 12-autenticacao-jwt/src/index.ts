/**
 * Challenge 12: JWT Authentication
 * 
 * Complete authentication API with JWT.
 */

import { 
  login, 
  validateToken, 
  refresh, 
  logout,
  isAdmin 
} from "./auth.service.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3000");

// Sample data
const protectedData = [
  { id: 1, title: "Secret Document", content: "Confidential content" },
  { id: 2, title: "Annual Report", content: "Financial data" }
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
      const { email, senha: password } = body;

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: "Email and password are required" }),
          { status: 400, headers }
        );
      }

      const result = await login(email, password);

      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error }),
          { status: 401, headers }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Login successful",
          token: result.token,
          refreshToken: result.refreshToken
        }),
        { status: 200, headers }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
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
          JSON.stringify({ error: "Refresh token is required" }),
          { status: 400, headers }
        );
      }

      const result = await refresh(refreshToken);

      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error }),
          { status: 401, headers }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Token renewed",
          token: result.token,
          refreshToken: result.refreshToken
        }),
        { status: 200, headers }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers }
      );
    }
  }

  // POST /api/logout
  if (path === "/api/logout" && method === "POST") {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token not provided" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    logout(token);

    return new Response(
      JSON.stringify({ message: "Logout successful" }),
      { status: 200, headers }
    );
  }

  // GET /api/profile
  if (path === "/api/profile" && method === "GET") {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token not provided" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await validateToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
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

  // GET /api/documents (protected route)
  if (path === "/api/documents" && method === "GET") {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token not provided" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await validateToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers }
      );
    }

    return new Response(
      JSON.stringify(protectedData),
      { status: 200, headers }
    );
  }

  // DELETE /api/admin/users/:id (admin route)
  if (path.startsWith("/api/admin/users/") && method === "DELETE") {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token not provided" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await validateToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers }
      );
    }

    if (!isAdmin(payload)) {
      return new Response(
        JSON.stringify({ error: "Access denied. Admins only." }),
        { status: 403, headers }
      );
    }

    const userId = path.split("/")[4];
    return new Response(
      JSON.stringify({ message: `User ${userId} deleted` }),
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
    JSON.stringify({ error: "Endpoint not found" }),
    { status: 404, headers }
  );
}

console.log(`🚀 Auth API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   POST /api/login`);
console.log(`   POST /api/refresh`);
console.log(`   POST /api/logout`);
console.log(`   GET  /api/profile`);
console.log(`   GET  /api/documents`);
console.log(`   DELETE /api/admin/users/:id`);

Deno.serve({ port: PORT }, handler);
