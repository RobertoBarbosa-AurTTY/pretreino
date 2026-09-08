/**
 * Desafio 14: Upload de Arquivos
 * 
 * API de upload e gerenciamento de arquivos.
 */

import { 
  salvarArquivo, 
  listarArquivos, 
  buscarPorId, 
  deletarArquivo,
  formatarTamanho 
} from "./upload.service.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3002");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // POST /api/upload
  if (path === "/api/upload" && method === "POST") {
    try {
      const formData = await req.formData();
      const arquivo = formData.get("arquivo") as File;
      const descricao = formData.get("descricao") as string;
      
      if (!arquivo) {
        return new Response(
          JSON.stringify({ error: "Nenhum arquivo enviado" }),
          { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
        );
      }
      
      const resultado = await salvarArquivo(arquivo, descricao);
      
      if (!resultado.success) {
        return new Response(
          JSON.stringify({ error: resultado.error }),
          { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({
          message: "Arquivo enviado com sucesso",
          arquivo: {
            id: resultado.arquivo!.id,
            nome: resultado.arquivo!.nomeOriginal,
            tamanho: formatarTamanho(resultado.arquivo!.tamanho),
            tipo: resultado.arquivo!.tipo
          }
        }),
        { status: 201, headers: { ...headers, "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Erro ao processar upload" }),
        { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }
  }

  // GET /api/arquivos
  if (path === "/api/arquivos" && method === "GET") {
    const arquivos = listarArquivos();
    
    const lista = arquivos.map(a => ({
      id: a.id,
      nome: a.nomeOriginal,
      tamanho: formatarTamanho(a.tamanho),
      tipo: a.tipo,
      criadoEm: a.criadoEm
    }));
    
    return new Response(
      JSON.stringify(lista),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // GET /api/arquivos/:id
  if (path.startsWith("/api/arquivos/") && method === "GET") {
    const id = path.split("/")[3];
    const arquivo = buscarPorId(id);
    
    if (!arquivo) {
      return new Response(
        JSON.stringify({ error: "Arquivo não encontrado" }),
        { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        id: arquivo.id,
        nome: arquivo.nomeOriginal,
        tamanho: formatarTamanho(arquivo.tamanho),
        tipo: arquivo.tipo,
        criadoEm: arquivo.criadoEm
      }),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // DELETE /api/arquivos/:id
  if (path.startsWith("/api/arquivos/") && method === "DELETE") {
    const id = path.split("/")[3];
    const sucesso = await deletarArquivo(id);
    
    if (!sucesso) {
      return new Response(
        JSON.stringify({ error: "Arquivo não encontrado" }),
        { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "Arquivo deletado" }),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // GET /health
  if (path === "/health") {
    return new Response(
      JSON.stringify({ status: "ok", service: "upload" }),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: "Endpoint não encontrado" }),
    { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
  );
}

console.log(`🚀 Upload API rodando em http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   POST   /api/upload`);
console.log(`   GET    /api/arquivos`);
console.log(`   GET    /api/arquivos/:id`);
console.log(`   DELETE /api/arquivos/:id`);

Deno.serve({ port: PORT }, handler);
