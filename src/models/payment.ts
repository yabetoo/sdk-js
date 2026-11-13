/**
 * Payment-related types and interfaces
 */

import { PaginationParams, Sorting } from './common';

/**
 * Supported countries for mobile money
 */
export type Country = 'cg' | 'fr';

/**
 * Supported mobile money operators
 */
export type OperatorName = 'mtn' | 'airtel';

/**
 * Mobile money payment details
 */
export interface MomoData {
  /** Phone number (MSISDN) */
  msisdn: string;
  /** Country code */
  country: Country;
  /** Mobile operator name */
  operatorName: OperatorName;
}

/**
 * Payment method data wrapper
 */
export interface PaymentMethodData {
  /** Payment type (e.g., 'momo') */
  type: string;
  /** Mobile money details (when type is 'momo') */
  momo: MomoData;
}

/**
 * Request to create a payment intent
 */
export interface CreateIntentRequest {
  /** Amount to charge */
  amount: number;
  /** Currency code (e.g., 'XAF') */
  currency: string;
  /** Description of the payment */
  description?: string;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Response from creating a payment intent
 */
export interface CreateIntentResponse {
  /** Payment intent ID */
  id: string;
  /** Amount */
  amount: number | string;
  /** Currency code */
  currency: string;
  /** Payment label */
  label: string;
  /** Client secret for confirming the payment */
  clientSecret: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Request to confirm a payment intent
 */
export interface ConfirmIntentRequest {
  /** Client secret from create intent response */
  clientSecret: string;
  /** Payment method data */
  paymentMethodData: PaymentMethodData;
  /** Customer first name */
  firstName?: string;
  /** Customer last name */
  lastName?: string;
  /** Receipt email address */
  receiptEmail?: string;
}

/**
 * Response from confirming a payment intent
 */
export interface ConfirmIntentResponse {
  /** Charge ID */
  id: string;
  /** Payment intent ID */
  intentId: string;
  /** Financial transaction ID */
  financialTransactionId: string;
  /** Transaction ID */
  transactionId: string;
  /** Amount */
  amount: number;
  /** Payment status */
  status: string;
  /** Whether the payment was captured */
  captured: boolean;
  /** External reference ID */
  externalId: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Payment method ID */
  paymentMethodId: string;
}

/**
 * Payment intent details
 */
export interface PaymentIntent {
  /** Payment intent ID */
  id: string;
  /** Amount */
  amount: number | string;
  /** Currency code */
  currency: string;
  /** Payment status */
  status: string;
  /** Description */
  description?: string;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
  /** Client secret */
  clientSecret?: string;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
  /** Supported payment method types */
  paymentMethodTypes?: string[];
  /** Payment method ID */
  paymentMethod?: string;
  /** Last payment error */
  lastPaymentError?: string;
  /** Associated charge ID */
  chargeId?: string;
  /** Cancellation timestamp */
  canceledAt?: string;
  /** Cancellation reason */
  cancellationReason?: string;
  /** Whether this is a live mode payment */
  liveMode?: boolean;
  /** Associated payout ID */
  payoutId?: string;
  /** Payment event data */
  event?: Record<string, unknown>;
}

/**
 * Payment filters for listing payments
 */
export interface PaymentFiltersRequest extends PaginationParams {
  /** Sorting configuration */
  sorting?: Sorting[];
}

/**
 * Charge details
 */
export interface Charge {
  /** Charge ID */
  id: string;
  /** Amount */
  amount: number;
  /** Currency */
  currency: string;
  /** Status */
  status: string;
  /** Whether captured */
  captured: boolean;
  /** Payment intent ID */
  paymentIntentId: string;
  /** Creation timestamp */
  createdAt: string;
  /** Update timestamp */
  updatedAt: string;
}

/**
 * Payout details
 */
export interface Payout {
  /** Payout ID */
  id: string;
  /** Amount */
  amount: number;
  /** Currency */
  currency: string;
  /** Status */
  status: string;
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Payment event
 */
export interface PaymentEvent {
  /** Event ID */
  id: string;
  /** Event type */
  type: string;
  /** Event data */
  data: Record<string, unknown>;
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Convert camelCase API response to PaymentIntent
 */
export function parsePaymentIntent(data: unknown): PaymentIntent {
  const d = data as Record<string, unknown>;
  return {
    id: d.id as string,
    amount: d.amount as number | string,
    currency: d.currency as string,
    status: d.status as string,
    description: d.description as string | undefined,
    metadata: d.metadata as Record<string, unknown> | undefined,
    clientSecret: (d.clientSecret ?? d.client_secret) as string | undefined,
    createdAt: (d.createdAt ?? d.created_at) as string | undefined,
    updatedAt: (d.updatedAt ?? d.updated_at) as string | undefined,
    paymentMethodTypes: (d.paymentMethodTypes ?? d.payment_method_types) as string[] | undefined,
    paymentMethod: (d.paymentMethod ?? d.payment_method) as string | undefined,
    lastPaymentError: (d.lastPaymentError ?? d.last_payment_error) as string | undefined,
    chargeId: (d.chargeId ?? d.charge_id) as string | undefined,
    canceledAt: (d.canceledAt ?? d.canceled_at) as string | undefined,
    cancellationReason: (d.cancellationReason ?? d.cancellation_reason) as string | undefined,
    liveMode: (d.liveMode ?? d.live_mode) as boolean | undefined,
    payoutId: (d.payoutId ?? d.payout_id) as string | undefined,
    event: d.event as Record<string, unknown> | undefined,
  };
}

/**
 * Convert CreateIntentRequest to API format
 */
export function serializeCreateIntentRequest(
  request: CreateIntentRequest
): Record<string, unknown> {
  return {
    amount: request.amount,
    currency: request.currency,
    description: request.description,
    metadata: request.metadata,
  };
}

/**
 * Convert PaymentMethodData to API format (snake_case)
 */
export function serializePaymentMethodData(
  data: PaymentMethodData
): Record<string, unknown> {
  return {
    type: data.type,
    momo: {
      msisdn: data.momo.msisdn,
      country: data.momo.country,
      operator_name: data.momo.operatorName,
    },
  };
}

/**
 * Convert ConfirmIntentRequest to API format (snake_case)
 */
export function serializeConfirmIntentRequest(
  request: ConfirmIntentRequest
): Record<string, unknown> {
  return {
    client_secret: request.clientSecret,
    payment_method_data: serializePaymentMethodData(request.paymentMethodData),
    first_name: request.firstName,
    last_name: request.lastName,
    receipt_email: request.receiptEmail,
  };
}

/**
 * Parse CreateIntentResponse from API
 */
export function parseCreateIntentResponse(data: unknown): CreateIntentResponse {
  const d = data as Record<string, unknown>;
  return {
    id: d.id as string,
    amount: d.amount as number | string,
    currency: d.currency as string,
    label: d.label as string,
    clientSecret: (d.clientSecret ?? d.client_secret) as string,
    createdAt: (d.createdAt ?? d.created_at) as string,
    updatedAt: (d.updatedAt ?? d.updated_at) as string,
  };
}

/**
 * Parse ConfirmIntentResponse from API
 */
export function parseConfirmIntentResponse(data: unknown): ConfirmIntentResponse {
  const d = data as Record<string, unknown>;
  return {
    id: (d.id ?? d.charge_id) as string,
    intentId: (d.intentId ?? d.intent_id) as string,
    financialTransactionId: (d.financialTransactionId ?? d.financial_transaction_Id) as string,
    transactionId: (d.transactionId ?? d.transaction_id) as string,
    amount: d.amount as number,
    status: d.status as string,
    captured: d.captured as boolean,
    externalId: (d.externalId ?? d.external_id) as string,
    createdAt: (d.createdAt ?? d.created_at) as string,
    updatedAt: (d.updatedAt ?? d.updated_at) as string,
    paymentMethodId: (d.paymentMethodId ?? d.payment_method_id) as string,
  };
}
