/**
 * Challenge 26: RBAC - Permission Control
 *
 * Role-based access control service.
 */

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  inheritsFrom?: string;
}

export interface Permission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
  conditions?: Record<string, unknown>;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface AccessLog {
  userId: string;
  resource: string;
  action: string;
  allowed: boolean;
  timestamp: string;
  ip?: string;
}

export interface AuthContext {
  userId: string;
  roles: string[];
  permissions: Permission[];
}

/**
 * Load roles from a JSON file (array of Role, ids preserved)
 */
export async function loadRoles(filePath: string): Promise<Role[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Create new role
 */
export async function createRole(role: Omit<Role, "id">): Promise<Role> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Assign role to user
 */
export async function assignRole(
  userId: string,
  roleId: string,
  assignedBy: string,
): Promise<UserRole> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Check if user has permission
 */
export async function checkPermission(
  userId: string,
  resource: string,
  action: string,
  conditions?: Record<string, unknown>,
): Promise<boolean> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Authorization middleware. Reads the user from the "X-User-Id" header
 * and the IP from "X-Forwarded-For"; every decision is logged.
 */
export function authorizationMiddleware(
  resource: string,
  action: string,
): (req: Request) => Promise<boolean> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Registers access log
 */
export async function logAccess(
  log: Omit<AccessLog, "timestamp">,
): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * List access logs, optionally filtered by user
 */
export function getAccessLogs(userId?: string): AccessLog[] {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Get user permissions (including inherited ones)
 */
export async function getPermissions(userId: string): Promise<Permission[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}
