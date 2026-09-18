/**
 * Challenge 17: Zod Validation
 * 
 * API with validation using Zod.
 */

import { z, zodValidate, ZodError } from "./zod.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3005");

// Validation schemas
const userSchema = z.object({
  nome: z.string("nome"),
  email: z.email("email"),
  idade: z.number("idade")
});

const productSchema = z.object({
  nome: z.string("nome"),
  preco: z.number("preco"),
  descricao: z.string("descricao").optional()
});

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

// Simulated data
const users: any[] = [];
const products: any[] = [];

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
      const validatedUser = zodValidate(userSchema, body);
      
      const newUser = {
        id: users.length + 1,
        ...validatedUser,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      
      return new Response(
        JSON.stringify({ message: "User created", user: newUser }),
        { status: 201, headers }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return new Response(
          JSON.stringify({ 
            error: "Validation error",
            details: error.errors
          }),
          { status: 400, headers }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers }
      );
    }
  }

  // POST /api/produtos
  if (path === "/api/produtos" && method === "POST") {
    try {
      const body = await req.json();
      const validatedProduct = zodValidate(productSchema, body);
      
      const newProduct = {
        id: products.length + 1,
        ...validatedProduct,
        createdAt: new Date().toISOString()
      };
      
      products.push(newProduct);
      
      return new Response(
        JSON.stringify({ message: "Product created", product: newProduct }),
        { status: 201, headers }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return new Response(
          JSON.stringify({ 
            error: "Validation error",
            details: error.errors
          }),
          { status: 400, headers }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers }
      );
    }
  }

  // GET /api/usuarios
  if (path === "/api/usuarios" && method === "GET") {
    return new Response(
      JSON.stringify(users),
      { status: 200, headers }
    );
  }

  // GET /api/produtos
  if (path === "/api/produtos" && method === "GET") {
    return new Response(
      JSON.stringify(products),
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
    JSON.stringify({ error: "Endpoint not found" }),
    { status: 404, headers }
  );
}

console.log(`🚀 Validation API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   POST /api/usuarios`);
console.log(`   POST /api/produtos`);
console.log(`   GET  /api/usuarios`);
console.log(`   GET  /api/produtos`);

Deno.serve({ port: PORT }, handler);
