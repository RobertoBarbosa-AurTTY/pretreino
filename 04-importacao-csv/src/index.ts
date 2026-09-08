/**
 * Desafio 4: Importação de CSV
 * 
 * Serviço que importa dados de CSV, valida e processa.
 */

import { importarCSV } from "./importador.service.ts";

/**
 * Gera relatório de erros
 */
async function gerarRelatorioErros(
  erros: Array<{ linha: number; campo: string; erro: string; valor: string }>,
  caminhoSaida: string
): Promise<void> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Pipeline principal
 */
async function executarImportacao(): Promise<void> {
  console.log("Iniciando importação de CSV...");
  
  try {
    // Configurações do .env
    const pastaImportacao = Deno.env.get("PASTA_IMPORTACAO") || "./data";
    const arquivoEntrada = Deno.env.get("ARQUIVO_ENTRADA") || "clientes.csv";
    const pastaErros = Deno.env.get("PASTA_ERROS") || "./data/erros";
    
    const caminhoArquivo = `${pastaImportacao}/${arquivoEntrada}`;
    
    console.log(`Arquivo: ${caminhoArquivo}`);
    
    // TODO: Implementar pipeline
    // 1. Importar e validar
    // 2. Exibir resultados
    // 3. Gerar relatório de erros
    
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro na importação:", error);
    throw error;
  }
}

// Execução
executarImportacao();
