/**
 * Challenge 14: File Upload
 * 
 * File upload and management API.
 */

import { 
  saveFile, 
  listFiles, 
  findById, 
  deleteFile,
  formatSize 
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
      const file = formData.get("arquivo") as File;
      const description = formData.get("descricao") as string;
      
      if (!file) {
        return new Response(
          JSON.stringify({ error: "No file uploaded" }),
          { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
        );
      }
      
      const result = await saveFile(file, description);
      
      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error }),
          { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({
          message: "File uploaded successfully",
          file: {
            id: result.file!.id,
            name: result.file!.originalName,
            size: formatSize(result.file!.size),
            type: result.file!.type
          }
        }),
        { status: 201, headers: { ...headers, "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Error processing upload" }),
        { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }
  }

  // GET /api/arquivos
  if (path === "/api/arquivos" && method === "GET") {
    const files = listFiles();
    
    const list = files.map(f => ({
      id: f.id,
      name: f.originalName,
      size: formatSize(f.size),
      type: f.type,
      createdAt: f.createdAt
    }));
    
    return new Response(
      JSON.stringify(list),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // GET /api/arquivos/:id
  if (path.startsWith("/api/arquivos/") && method === "GET") {
    const id = path.split("/")[3];
    const file = findById(id);
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: "File not found" }),
        { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        id: file.id,
        name: file.originalName,
        size: formatSize(file.size),
        type: file.type,
        createdAt: file.createdAt
      }),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // DELETE /api/arquivos/:id
  if (path.startsWith("/api/arquivos/") && method === "DELETE") {
    const id = path.split("/")[3];
    const success = await deleteFile(id);
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: "File not found" }),
        { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "File deleted" }),
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
    JSON.stringify({ error: "Endpoint not found" }),
    { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
  );
}

console.log(`🚀 Upload API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   POST   /api/upload`);
console.log(`   GET    /api/arquivos`);
console.log(`   GET    /api/arquivos/:id`);
console.log(`   DELETE /api/arquivos/:id`);

Deno.serve({ port: PORT }, handler);
