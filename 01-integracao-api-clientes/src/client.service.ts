/**
 * Challenge 1: Customers API Integration
 *
 * Service that consumes a customer API and filters by status.
 *
 * Implement the functions below following the requirements in the README.
 */

import { error } from "node:console";

export interface Client {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "inativo" | "pendente";
  registrationDate: string;
}

export interface APIConfig {
  url: string;
  email: string;
  password: string;
  timeout?: number;
  retries?: number;
}

/**
 * Authenticates on the API and returns the Bearer token
 *
 * Requirements:
 * - POST {url}/api/auth/login with { email, password } as JSON
 * - Return the `token` field of the response
 * - Throw an error if the response is not 2xx
 */
export async function login(config: APIConfig): Promise<string> {
     const user = {
        email: config.email,
        password: config.password
      }
    try {
      const loginUser = await fetch(`${config.url}/api/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      if (!loginUser.ok){
        throw new Error(`Error: ${loginUser.status}`)
      }

      const resultado = await loginUser.json();
      const token = `Bearer ${resultado.token}`

      if (!token){
        throw new Error('Error token...')
      }

      return token

    } catch (error) {
        throw new Error("Error login");
    }
}

/**
 * Fetches the list of customers from the API
 *
 * Requirements:
 * - GET {url}/api/clientes with header Authorization: Bearer <token>
 * - Handle network and HTTP errors
 * - Implement retry on failure (up to `retries` attempts)
 * - Implement request timeout (`timeout` ms)
 * - Validate the API response before processing (must be an array)
 */
export async function fetchClients(
  config: APIConfig,
  token: string,
): Promise<Client[]> {
  // TODO: Implement
  const connect = await fetch(`${config.url}/api/clientes`, {
    method: "GET",
    headers: {
       'Content-Type': 'application/json',
       'Authorization': `${token}`
    }
  })

  if (!connect.ok){
    throw new Error(`Error status code: ${connect.status}`);
  }
  
  const client = await connect.json()
  return [ ...client]
}

/**
 * Filters active clients
 *
 * Requirement:
 * - Filter clients by status === "ativo"
 */
export function filterActive(clients: Client[]): Client[] {
  return clients.filter((c) => c.status === 'ativo');
}

/**
 * Saves data to a JSON file
 *
 * Requirements:
 * - Save result to a JSON file (formatted with 2-space indentation)
 * - Create the destination folder if it does not exist
 */
export async function saveToFile(
  data: Client[],
  fileName: string = "clientes.json",
): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}