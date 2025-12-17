/**
 * Payments Resource
 * Handles all payment-related API operations
 */

import { HttpClient } from '../http-client';
import {
  PaginatedResponse,
  paginationToQueryParams,
  parsePaginatedResponse,
  Sorting,
} from '../models/common';
import {
  ConfirmIntentRequest,
  ConfirmIntentResponse,
  CreateIntentRequest,
  CreateIntentResponse,
  parseConfirmIntentResponse,
  parseCreateIntentResponse,
  parsePaymentIntent,
  PaymentFiltersRequest,
  PaymentIntent,
  serializeConfirmIntentRequest,
  serializeCreateIntentRequest,
} from '../models/payment';
import { ResourceBase } from './base';

export class Payments extends ResourceBase {
  constructor(client: HttpClient) {
    super(client);
  }

  /**
   * Create a new payment intent
   *
   * @param data - The payment intent creation data
   * @returns The created payment intent
   *
   * @example
   * ```ts
   * const intent = await yabetoo.payments.create({
   *   amount: 5000,
   *   currency: 'XAF',
   *   description: 'Order #123'
   * });
   * console.log(intent.clientSecret);
   * ```
   */
  async create(data: CreateIntentRequest): Promise<CreateIntentResponse> {
    const response = await this.client.post<Record<string, unknown>>(
      '/payment-intents',
      serializeCreateIntentRequest(data)
    );
    return parseCreateIntentResponse(response);
  }

  /**
   * Confirm a payment intent with payment method details
   *
   * @param paymentId - The payment intent ID
   * @param data - The confirmation data including payment method
   * @returns The confirmation result
   *
   * @example
   * ```ts
   * const result = await yabetoo.payments.confirm('pi_xxx', {
   *   clientSecret: 'xxx_secret_xxx',
   *   paymentMethodData: {
   *     type: 'momo',
   *     momo: {
   *       msisdn: '242064000000',
   *       country: 'cg',
   *       operatorName: 'mtn'
   *     }
   *   },
   *   firstName: 'John',
   *   lastName: 'Doe'
   * });
   * ```
   */
  async confirm(
    paymentId: string,
    data: ConfirmIntentRequest
  ): Promise<ConfirmIntentResponse> {
    const response = await this.client.post<Record<string, unknown>>(
      `/payment-intents/${paymentId}/confirm`,
      serializeConfirmIntentRequest(data)
    );
    return parseConfirmIntentResponse(response);
  }

  /**
   * Retrieve a payment intent by ID
   *
   * @param paymentId - The payment intent ID
   * @returns The payment intent details
   *
   * @example
   * ```ts
   * const payment = await yabetoo.payments.retrieve('pi_xxx');
   * console.log(payment.status);
   * ```
   */
  async retrieve(paymentId: string): Promise<PaymentIntent> {
    const response = await this.client.get<Record<string, unknown>>(
      `/payment-intents/${paymentId}`
    );
    return parsePaymentIntent(response);
  }

  /**
   * List all payment intents with optional filtering and pagination
   *
   * @param params - Optional filter and pagination parameters
   * @returns Paginated list of payment intents
   *
   * @example
   * ```ts
   * const payments = await yabetoo.payments.all({
   *   page: 1,
   *   perPage: 20,
   *   sorting: [{ id: 'createdAt', desc: true }]
   * });
   * console.log(payments.items);
   * ```
   */
  async all(params?: PaymentFiltersRequest): Promise<PaginatedResponse<PaymentIntent>> {
    const queryParams = paginationToQueryParams(params);
    const response = await this.client.get<Record<string, unknown>>(
      '/payment-intents',
      queryParams
    );
    return parsePaginatedResponse(response, parsePaymentIntent);
  }

  /**
   * Convenience method for paginated retrieval
   *
   * @param page - Page number (1-indexed)
   * @param perPage - Number of items per page
   * @param sorting - Optional sorting configuration
   * @returns Paginated list of payment intents
   *
   * @example
   * ```ts
   * const page1 = await yabetoo.payments.getPage(1, 10);
   * const page2 = await yabetoo.payments.getPage(2, 10);
   * ```
   */
  async getPage(
    page: number,
    perPage?: number,
    sorting?: Sorting[]
  ): Promise<PaginatedResponse<PaymentIntent>> {
    return this.all({
      page,
      perPage,
      sorting,
    });
  }
}
