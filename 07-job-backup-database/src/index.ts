/**
 * Challenge 7: Database Backup Job
 * 
 * Job that performs database backup and sends it to storage.
 */

import { executeBackup } from "./backup.service.ts";

/**
 * Main job
 */
async function executeJob(): Promise<void> {
  console.log("Starting backup job...");
  
  try {
    // .env configurations
    const config = {
      database: Deno.env.get("DB_NAME") || "mydatabase",
      host: Deno.env.get("DB_HOST") || "localhost",
      port: parseInt(Deno.env.get("DB_PORT") || "5432"),
      user: Deno.env.get("DB_USER") || "admin",
      password: Deno.env.get("DB_PASS") || "password123",
      bucket: Deno.env.get("BACKUP_BUCKET") || "my-backup-bucket",
      region: Deno.env.get("BACKUP_REGIAO") || "us-east-1",
      retentionDays: parseInt(Deno.env.get("BACKUP_RETENCAO_DIAS") || "7"),
      folder: Deno.env.get("BACKUP_PASTA") || "./backups"
    };
    
    console.log(`Database: ${config.database}`);
    console.log(`Retention: ${config.retentionDays} days`);
    
    // Create backups folder if it does not exist
    await Deno.mkdir(config.folder, { recursive: true });
    
    // TODO: Implement job
    // 1. Execute backup
    // 2. Show result
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error in backup job:", error);
    throw error;
  }
}

// Execution
executeJob();