/**
 * Yabetoo SDK Main Entry Point
 * Official JavaScript/TypeScript SDK for the Yabetoo Payment Platform
 */

import { HttpClientOptions, YabetooConfig } from './config';
import { HttpClient } from './http-client';
import { Disbursements, Payments, Remittances, Sessions } from './resources';

export interface YabetooSDKOptions {
  /** Optional HTTP client configuration */
  options?: HttpClientOptions;
}

/**
 * Yabetoo SDK
 *
 * The main entry point for interacting with the Yabetoo Payment API.
 * Provides access to payments, checkout sessions, disbursements, and remittances.
 *
 * @example
 * ```ts
 * import Yabetoo from 'yabetoo';
 *
 * // Initialize with your secret key
 * const yabetoo = new Yabetoo('sk_test_xxx');
 *
 * // Create a payment intent
 * const intent = await yabetoo.payments.create({
 *   amount: 5000,
 *   currency: 'XAF',
 *   description: 'Order #123'
 * });
 *
 * // Confirm with mobile money
 * const result = await yabetoo.payments.confirm(intent.id, {
 *   clientSecret: intent.clientSecret,
 *   paymentMethodData: {
 *     type: 'momo',
 *     momo: {
 *       msisdn: '242064000000',
 *       country: 'cg',
 *       operatorName: 'mtn'
 *     }
 *   }
 * });
 * ```
 */
export class Yabetoo {
  private readonly config: YabetooConfig;
  private readonly checkoutClient: HttpClient;
  private readonly paymentClient: HttpClient;

  /**
   * Payments API resource
   *
   * Create, confirm, retrieve, and list payment intents.
   */
  readonly payments: Payments;

  /**
   * Checkout Sessions API resource
   *
   * Create hosted checkout sessions for e-commerce integrations.
   */
  readonly sessions: Sessions;

  /**
   * Disbursements API resource
   *
   * Send money to recipients via mobile money.
   */
  readonly disbursements: Disbursements;

  /**
   * Remittances API resource
   *
   * Create and manage international money transfers.
   */
  readonly remittances: Remittances;

  /**
   * Create a new Yabetoo SDK instance
   *
   * @param secretKey - Your Yabetoo secret key (sk_test_* for sandbox, sk_live_* for production)
   * @param sdkOptions - Optional SDK configuration
   *
   * @example
   * ```ts
   * // Sandbox environment
   * const yabetoo = new Yabetoo('sk_test_xxx');
   *
   * // Production environment
   * const yabetoo = new Yabetoo('sk_live_xxx');
   *
   * // With custom options
   * const yabetoo = new Yabetoo('sk_test_xxx', {
   *   options: {
   *     timeout: 60000,
   *     maxRetries: 5
   *   }
   * });
   * ```
   */
  constructor(secretKey: string, sdkOptions?: YabetooSDKOptions) {
    this.config = new YabetooConfig({
      secretKey,
      options: sdkOptions?.options,
    });

    // Create HTTP clients for different API endpoints
    this.checkoutClient = new HttpClient(this.config, this.config.checkoutBaseUrl);
    this.paymentClient = new HttpClient(this.config, this.config.paymentBaseUrl);

    // Initialize resources
    this.payments = new Payments(this.paymentClient);
    this.sessions = new Sessions(this.checkoutClient);
    this.disbursements = new Disbursements(this.paymentClient);
    this.remittances = new Remittances(this.paymentClient);
  }

  /**
   * Check if the SDK is configured for sandbox environment
   */
  isSandbox(): boolean {
    return this.config.isSandbox();
  }

  /**
   * Check if the SDK is configured for production environment
   */
  isProduction(): boolean {
    return this.config.isProduction();
  }

  /**
   * Get the current environment
   */
  get environment(): 'sandbox' | 'production' {
    return this.config.environment;
  }
}

// Default export
export default Yabetoo;
