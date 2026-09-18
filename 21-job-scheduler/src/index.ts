/**
 * Challenge 21: Job Scheduler
 * 
 * Task scheduling API.
 */

import {
  createJob,
  listJobs,
  getJobById,
  toggleJob,
  deleteJob,
  executeJob,
  listExecutions,
  startAll,
  stopAll
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
      const jobs = listJobs();
      return new Response(JSON.stringify(jobs), { status: 200, headers });
    }

    // POST /api/jobs
    if (path === "/api/jobs" && method === "POST") {
      const body = await req.json();
      
      if (!body.name || !body.cron || !body.command) {
        return new Response(
          JSON.stringify({ error: "Name, cron and command are required" }),
          { status: 400, headers }
        );
      }
      
      const job = createJob(body);
      return new Response(JSON.stringify(job), { status: 201, headers });
    }

    // GET /api/jobs/:id
    if (path.match(/^\/api\/jobs\/[^/]+$/) && method === "GET") {
      const id = path.split("/")[3]!;
      const job = getJobById(id);
      
      if (!job) {
        return new Response(
          JSON.stringify({ error: "Job not found" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(job), { status: 200, headers });
    }

    // PATCH /api/jobs/:id (activate/deactivate)
    if (path.match(/^\/api\/jobs\/[^/]+$/) && method === "PATCH") {
      const id = path.split("/")[3]!;
      const body = await req.json();
      
      const job = toggleJob(id, body.active);
      
      if (!job) {
        return new Response(
          JSON.stringify({ error: "Job not found" }),
          { status: 404, headers }
        );
      }
      
      return new Response(JSON.stringify(job), { status: 200, headers });
    }

    // DELETE /api/jobs/:id
    if (path.match(/^\/api\/jobs\/[^/]+$/) && method === "DELETE") {
      const id = path.split("/")[3]!;
      const success = deleteJob(id);
      
      if (!success) {
        return new Response(
          JSON.stringify({ error: "Job not found" }),
          { status: 404, headers }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Job deleted" }),
        { status: 200, headers }
      );
    }

    // POST /api/jobs/:id/executar
    if (path.match(/^\/api\/jobs\/[^/]+\/executar$/) && method === "POST") {
      const id = path.split("/")[3]!;
      const execution = await executeJob(id);
      return new Response(JSON.stringify(execution), { status: 200, headers });
    }

    // GET /api/jobs/:id/execucoes
    if (path.match(/^\/api\/jobs\/[^/]+\/execucoes$/) && method === "GET") {
      const id = path.split("/")[3]!;
      const executions = listExecutions(id);
      return new Response(JSON.stringify(executions), { status: 200, headers });
    }

    // GET /health
    if (path === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", service: "job-scheduler" }),
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

// Start jobs on startup
startAll();

console.log(`🚀 Job Scheduler API running at http://localhost:${PORT}`);
console.log(`📡 Endpoints:`);
console.log(`   GET    /api/jobs`);
console.log(`   POST   /api/jobs`);
console.log(`   GET    /api/jobs/:id`);
console.log(`   PATCH  /api/jobs/:id`);
console.log(`   DELETE /api/jobs/:id`);
console.log(`   POST   /api/jobs/:id/executar`);
console.log(`   GET    /api/jobs/:id/execucoes`);

Deno.serve({ port: PORT }, handler);