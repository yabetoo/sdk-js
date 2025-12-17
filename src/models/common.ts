/**
 * Common types and interfaces used across the SDK
 */

/**
 * Sorting configuration for paginated requests
 */
export interface Sorting {
  /** Field to sort by (e.g., 'createdAt', 'amount') */
  id: string;
  /** Sort direction (true for descending) */
  desc: boolean;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  perPage?: number;
  /** Sorting configuration */
  sorting?: Sorting[];
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** List of items */
  items: T[];
  /** Whether there are more pages */
  hasMore: boolean;
  /** Total number of items */
  totalCount: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  perPage: number;
}

/**
 * Convert pagination params to query params
 */
export function paginationToQueryParams(
  params?: PaginationParams
): Record<string, string | number | undefined> {
  if (!params) return {};

  const query: Record<string, string | number | undefined> = {
    page: params.page,
    per_page: params.perPage,
  };

  if (params.sorting && params.sorting.length > 0) {
    // Serialize sorting as JSON
    query.sorting = JSON.stringify(params.sorting);
  }

  return query;
}

/**
 * Parse paginated response from API
 */
export function parsePaginatedResponse<T>(
  data: Record<string, unknown>,
  parseItem: (item: unknown) => T
): PaginatedResponse<T> {
  const rawItems = (data.data as unknown[]) || (data.items as unknown[]) || [];

  return {
    items: rawItems.map(parseItem),
    hasMore: Boolean(data.hasMore ?? data.has_more),
    totalCount: Number(data.totalCount ?? data.total_count ?? data.total ?? 0),
    page: Number(data.page ?? 1),
    perPage: Number(data.perPage ?? data.per_page ?? 10),
  };
}
