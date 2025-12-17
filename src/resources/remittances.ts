/**
 * Remittances Resource
 * Handles international remittance operations
 */

import { HttpClient } from '../http-client';
import {
  CreateRemittanceRequest,
  CreateRemittanceResponse,
  parseCreateRemittanceResponse,
  parseRemittance,
  Remittance,
  serializeCreateRemittanceRequest,
} from '../models/remittance';
import { ResourceBase } from './base';

export class Remittances extends ResourceBase {
  constructor(client: HttpClient) {
    super(client);
  }

  /**
   * Create a new remittance
   *
   * Initiates an international money transfer.
   *
   * @param data - The remittance creation data
   * @returns The created remittance
   *
   * @example
   * ```ts
   * const remittance = await yabetoo.remittances.create({
   *   amount: 10000,
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
   *   },
   *   metadata: {
   *     reference: 'REM-001'
   *   }
   * });
   * console.log(remittance.status);
   * ```
   */
  async create(data: CreateRemittanceRequest): Promise<CreateRemittanceResponse> {
    const response = await this.client.post<Record<string, unknown>>(
      '/remittance',
      serializeCreateRemittanceRequest(data)
    );
    return parseCreateRemittanceResponse(response);
  }

  /**
   * Retrieve a remittance by ID
   *
   * @param remittanceId - The remittance ID
   * @returns The remittance details
   *
   * @example
   * ```ts
   * const remittance = await yabetoo.remittances.retrieve('rem_xxx');
   * console.log(remittance.status);
   * if (remittance.failureMessage) {
   *   console.error('Failed:', remittance.failureMessage);
   * }
   * ```
   */
  async retrieve(remittanceId: string): Promise<Remittance> {
    const response = await this.client.get<Record<string, unknown>>(
      `/remittance/${remittanceId}`
    );
    return parseRemittance(response);
  }
}
