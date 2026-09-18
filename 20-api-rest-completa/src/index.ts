/**
 * Challenge 20: Complete REST API
 * 
 * Complete REST API with pagination, filters and sorting.
 */

import {
  listProducts,
  findById,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories
} from "./product.service.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3008");

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

  try {
    // GET /api/produtos
    if (path === "/api/produtos" && method === "GET") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const search = url.searchParams.get("search") || undefined;
      const category = url.searchParams.get("categoria") || undefined;
      const minPrice = url.searchParams.get("minPreco") 
        ? parseFloat(url.searchParams.get("minPreco")!) 
        : undefined;
      const maxPrice = url.searchParams.get("maxPreco") 
        ? parseFloat(url.searchParams.get("maxPreco")!) 
        : undefined;
      const sortField = url.searchParams.get("sort") || "id";
      const sortDirection = url.searchParams.get("direction") || "asc";
      
      const result = listProducts(page, limit, {
        search,
        category,
        minPrice,
        maxPrice
      }, {
        field: sortField,
        direction: sortDirection as "asc" | "desc"
      });
      
      return new Response(JSON.stringify(result), { status: 200, headers });
    }

    // GET /api/produtos/categorias
    if (path === "/api/produtos/categorias" && method === "GET") {
      const categories = listCategories();
      return new Response(JSON.stringify(categories), { status: 200, headers });
    }

    // GET /api/produtos/:id
    if (path.startsWith("/api/produtos/") && !path.includes("categorias") && method === "GET") {
      const id = parseInt(path.split("/")[3]);
      const product = findById(id);
      
      if (!product) {
        return new Response(
          JSON.stringify({ error: "Product not found" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(product), { status: 200, headers });
    }

    // POST /api/produtos
    if (path === "/api/produtos" && method === "POST") {
      const body = await req.json();
      
      if (!body.nome || body.preco === undefined) {
        return new Response(
          JSON.stringify({ error: "Name and price are required" }),
          { status: 400, headers }
        );
      }
      
      if (body.preco < 0) {
        return new Response(
          JSON.stringify({ error: "Price cannot be negative" }),
          { status: 400, headers }
        );
      }
      
      const product = createProduct({
        nome: body.nome,
        description: body.description,
        preco: body.preco,
        category: body.category || "general",
        stock: body.stock || 0,
        active: body.active !== false
      });
      
      return new Response(JSON.stringify(product), { status: 201, headers });
    }

    // PUT /api/produtos/:id
    if (path.startsWith("/api/produtos/") && method === "PUT") {
      const id = parseInt(path.split("/")[3]);
      const body = await req.json();
      
      const product = updateProduct(id, body);
      
      if (!product) {
        return new Response(
          JSON.stringify({ error: "Product not found" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(product), { status: 200, headers });
    }

    // DELETE /api/produtos/:id
    if (path.startsWith("/api/produtos/") && method === "DELETE") {
      const id = parseInt(path.split("/")[3]);
      const success = deleteProduct(id);
      
      if (!success) {
        return new Response(
          JSON.stringify({ error: "Product not found" }),
          { status: 404, headers }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Product deleted" }),
        { status: 200, headers }
      );
    }

    // GET /health
    if (path === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", service: "rest-api" }),
        { status: 200, headers }
      );
    }

    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      { status: 404, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers }
    );
  }
}

console.log(`🚀 REST API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET    /api/produtos`);
console.log(`   GET    /api/produtos/categorias`);
console.log(`   GET    /api/produtos/:id`);
console.log(`   POST   /api/produtos`);
console.log(`   PUT    /api/produtos/:id`);
console.log(`   DELETE /api/produtos/:id`);

Deno.serve({ port: PORT }, handler);
