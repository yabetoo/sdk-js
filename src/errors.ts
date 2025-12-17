/**
 * Error classes for the Yabetoo SDK
 * Provides typed error handling for API and network errors
 */

export interface FieldError {
  field: string;
  message: string;
}

export interface YabetooErrorOptions {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: FieldError[];
  raw?: unknown;
}

/**
 * Base error class for all Yabetoo SDK errors
 */
export class YabetooError extends Error {
  readonly code?: string;
  readonly statusCode?: number;
  readonly errors?: FieldError[];
  readonly raw?: unknown;

  constructor(options: YabetooErrorOptions) {
    super(options.message);
    this.name = 'YabetooError';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.errors = options.errors;
    this.raw = options.raw;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YabetooError);
    }
  }

  toString(): string {
    let result = `${this.name}: ${this.message}`;

    if (this.code) {
      result += ` (code: ${this.code})`;
    }

    if (this.statusCode) {
      result += ` [HTTP ${this.statusCode}]`;
    }

    if (this.errors && this.errors.length > 0) {
      result += '\nValidation errors:';
      for (const error of this.errors) {
        result += `\n  - ${error.field}: ${error.message}`;
      }
    }

    return result;
  }
}

/**
 * Error thrown when request validation fails
 */
export class ValidationError extends YabetooError {
  constructor(options: YabetooErrorOptions) {
    super(options);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when the API returns an error response
 */
export class APIError extends YabetooError {
  constructor(options: YabetooErrorOptions) {
    super(options);
    this.name = 'APIError';
  }
}

/**
 * Error thrown when a network error occurs
 */
export class NetworkError extends YabetooError {
  constructor(options: YabetooErrorOptions) {
    super(options);
    this.name = 'NetworkError';
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends YabetooError {
  constructor(options: YabetooErrorOptions) {
    super(options);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends YabetooError {
  readonly retryAfter?: number;

  constructor(options: YabetooErrorOptions & { retryAfter?: number }) {
    super(options);
    this.name = 'RateLimitError';
    this.retryAfter = options.retryAfter;
  }
}

/**
 * Parse API error response and return appropriate error class
 */
export function parseAPIError(response: {
  status: number;
  data?: unknown;
  headers?: Record<string, string>;
}): YabetooError {
  const { status, data, headers } = response;

  let message = 'An unexpected error occurred';
  let code: string | undefined;
  let errors: FieldError[] | undefined;

  // Parse error from response data
  if (data && typeof data === 'object') {
    const errorData = data as Record<string, unknown>;

    // Handle different error response formats
    if ('error' in errorData && typeof errorData.error === 'object') {
      const error = errorData.error as Record<string, unknown>;
      message = (error.message as string) || message;
      code = error.code as string | undefined;
    } else if ('message' in errorData) {
      message = errorData.message as string;
      code = errorData.code as string | undefined;
    }

    // Handle validation errors array
    if ('errors' in errorData && Array.isArray(errorData.errors)) {
      errors = errorData.errors.map((e: unknown) => {
        if (typeof e === 'object' && e !== null) {
          const err = e as Record<string, unknown>;
          return {
            field: (err.field as string) || (err.path as string) || 'unknown',
            message: (err.message as string) || 'Validation failed',
          };
        }
        return { field: 'unknown', message: String(e) };
      });
    }
  }

  const errorOptions: YabetooErrorOptions = {
    message,
    code,
    statusCode: status,
    errors,
    raw: data,
  };

  // Return appropriate error type based on status code
  switch (status) {
    case 400:
      return new ValidationError(errorOptions);
    case 401:
    case 403:
      return new AuthenticationError({
        ...errorOptions,
        message: message || 'Authentication failed. Please check your API key.',
      });
    case 429:
      return new RateLimitError({
        ...errorOptions,
        message: message || 'Rate limit exceeded. Please try again later.',
        retryAfter: headers?.['retry-after'] ? parseInt(headers['retry-after'], 10) : undefined,
      });
    default:
      return new APIError(errorOptions);
  }
}
