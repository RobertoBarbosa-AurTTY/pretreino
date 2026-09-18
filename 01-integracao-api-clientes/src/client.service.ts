import fs from "fs/promises";
/**
 * Challenge 1: Customers API Integration
 *
 * Service that consumes a customer API and filters by status.
 *
 * Implement the functions below following the requirements in the README.
 */

export interface Client {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "inativo" | "pendente";
  registrationDate: string;
}

export interface APIConfig {
  url: string;
  timeout?: number;
  retries?: number;
}

/**
 * Fetches the list of customers from the API
 *
 * Requirements:
 * - Consume a REST API with fetch()
 * - Handle network and HTTP errors
 * - Implement retry on failure
 * - Implement request timeout
 * - Validate the API response before processing
 */
export async function fetchClients(
  config: APIConfig,
): Promise<Client[]> {
  try {
    const response = await fetch(`${config.url}/api/clientes`);
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
    const clients = response.json();
    return clients;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

/**
 * Filters active clients
 *
 * Requirement:
 * - Filter clients by status === "ativo"
 */
export function filterActive(clients: Client[]): Client[] {
  try {
    if (!clients) {
      throw new Error("error filtering clients");
    }
    return clients.filter((c) => c.status === "ativo");
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

/**
 * Saves data to a JSON file
 *
 * Requirement:
 * - Save result to a JSON file
 */
export async function saveToFile(
  data: Client[],
  fileName: string = "clientes.json",
): Promise<void> {
  try {
    if (!data) {
      throw new Error("data not provided");
    }
    await fs.writeFile(
      `${fileName}.json`,
      JSON.stringify(data, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}