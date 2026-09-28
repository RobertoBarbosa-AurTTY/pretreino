/**
 * Challenge 29: Asynchronous Processing
 *
 * Asynchronous processing service with workers.
 */

export interface Task<TInput, TOutput> {
  id: string;
  type: string;
  input: TInput;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "processing" | "completed" | "failed" | "canceled";
  result?: TOutput;
  error?: string;
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  attempts: number;
  maxAttempts: number;
}

export interface WorkerConfig {
  maxConcurrent: number;
  timeout: number;
  healthCheckInterval: number;
}

export interface ProgressUpdate {
  taskId: string;
  progress: number;
  message?: string;
  stage?: string;
}

export interface WorkerStats {
  totalProcessed: number;
  completed: number;
  failures: number;
  avgTime: number;
  currentQueue: number;
}

/**
 * Data needed to enqueue a task (maxAttempts defaults to 3)
 */
export type NewTask<TInput> =
  & Pick<Task<TInput, unknown>, "type" | "input" | "priority">
  & { maxAttempts?: number };

/**
 * Function that processes one task of a given type
 */
export type TaskHandler<TInput, TOutput> = (
  input: TInput,
  context: {
    /** Report progress (0-100) */
    onProgress: (progress: number, message?: string) => void;
    /** Aborted when the task is canceled or times out */
    signal: AbortSignal;
  },
) => Promise<TOutput>;

/**
 * WorkerPool interface
 */
export interface WorkerPool {
  /** Register handler for task type */
  register<TInput, TOutput>(
    type: string,
    handler: TaskHandler<TInput, TOutput>,
  ): void;
  /** Add task to queue */
  add<TInput>(task: NewTask<TInput>): Promise<Task<TInput, unknown>>;
  /** Current snapshot of a task */
  get(taskId: string): Task<unknown, unknown> | undefined;
  /** Resolves when the task reaches completed, failed or canceled */
  wait(taskId: string): Promise<Task<unknown, unknown>>;
  /** Cancel task */
  cancel(taskId: string): Promise<boolean>;
  /** Monitor progress of all tasks; returns an unsubscribe function */
  onProgress(callback: (update: ProgressUpdate) => void): () => void;
  stats(): WorkerStats;
  /** Stop accepting tasks and wait until all accepted tasks finish */
  shutdown(): Promise<void>;
}

/**
 * Create worker pool
 */
export function createPool(config: WorkerConfig): WorkerPool {
  // TODO: Implement
  throw new Error("Not implemented");
}
