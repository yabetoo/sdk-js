/**
 * Yabetoo SDK for JavaScript/TypeScript
 *
 * Official SDK for the Yabetoo Payment Platform.
 * Supports payments, checkout sessions, disbursements, and remittances.
 *
 * @example
 * ```ts
 * import Yabetoo from 'yabetoo';
 *
 * const yabetoo = new Yabetoo('sk_test_xxx');
 *
 * // Create a payment
 * const intent = await yabetoo.payments.create({
 *   amount: 5000,
 *   currency: 'XAF'
 * });
 * ```
 *
 * @packageDocumentation
 */

// Main SDK class
export { Yabetoo, default } from './yabetoo';
export type { YabetooSDKOptions } from './yabetoo';

// Configuration
export { YabetooConfig } from './config';
export type { HttpClientOptions, EnvironmentType, YabetooConfigOptions } from './config';

// Errors
export {
  YabetooError,
  ValidationError,
  APIError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
} from './errors';
export type { FieldError, YabetooErrorOptions } from './errors';

// Resources
export { Payments, Sessions, Disbursements, Remittances } from './resources';

// Models - Common
export type {
  Sorting,
  PaginationParams,
  PaginatedResponse,
} from './models/common';

// Models - Payment
export type {
  Country,
  OperatorName,
  MomoData,
  PaymentMethodData,
  CreateIntentRequest,
  CreateIntentResponse,
  ConfirmIntentRequest,
  ConfirmIntentResponse,
  PaymentIntent,
  PaymentFiltersRequest,
  Charge,
  Payout,
  PaymentEvent,
} from './models/payment';

// Models - Checkout
export type {
  CheckoutItem,
  CreateCheckoutSessionRequest,
  CheckoutSession,
} from './models/checkout';

// Models - Disbursement
export type {
  CreateDisbursementRequest,
  Disbursement,
} from './models/disbursement';

// Models - Remittance
export type {
  CreateRemittanceRequest,
  CreateRemittanceResponse,
  Remittance,
} from './models/remittance';
