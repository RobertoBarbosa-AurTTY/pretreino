/**
 * Desafio 10: Dashboard de Métricas
 * 
 * Serviço que coleta, processa e serve métricas de aplicação.
 * A Mock API deve estar rodando: cd ../mock-api && deno task dev
 */

import { 
  registrarMetrica, 
  buscarMetricas, 
  agregarMetricas,
  gerarMetricasSimuladas 
} from "./metrica.service.ts";

/**
 * Pipeline principal
 */
async function executarDashboard(): Promise<void> {
  console.log("Iniciando dashboard de métricas...");
  
  try {
    // Configurações do .env
    const apiUrl = Deno.env.get("API_BASE_URL") || "http://localhost:8080";
    
    console.log(`API URL: ${apiUrl}`);
    
    // TODO: Implementar pipeline
    // 1. Gerar métricas simuladas
    // 2. Buscar métricas
    // 3. Agregar e mostrar estatísticas
    
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro no dashboard:", error);
    throw error;
  }
}

// Execução
executarDashboard();
