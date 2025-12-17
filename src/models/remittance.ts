/**
 * Remittance types and interfaces
 */

import { PaymentMethodData } from './payment';

/**
 * Request to create a remittance
 */
export interface CreateRemittanceRequest {
  /** Amount to send */
  amount: number | string;
  /** Currency code (e.g., 'XAF') */
  currency: string;
  /** Recipient first name */
  firstName: string;
  /** Recipient last name */
  lastName: string;
  /** Payment method data */
  paymentMethodData: PaymentMethodData;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Response from creating a remittance
 */
export interface CreateRemittanceResponse {
  /** Remittance ID */
  id: string;
  /** Status */
  status: string;
  /** Amount */
  amount: number;
  /** Currency */
  currency: string;
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Full remittance details
 */
export interface Remittance {
  /** Remittance ID */
  id: string;
  /** Object type */
  object: string;
  /** Wallet ID */
  walletId: string;
  /** Financial transaction ID */
  financialTransactionId: string;
  /** Transaction ID */
  transactionId: string;
  /** Amount */
  amount: number;
  /** Currency code */
  currency: string;
  /** Remittance status */
  status: string;
  /** Failure code (if failed) */
  failureCode?: string;
  /** Failure message (if failed) */
  failureMessage?: string;
  /** External reference ID */
  externalId: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Execution timestamp */
  executedAt: string;
  /** Scheduled execution timestamp */
  shouldExecutedAt: string;
  /** OTP code (if applicable) */
  otp?: string;
  /** Phone number */
  phone: string;
  /** Country code */
  country: string;
  /** Operator name */
  operatorName: string;
  /** Recipient first name */
  firstName: string;
  /** Recipient last name */
  lastName: string;
  /** Remittance type */
  type: number;
}

/**
 * Convert CreateRemittanceRequest to API format (camelCase)
 */
export function serializeCreateRemittanceRequest(
  request: CreateRemittanceRequest
): Record<string, unknown> {
  return {
    amount: request.amount,
    currency: request.currency,
    firstName: request.firstName,
    lastName: request.lastName,
    paymentMethodData: {
      type: request.paymentMethodData.type,
      momo: {
        msisdn: request.paymentMethodData.momo.msisdn,
        country: request.paymentMethodData.momo.country,
        operatorName: request.paymentMethodData.momo.operatorName,
      },
    },
    metadata: request.metadata,
  };
}

/**
 * Parse CreateRemittanceResponse from API response
 */
export function parseCreateRemittanceResponse(data: unknown): CreateRemittanceResponse {
  const d = data as Record<string, unknown>;
  return {
    id: d.id as string,
    status: d.status as string,
    amount: d.amount as number,
    currency: d.currency as string,
    createdAt: (d.createdAt ?? d.created_at) as string,
  };
}

/**
 * Parse Remittance from API response
 */
export function parseRemittance(data: unknown): Remittance {
  const d = data as Record<string, unknown>;
  return {
    id: d.id as string,
    object: d.object as string,
    walletId: (d.walletId ?? d.wallet_id) as string,
    financialTransactionId: (d.financialTransactionId ?? d.financial_transaction_id) as string,
    transactionId: (d.transactionId ?? d.transaction_id) as string,
    amount: d.amount as number,
    currency: d.currency as string,
    status: d.status as string,
    failureCode: (d.failureCode ?? d.failure_code) as string | undefined,
    failureMessage: (d.failureMessage ?? d.failure_message) as string | undefined,
    externalId: (d.externalId ?? d.external_id) as string,
    createdAt: (d.createdAt ?? d.created_at) as string,
    updatedAt: (d.updatedAt ?? d.updated_at) as string,
    executedAt: (d.executedAt ?? d.executed_at) as string,
    shouldExecutedAt: (d.shouldExecutedAt ?? d.should_executed_at) as string,
    otp: d.otp as string | undefined,
    phone: d.phone as string,
    country: d.country as string,
    operatorName: (d.operatorName ?? d.operator_name) as string,
    firstName: (d.firstName ?? d.first_name) as string,
    lastName: (d.lastName ?? d.last_name) as string,
    type: d.type as number,
  };
}
