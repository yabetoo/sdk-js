/**
 * SDK Configuration
 * Manages environment detection and base URL configuration
 */

export type EnvironmentType = 'sandbox' | 'production';

export interface HttpClientOptions {
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Maximum number of retries (default: 3) */
  maxRetries?: number;
  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;
  /** Custom headers to include in requests */
  customHeaders?: Record<string, string>;
}

export interface YabetooConfigOptions {
  secretKey: string;
  options?: HttpClientOptions;
}

export class YabetooConfig {
  readonly secretKey: string;
  readonly environment: EnvironmentType;
  readonly checkoutBaseUrl: string;
  readonly paymentBaseUrl: string;
  readonly options: Required<HttpClientOptions>;

  private static readonly CHECKOUT_BASE_URL = 'https://buy.api.yabetoopay.com/v1';
  private static readonly PAYMENT_BASE_URL_PRODUCTION = 'https://pay.api.yabetoopay.com/v1';
  private static readonly PAYMENT_BASE_URL_SANDBOX = 'https://pay.sandbox.yabetoopay.com/v1';

  constructor(config: YabetooConfigOptions) {
    this.validateSecretKey(config.secretKey);

    this.secretKey = config.secretKey;
    this.environment = this.detectEnvironment(config.secretKey);
    this.checkoutBaseUrl = YabetooConfig.CHECKOUT_BASE_URL;
    this.paymentBaseUrl = this.environment === 'sandbox'
      ? YabetooConfig.PAYMENT_BASE_URL_SANDBOX
      : YabetooConfig.PAYMENT_BASE_URL_PRODUCTION;

    this.options = {
      timeout: config.options?.timeout ?? 30000,
      maxRetries: config.options?.maxRetries ?? 3,
      retryDelay: config.options?.retryDelay ?? 1000,
      customHeaders: config.options?.customHeaders ?? {},
    };
  }

  private validateSecretKey(secretKey: string): void {
    if (!secretKey || typeof secretKey !== 'string') {
      throw new Error('Secret key is required and must be a non-empty string');
    }

    if (!secretKey.startsWith('sk_test') && !secretKey.startsWith('sk_live')) {
      throw new Error('Invalid secret key format. Key must start with "sk_test" or "sk_live"');
    }
  }

  private detectEnvironment(secretKey: string): EnvironmentType {
    return secretKey.startsWith('sk_test') ? 'sandbox' : 'production';
  }

  isSandbox(): boolean {
    return this.environment === 'sandbox';
  }

  isProduction(): boolean {
    return this.environment === 'production';
  }
}
