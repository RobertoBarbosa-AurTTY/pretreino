/**
 * Challenge 7: Database Backup Job
 *
 * Database backup service.
 * The "database" is simulated by a JSON file (`sourceFile`).
 */

export interface BackupConfig {
  database: string;
  host: string;
  port: number;
  user: string;
  password: string;
  bucket: string;
  region: string;
  retentionDays: number;
  folder: string;
  sourceFile: string;
}

export interface BackupResult {
  success: boolean;
  file: string;
  size: number;
  startDate: string;
  endDate: string;
  error?: string;
}

/**
 * Exports database (sourceFile) to a backup file inside `folder`
 */
export async function exportDatabase(config: BackupConfig): Promise<string> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Compresses file with gzip
 */
export async function compressFile(filePath: string): Promise<string> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Sends file to storage (simulated: copies to `<folder>/storage/<bucket>/`)
 */
export async function sendToStorage(
  filePath: string,
  config: BackupConfig,
): Promise<boolean> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Removes old backups
 */
export async function cleanOldBackups(config: BackupConfig): Promise<number> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Executes complete backup pipeline
 */
export async function executeBackup(
  config: BackupConfig,
): Promise<BackupResult> {
  // TODO: Implement
  throw new Error("Not implemented");
}
