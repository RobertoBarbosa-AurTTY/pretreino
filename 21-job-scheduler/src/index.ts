/**
 * Desafio 21: Job Scheduler
 * 
 * API de agendamento de tarefas.
 */

import {
  criarJob,
  listarJobs,
  buscarJobPorId,
  toggleJob,
  deletarJob,
  executarJob,
  listarExecucoes,
  iniciarTodos,
  pararTodos
} from "./scheduler.service.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3009");

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
    // GET /api/jobs
    if (path === "/api/jobs" && method === "GET") {
      const jobs = listarJobs();
      return new Response(JSON.stringify(jobs), { status: 200, headers });
    }

    // POST /api/jobs
    if (path === "/api/jobs" && method === "POST") {
      const body = await req.json();
      
      if (!body.nome || !body.cron || !body.comando) {
        return new Response(
          JSON.stringify({ error: "Nome, cron e comando são obrigatórios" }),
          { status: 400, headers }
        );
      }
      
      const job = criarJob(body);
      return new Response(JSON.stringify(job), { status: 201, headers });
    }

    // GET /api/jobs/:id
    if (path.match(/^\/api\/jobs\/[^/]+$/) && method === "GET") {
      const id = path.split("/")[3];
      const job = buscarJobPorId(id);
      
      if (!job) {
        return new Response(
          JSON.stringify({ error: "Job não encontrado" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(job), { status: 200, headers });
    }

    // PATCH /api/jobs/:id (ativar/desativar)
    if (path.match(/^\/api\/jobs\/[^/]+$/) && method === "PATCH") {
      const id = path.split("/")[3];
      const body = await req.json();
      
      const job = toggleJob(id, body.ativo);
      
      if (!job) {
        return new Response(
          JSON.stringify({ error: "Job não encontrado" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(job), { status: 200, headers });
    }

    // DELETE /api/jobs/:id
    if (path.match(/^\/api\/jobs\/[^/]+$/) && method === "DELETE") {
      const id = path.split("/")[3];
      const sucesso = deletarJob(id);
      
      if (!sucesso) {
        return new Response(
          JSON.stringify({ error: "Job não encontrado" }),
          { status: 404, headers }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Job deletado" }),
        { status: 200, headers }
      );
    }

    // POST /api/jobs/:id/executar
    if (path.match(/^\/api\/jobs\/[^/]+\/executar$/) && method === "POST") {
      const id = path.split("/")[3];
      const execucao = await executarJob(id);
      return new Response(JSON.stringify(execucao), { status: 200, headers });
    }

    // GET /api/jobs/:id/execucoes
    if (path.match(/^\/api\/jobs\/[^/]+\/execucoes$/) && method === "GET") {
      const id = path.split("/")[3];
      const execucoes = listarExecucoes(id);
      return new Response(JSON.stringify(execucoes), { status: 200, headers });
    }

    // GET /health
    if (path === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", service: "job-scheduler" }),
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

// Iniciar jobs ao ligar
iniciarTodos();

console.log(`🚀 Job Scheduler API rodando em http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET    /api/jobs`);
console.log(`   POST   /api/jobs`);
console.log(`   GET    /api/jobs/:id`);
console.log(`   PATCH  /api/jobs/:id`);
console.log(`   DELETE /api/jobs/:id`);
console.log(`   POST   /api/jobs/:id/executar`);
console.log(`   GET    /api/jobs/:id/execucoes`);

Deno.serve({ port: PORT }, handler);
