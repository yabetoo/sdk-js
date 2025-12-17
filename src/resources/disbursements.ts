/**
 * Disbursements Resource
 * Handles disbursement (payout) operations
 */

import { HttpClient } from '../http-client';
import {
  CreateDisbursementRequest,
  Disbursement,
  parseDisbursement,
  serializeCreateDisbursementRequest,
} from '../models/disbursement';
import { ResourceBase } from './base';

export class Disbursements extends ResourceBase {
  constructor(client: HttpClient) {
    super(client);
  }

  /**
   * Create a new disbursement
   *
   * Sends money to a recipient via mobile money.
   *
   * @param data - The disbursement creation data
   * @returns The created disbursement
   *
   * @example
   * ```ts
   * const disbursement = await yabetoo.disbursements.create({
   *   amount: 5000,
   *   currency: 'XAF',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   paymentMethodData: {
   *     type: 'momo',
   *     momo: {
   *       msisdn: '242064000000',
   *       country: 'cg',
   *       operatorName: 'mtn'
   *     }
   *   }
   * });
   * console.log(disbursement.status);
   * ```
   */
  async create(data: CreateDisbursementRequest): Promise<Disbursement> {
    const response = await this.client.post<Record<string, unknown>>(
      '/disbursements',
      serializeCreateDisbursementRequest(data)
    );
    return parseDisbursement(response);
  }

  /**
   * Retrieve a disbursement by ID
   *
   * @param disbursementId - The disbursement ID
   * @returns The disbursement details
   *
   * @example
   * ```ts
   * const disbursement = await yabetoo.disbursements.retrieve('dis_xxx');
   * console.log(disbursement.status);
   * ```
   */
  async retrieve(disbursementId: string): Promise<Disbursement> {
    const response = await this.client.get<Record<string, unknown>>(
      `/disbursements/${disbursementId}`
    );
    return parseDisbursement(response);
  }
}
