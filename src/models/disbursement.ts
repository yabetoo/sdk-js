/**
 * Disbursement types and interfaces
 */

import { PaymentMethodData, serializePaymentMethodData } from './payment';

/**
 * Request to create a disbursement
 */
export interface CreateDisbursementRequest {
  /** Amount to disburse */
  amount: number;
  /** Currency code (e.g., 'XAF') */
  currency: string;
  /** Recipient first name */
  firstName: string;
  /** Recipient last name */
  lastName: string;
  /** Payment method data */
  paymentMethodData: PaymentMethodData;
}

/**
 * Disbursement details
 */
export interface Disbursement {
  /** Disbursement ID */
  id: string;
  /** Amount */
  amount: number;
  /** Currency code */
  currency: string;
  /** Disbursement status */
  status: string;
  /** Recipient first name */
  firstName: string;
  /** Recipient last name */
  lastName: string;
  /** Operator name (e.g., 'mtn', 'airtel') */
  operatorName: string;
  /** Country code */
  country: string;
  /** Phone number */
  phone: string;
  /** Object type */
  object: string;
  /** Disbursement type */
  type: number;
  /** Scheduled execution timestamp */
  shouldExecutedAt: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Convert CreateDisbursementRequest to API format (snake_case)
 */
export function serializeCreateDisbursementRequest(
  request: CreateDisbursementRequest
): Record<string, unknown> {
  return {
    amount: request.amount,
    currency: request.currency,
    first_name: request.firstName,
    last_name: request.lastName,
    payment_method_data: serializePaymentMethodData(request.paymentMethodData),
  };
}

/**
 * Parse Disbursement from API response
 */
export function parseDisbursement(data: unknown): Disbursement {
  const d = data as Record<string, unknown>;
  return {
    id: d.id as string,
    amount: d.amount as number,
    currency: d.currency as string,
    status: d.status as string,
    firstName: (d.firstName ?? d.first_name) as string,
    lastName: (d.lastName ?? d.last_name) as string,
    operatorName: (d.operatorName ?? d.operator_name) as string,
    country: d.country as string,
    phone: d.phone as string,
    object: d.object as string,
    type: d.type as number,
    shouldExecutedAt: (d.shouldExecutedAt ?? d.should_executed_at) as string,
    createdAt: (d.createdAt ?? d.created_at) as string,
    updatedAt: (d.updatedAt ?? d.updated_at) as string,
  };
}
