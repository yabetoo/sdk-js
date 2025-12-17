/**
 * Sessions Resource
 * Handles checkout session operations
 */

import { HttpClient } from '../http-client';
import {
  CheckoutSession,
  CreateCheckoutSessionRequest,
  parseCheckoutSession,
  serializeCreateCheckoutSessionRequest,
} from '../models/checkout';
import { ResourceBase } from './base';

export class Sessions extends ResourceBase {
  constructor(client: HttpClient) {
    super(client);
  }

  /**
   * Create a new checkout session
   *
   * Creates a hosted checkout page that can be used to collect payments.
   * The returned session includes a URL that you can redirect your customer to.
   *
   * @param data - The checkout session creation data
   * @returns The created checkout session with URL
   *
   * @example
   * ```ts
   * const session = await yabetoo.sessions.create({
   *   accountId: 'acc_xxx',
   *   total: 10000,
   *   currency: 'XAF',
   *   successUrl: 'https://example.com/success',
   *   cancelUrl: 'https://example.com/cancel',
   *   items: [
   *     {
   *       productId: 'prod_xxx',
   *       productName: 'T-Shirt',
   *       price: 5000,
   *       quantity: 2
   *     }
   *   ]
   * });
   *
   * // Redirect customer to hosted checkout
   * window.location.href = session.url;
   * ```
   */
  async create(data: CreateCheckoutSessionRequest): Promise<CheckoutSession> {
    const response = await this.client.post<Record<string, unknown>>(
      '/sessions',
      serializeCreateCheckoutSessionRequest(data)
    );
    return parseCheckoutSession(response);
  }
}
