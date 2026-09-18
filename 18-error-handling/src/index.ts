/**
 * Challenge 18: Error Handling
 * 
 * API with centralized error handling.
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

// Simulated data
const users = [
  { id: 1, name: "João", email: "joao@email.com" },
  { id: 2, name: "Maria", email: "maria@email.com" }
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
        JSON.stringify(users),
        { status: 200, headers }
      );
    }

    // GET /api/usuarios/:id
    if (path.startsWith("/api/usuarios/") && method === "GET") {
      const id = parseInt(path.split("/")[3]);
      
      if (isNaN(id)) {
        throw new ValidationError("ID must be a number");
      }
      
      const user = users.find(u => u.id === id);
      
      if (!user) {
        throw new NotFoundError("User", id);
      }
      
      return new Response(
        JSON.stringify(user),
        { status: 200, headers }
      );
    }

    // POST /api/usuarios
    if (path === "/api/usuarios" && method === "POST") {
      const body = await req.json();
      
      if (!body.name || !body.email) {
        throw new ValidationError("Name and email are required", {
          fields: ["name", "email"]
        });
      }
      
      if (users.some(u => u.email === body.email)) {
        throw new AppError("Email already registered", "CONFLICT" as any);
      }
      
      const newUser = {
        id: users.length + 1,
        ...body
      };
      
      users.push(newUser);
      
      return new Response(
        JSON.stringify(newUser),
        { status: 201, headers }
      );
    }

    // GET /api/protected (route that requires auth)
    if (path === "/api/protected" && method === "GET") {
      const authHeader = req.headers.get("Authorization");
      
      if (!authHeader) {
        throw new UnauthorizedError("Authentication token required");
      }
      
      if (!authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Invalid token format");
      }
      
      return new Response(
        JSON.stringify({ message: "Access granted", data: "secret" }),
        { status: 200, headers }
      );
    }

    // GET /api/error (forces a 500 error)
    if (path === "/api/error" && method === "GET") {
      throw new Error("Simulated server error");
    }

    // GET /health
    if (path === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", service: "error-handling" }),
        { status: 200, headers }
      );
    }

    // Endpoint not found
    throw new NotFoundError("Endpoint", path);

  } catch (error) {
    return handleError(error);
  }
}

console.log(`🚀 Error Handling API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET /api/usuarios`);
console.log(`   GET /api/usuarios/:id`);
console.log(`   POST /api/usuarios`);
console.log(`   GET /api/protected`);
console.log(`   GET /api/error`);

Deno.serve({ port: PORT }, handler);
