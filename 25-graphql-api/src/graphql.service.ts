/**
 * Challenge 25: GraphQL API
 *
 * GraphQL service with resolvers and subscriptions.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  posts: Post[];
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  published: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
  published?: boolean;
}

export interface PostFilter {
  authorId?: string;
  published?: boolean;
}

/**
 * Create GraphQL schema
 */
export function createSchema(): string {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Execute GraphQL query. Resolves with the `data` of the result;
 * rejects if the result contains `errors`.
 */
export async function executeQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Execute GraphQL mutation. Resolves with the `data` of the result;
 * rejects if the result contains `errors`.
 */
export async function executeMutation<T>(
  mutation: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Configure subscription (e.g. "subscription { postCreated { id title } }").
 * The callback receives the subscription data, e.g. { postCreated: {...} }.
 * Returns a function that cancels the subscription.
 */
export function subscribe<T>(
  query: string,
  callback: (data: T) => void,
): () => void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Resolver: gets all users
 */
export async function resolveUsers(): Promise<User[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Resolver: gets user by ID
 */
export async function resolveUser(id: string): Promise<User | null> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Resolver: creates user
 */
export async function resolveCreateUser(
  input: CreateUserInput,
): Promise<User> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Resolver: lists posts, optionally filtered
 */
export async function resolvePosts(filter?: PostFilter): Promise<Post[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Resolver: creates post and notifies "postCreated" subscribers
 */
export async function resolveCreatePost(
  input: CreatePostInput,
): Promise<Post> {
  // TODO: Implement
  throw new Error("Not implemented");
}
