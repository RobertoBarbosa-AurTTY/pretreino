/**
 * Desafio 1: Integração API de Clientes
 *
 * Consumir API REST, filtrar clientes ativos e salvar em arquivo.
 * A Mock API deve estar rodando: cd ../mock-api && deno task dev
 */

import {
  buscarClientes,
  ConfiguracaoAPI,
  filtrarAtivos,
  salvarEmArquivo,
} from "./cliente.service.ts";

/**
 * Pipeline principal
 *
 * Implemente a sequência:
 * 1. Buscar clientes da API
 * 2. Filtrar apenas ativos
 * 3. Salvar em arquivo JSON
 */
async function executarPipeline(config: ConfiguracaoAPI): Promise<void> {
  const clientes = await buscarClientes(config);
  console.log(clientes);
  console.log("--------------------------------");
  console.log(filtrarAtivos(clientes));
  await salvarEmArquivo(clientes);
  console.log("Clientes salvos em JSON");
}

// Execução
const config: ConfiguracaoAPI = {
  url: Deno.env.get("API_BASE_URL") || "http://localhost:8080",
  timeout: parseInt(Deno.env.get("API_TIMEOUT") || "5000"),
  retries: parseInt(Deno.env.get("API_RETRIES") || "3"),
};

try {
  await executarPipeline(config);
} catch {
  Deno.exit(1);
}
