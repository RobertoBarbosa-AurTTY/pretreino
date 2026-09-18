/**
 * Challenge 47: Search Engine - Service
 */

export interface Document {
  id: string;
  type: string;
  fields: Record<string, string>;
  indexedAt: string;
}

export interface SearchResult {
  document: Document;
  score: number;
  highlights: Record<string, string>;
}

export interface SearchQuery {
  text: string;
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

export interface SearchEngine {
  index(doc: Document): void;
  search(query: SearchQuery): SearchResult[];
  remove(id: string): void;
  autocomplete(prefix: string): string[];
}

export function createEngine(): SearchEngine {
  // TODO: Implement
  throw new Error("Not implemented");
}