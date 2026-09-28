/**
 * Challenge 4: CSV Import
 *
 * Service for importing and validating data from CSV.
 */

export interface ClientCSV {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface ImportResult {
  totalRows: number;
  imported: number;
  errors: ImportError[];
}

export interface ImportError {
  line: number;
  field: string;
  error: string;
  value: string;
}

/**
 * Reads CSV file and returns array of objects (keys = header columns)
 */
export async function readCSV(
  filePath: string,
): Promise<Record<string, string>[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Validates a client
 */
export function validateClient(
  client: Record<string, string>,
  line: number,
): ImportError[] {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Validates CPF (format and check digits)
 */
export function validateCPF(cpf: string): boolean {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Processes a complete import
 */
export async function importCSV(
  filePath: string,
): Promise<ImportResult> {
  // TODO: Implement
  throw new Error("Not implemented");
}
