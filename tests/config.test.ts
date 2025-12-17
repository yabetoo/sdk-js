import { YabetooConfig } from '../src/config';

describe('YabetooConfig', () => {
  describe('constructor', () => {
    it('should create config with test key in sandbox mode', () => {
      const config = new YabetooConfig({ secretKey: 'sk_test_123' });

      expect(config.secretKey).toBe('sk_test_123');
      expect(config.environment).toBe('sandbox');
      expect(config.isSandbox()).toBe(true);
      expect(config.isProduction()).toBe(false);
    });

    it('should create config with live key in production mode', () => {
      const config = new YabetooConfig({ secretKey: 'sk_live_456' });

      expect(config.secretKey).toBe('sk_live_456');
      expect(config.environment).toBe('production');
      expect(config.isSandbox()).toBe(false);
      expect(config.isProduction()).toBe(true);
    });

    it('should use correct base URLs for sandbox', () => {
      const config = new YabetooConfig({ secretKey: 'sk_test_123' });

      expect(config.checkoutBaseUrl).toBe('https://buy.api.yabetoopay.com/v1');
      expect(config.paymentBaseUrl).toBe('https://pay.sandbox.yabetoopay.com/v1');
    });

    it('should use correct base URLs for production', () => {
      const config = new YabetooConfig({ secretKey: 'sk_live_456' });

      expect(config.checkoutBaseUrl).toBe('https://buy.api.yabetoopay.com/v1');
      expect(config.paymentBaseUrl).toBe('https://pay.api.yabetoopay.com/v1');
    });

    it('should throw error for empty secret key', () => {
      expect(() => new YabetooConfig({ secretKey: '' })).toThrow(
        'Secret key is required and must be a non-empty string'
      );
    });

    it('should throw error for invalid secret key format', () => {
      expect(() => new YabetooConfig({ secretKey: 'invalid_key' })).toThrow(
        'Invalid secret key format'
      );
    });

    it('should apply default options', () => {
      const config = new YabetooConfig({ secretKey: 'sk_test_123' });

      expect(config.options.timeout).toBe(30000);
      expect(config.options.maxRetries).toBe(3);
      expect(config.options.retryDelay).toBe(1000);
      expect(config.options.customHeaders).toEqual({});
    });

    it('should apply custom options', () => {
      const config = new YabetooConfig({
        secretKey: 'sk_test_123',
        options: {
          timeout: 60000,
          maxRetries: 5,
          retryDelay: 2000,
          customHeaders: { 'X-Custom': 'value' },
        },
      });

      expect(config.options.timeout).toBe(60000);
      expect(config.options.maxRetries).toBe(5);
      expect(config.options.retryDelay).toBe(2000);
      expect(config.options.customHeaders).toEqual({ 'X-Custom': 'value' });
    });
  });
});
