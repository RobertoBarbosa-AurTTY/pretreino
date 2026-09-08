/**
 * Desafio 20: API REST Completa
 * 
 * API REST completa com paginação, filtros e ordenação.
 */

import {
  listarProdutos,
  buscarPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto,
  listarCategorias
} from "./produto.service.ts";

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
      const categoria = url.searchParams.get("categoria") || undefined;
      const minPreco = url.searchParams.get("minPreco") 
        ? parseFloat(url.searchParams.get("minPreco")!) 
        : undefined;
      const maxPreco = url.searchParams.get("maxPreco") 
        ? parseFloat(url.searchParams.get("maxPreco")!) 
        : undefined;
      const sortField = url.searchParams.get("sort") || "id";
      const sortDirection = url.searchParams.get("direction") || "asc";
      
      const result = listarProdutos(page, limit, {
        search,
        categoria,
        minPreco,
        maxPreco
      }, {
        field: sortField,
        direction: sortDirection as "asc" | "desc"
      });
      
      return new Response(JSON.stringify(result), { status: 200, headers });
    }

    // GET /api/produtos/categorias
    if (path === "/api/produtos/categorias" && method === "GET") {
      const categorias = listarCategorias();
      return new Response(JSON.stringify(categorias), { status: 200, headers });
    }

    // GET /api/produtos/:id
    if (path.startsWith("/api/produtos/") && !path.includes("categorias") && method === "GET") {
      const id = parseInt(path.split("/")[3]);
      const produto = buscarPorId(id);
      
      if (!produto) {
        return new Response(
          JSON.stringify({ error: "Produto não encontrado" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(produto), { status: 200, headers });
    }

    // POST /api/produtos
    if (path === "/api/produtos" && method === "POST") {
      const body = await req.json();
      
      if (!body.nome || body.preco === undefined) {
        return new Response(
          JSON.stringify({ error: "Nome e preço são obrigatórios" }),
          { status: 400, headers }
        );
      }
      
      if (body.preco < 0) {
        return new Response(
          JSON.stringify({ error: "Preço não pode ser negativo" }),
          { status: 400, headers }
        );
      }
      
      const produto = criarProduto({
        nome: body.nome,
        descricao: body.descricao,
        preco: body.preco,
        categoria: body.categoria || "geral",
        estoque: body.estoque || 0,
        ativo: body.ativo !== false
      });
      
      return new Response(JSON.stringify(produto), { status: 201, headers });
    }

    // PUT /api/produtos/:id
    if (path.startsWith("/api/produtos/") && method === "PUT") {
      const id = parseInt(path.split("/")[3]);
      const body = await req.json();
      
      const produto = atualizarProduto(id, body);
      
      if (!produto) {
        return new Response(
          JSON.stringify({ error: "Produto não encontrado" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(produto), { status: 200, headers });
    }

    // DELETE /api/produtos/:id
    if (path.startsWith("/api/produtos/") && method === "DELETE") {
      const id = parseInt(path.split("/")[3]);
      const sucesso = deletarProduto(id);
      
      if (!sucesso) {
        return new Response(
          JSON.stringify({ error: "Produto não encontrado" }),
          { status: 404, headers }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Produto deletado" }),
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
      JSON.stringify({ error: "Endpoint não encontrado" }),
      { status: 404, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers }
    );
  }
}

console.log(`🚀 REST API rodando em http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET    /api/produtos`);
console.log(`   GET    /api/produtos/categorias`);
console.log(`   GET    /api/produtos/:id`);
console.log(`   POST   /api/produtos`);
console.log(`   PUT    /api/produtos/:id`);
console.log(`   DELETE /api/produtos/:id`);

Deno.serve({ port: PORT }, handler);
