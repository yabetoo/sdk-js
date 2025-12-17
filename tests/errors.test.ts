import {
  YabetooError,
  ValidationError,
  APIError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  parseAPIError,
} from '../src/errors';

describe('Error Classes', () => {
  describe('YabetooError', () => {
    it('should create error with message', () => {
      const error = new YabetooError({ message: 'Test error' });

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('YabetooError');
    });

    it('should create error with all options', () => {
      const error = new YabetooError({
        message: 'Test error',
        code: 'test_code',
        statusCode: 400,
        errors: [{ field: 'amount', message: 'Amount is required' }],
        raw: { foo: 'bar' },
      });

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('test_code');
      expect(error.statusCode).toBe(400);
      expect(error.errors).toHaveLength(1);
      expect(error.raw).toEqual({ foo: 'bar' });
    });

    it('should format toString with validation errors', () => {
      const error = new YabetooError({
        message: 'Validation failed',
        code: 'validation_error',
        statusCode: 400,
        errors: [
          { field: 'amount', message: 'Amount is required' },
          { field: 'currency', message: 'Invalid currency' },
        ],
      });

      const str = error.toString();
      expect(str).toContain('Validation failed');
      expect(str).toContain('(code: validation_error)');
      expect(str).toContain('[HTTP 400]');
      expect(str).toContain('amount: Amount is required');
      expect(str).toContain('currency: Invalid currency');
    });
  });

  describe('ValidationError', () => {
    it('should have correct name', () => {
      const error = new ValidationError({ message: 'Invalid input' });
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('APIError', () => {
    it('should have correct name', () => {
      const error = new APIError({ message: 'API error' });
      expect(error.name).toBe('APIError');
    });
  });

  describe('NetworkError', () => {
    it('should have correct name', () => {
      const error = new NetworkError({ message: 'Network error' });
      expect(error.name).toBe('NetworkError');
    });
  });

  describe('AuthenticationError', () => {
    it('should have correct name', () => {
      const error = new AuthenticationError({ message: 'Auth error' });
      expect(error.name).toBe('AuthenticationError');
    });
  });

  describe('RateLimitError', () => {
    it('should have correct name and retryAfter', () => {
      const error = new RateLimitError({
        message: 'Rate limited',
        retryAfter: 60,
      });
      expect(error.name).toBe('RateLimitError');
      expect(error.retryAfter).toBe(60);
    });
  });
});

describe('parseAPIError', () => {
  it('should return ValidationError for 400 status', () => {
    const error = parseAPIError({
      status: 400,
      data: { message: 'Bad request' },
    });

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.statusCode).toBe(400);
  });

  it('should return AuthenticationError for 401 status', () => {
    const error = parseAPIError({
      status: 401,
      data: { message: 'Unauthorized' },
    });

    expect(error).toBeInstanceOf(AuthenticationError);
  });

  it('should return AuthenticationError for 403 status', () => {
    const error = parseAPIError({
      status: 403,
      data: { message: 'Forbidden' },
    });

    expect(error).toBeInstanceOf(AuthenticationError);
  });

  it('should return RateLimitError for 429 status', () => {
    const error = parseAPIError({
      status: 429,
      data: { message: 'Too many requests' },
      headers: { 'retry-after': '30' },
    });

    expect(error).toBeInstanceOf(RateLimitError);
    expect((error as RateLimitError).retryAfter).toBe(30);
  });

  it('should return APIError for other status codes', () => {
    const error = parseAPIError({
      status: 500,
      data: { message: 'Internal server error' },
    });

    expect(error).toBeInstanceOf(APIError);
  });

  it('should parse nested error format', () => {
    const error = parseAPIError({
      status: 400,
      data: {
        error: {
          message: 'Invalid amount',
          code: 'invalid_amount',
        },
      },
    });

    expect(error.message).toBe('Invalid amount');
    expect(error.code).toBe('invalid_amount');
  });

  it('should parse validation errors array', () => {
    const error = parseAPIError({
      status: 400,
      data: {
        message: 'Validation failed',
        errors: [
          { field: 'amount', message: 'Required' },
          { path: 'currency', message: 'Invalid' },
        ],
      },
    });

    expect(error.errors).toHaveLength(2);
    expect(error.errors![0].field).toBe('amount');
    expect(error.errors![1].field).toBe('currency');
  });
});
