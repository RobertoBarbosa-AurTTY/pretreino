/**
 * Challenge 48: Task Scheduler - Service
 */

export interface ScheduledJob {
  id: string;
  name: string;
  /** Expressão cron de 5 campos (minuto hora dia mês dia-da-semana), em UTC. */
  cron: string;
  task: () => Promise<void>;
  active: boolean;
  /** Tentativas extras imediatas quando a task falha (padrão: 0). */
  retries?: number;
  lastRun?: string;
  nextRun?: string;
}

export interface JobExecution {
  jobId: string;
  start: string;
  end?: string;
  status: "running" | "success" | "failed";
  error?: string;
}

export interface Scheduler {
  addJob(job: Omit<ScheduledJob, "id" | "active">): ScheduledJob;
  removeJob(id: string): void;
  pauseJob(id: string): void;
  resumeJob(id: string): void;
  getJobs(): ScheduledJob[];
  getExecutions(jobId: string): JobExecution[];
  /** Cancela todos os timers (nenhum job roda depois disso). */
  stop(): void;
}

export function createScheduler(): Scheduler {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Retorna a próxima data (UTC, segundos zerados) estritamente depois de
 * `from` que satisfaz a expressão cron. Lança erro se a expressão for inválida.
 */
export function parseCron(expression: string, from: Date = new Date()): Date {
  // TODO: Implement
  throw new Error("Not implemented");
}
