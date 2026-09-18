/**
 * Challenge 20: Complete REST API
 * 
 * Product service with complete CRUD.
 */

export interface Product {
  id: number;
  nome: string;
  description?: string;
  preco: number;
  category: string;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

/**
 * List products with pagination, filters and sorting
 */
export function listProducts(
  page: number = 1,
  limit: number = 10,
  filters: FilterOptions = {},
  sort: SortOptions = { field: "id", direction: "asc" }
): PaginatedResult<Product> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Find product by ID
 */
export function findById(id: number): Product | undefined {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Create product
 */
export function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Update product
 */
export function updateProduct(id: number, data: Partial<Product>): Product | null {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Delete product
 */
export function deleteProduct(id: number): boolean {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * List categories
 */
export function listCategories(): string[] {
  // TODO: Implement
  throw new Error("Not implemented");
}
