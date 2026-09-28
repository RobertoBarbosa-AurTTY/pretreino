/**
 * Challenge 9: Queue Processing
 *
 * Async task processing service with queue and workers.
 */

export interface Task {
  id: string;
  type: string;
  data: unknown;
  status: "pendente" | "processando" | "concluida" | "falha";
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  processedAt?: string;
}

/** Input accepted by `Queue.add()` */
export type NewTask = Omit<
  Task,
  "id" | "status" | "attempts" | "maxAttempts" | "createdAt"
>;

/** Function that executes a task type; must stop when `signal` is aborted */
export type TaskHandler = (data: unknown, signal: AbortSignal) => Promise<void>;

export interface QueueConfig {
  maxWorkers: number;
  maxAttempts: number;
  retryDelay: number;
  processingTimeout: number;
}

export interface ProcessingResult {
  taskId: string;
  success: boolean;
  duration: number;
  error?: string;
}

export class Queue {
  private queue: Task[] = [];
  private config: QueueConfig;
  private results: ProcessingResult[] = [];
  private handlers: Map<string, TaskHandler> = new Map();

  constructor(config: QueueConfig) {
    this.config = config;
  }

  /**
   * Registers the handler that executes tasks of the given type
   */
  registerHandler(type: string, handler: TaskHandler): void {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Adds task to the queue
   */
  async add(task: NewTask): Promise<string> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Processes the complete queue
   */
  async process(): Promise<ProcessingResult[]> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Processes tasks on a worker
   */
  private async processWorker(workerId: string): Promise<void> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Gets next task from the queue
   */
  private getNextTask(): Task | null {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Processes a single task
   */
  private async processTask(task: Task): Promise<ProcessingResult> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Executes task according to type (using the registered handler)
   */
  private async executeTaskType(
    task: Task,
    signal: AbortSignal,
  ): Promise<void> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Returns queue status
   */
  getStatus(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}
