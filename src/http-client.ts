/**
 * HTTP Client for the Yabetoo SDK
 * Handles all HTTP communication with the API
 */

import { YabetooConfig } from './config';
import { NetworkError, parseAPIError, YabetooError } from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  data?: Record<string, unknown>;
  params?: Record<string, string | number | boolean | undefined>;
}

export class HttpClient {
  private readonly config: YabetooConfig;
  private readonly baseUrl: string;

  constructor(config: YabetooConfig, baseUrl: string) {
    this.config = config;
    this.baseUrl = baseUrl;
  }

  /**
   * Build query string from params object
   */
  private buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Build full URL for request
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const queryString = this.buildQueryString(params);
    return `${this.baseUrl}${path}${queryString}`;
  }

  /**
   * Build headers for request
   */
  private buildHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.secretKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.config.options.customHeaders,
    };
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make HTTP request with retry logic
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, data, params } = options;
    const url = this.buildUrl(path, params);
    const headers = this.buildHeaders();

    let lastError: Error | null = null;
    const maxRetries = this.config.options.maxRetries;
    const retryDelay = this.config.options.retryDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const fetchOptions: RequestInit = {
          method,
          headers,
          signal: AbortSignal.timeout(this.config.options.timeout),
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          fetchOptions.body = JSON.stringify(data);
        }

        const response = await fetch(url, fetchOptions);

        // Parse response
        let responseData: unknown;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          try {
            responseData = JSON.parse(text);
          } catch {
            responseData = { message: text };
          }
        }

        // Handle error responses
        if (!response.ok) {
          const headersRecord: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            headersRecord[key] = value;
          });

          throw parseAPIError({
            status: response.status,
            data: responseData,
            headers: headersRecord,
          });
        }

        return responseData as T;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) except rate limits
        if (error instanceof YabetooError) {
          if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
            throw error;
          }
        }

        // Check if we should retry
        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          await this.sleep(delay);
          continue;
        }

        // Wrap network errors
        if (!(error instanceof YabetooError)) {
          throw new NetworkError({
            message: `Network error: ${(error as Error).message}`,
            raw: error,
          });
        }

        throw error;
      }
    }

    // Should never reach here, but TypeScript needs this
    throw lastError || new NetworkError({ message: 'Request failed after retries' });
  }

  /**
   * Make GET request
   */
  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>({ method: 'GET', path, params });
  }

  /**
   * Make POST request
   */
  async post<T>(path: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>({ method: 'POST', path, data });
  }

  /**
   * Make PUT request
   */
  async put<T>(path: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>({ method: 'PUT', path, data });
  }

  /**
   * Make DELETE request
   */
  async delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', path });
  }
}
