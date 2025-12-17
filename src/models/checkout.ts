/**
 * Checkout session types and interfaces
 */

/**
 * Item in a checkout session
 */
export interface CheckoutItem {
  /** Product ID */
  productId: string;
  /** Quantity */
  quantity: number;
  /** Price per item */
  price: number;
  /** Product name */
  productName: string;
}

/**
 * Request to create a checkout session
 */
export interface CreateCheckoutSessionRequest {
  /** Account ID */
  accountId: string;
  /** Total amount */
  total: number;
  /** Currency code (e.g., 'XAF') */
  currency: string;
  /** URL to redirect to on success */
  successUrl: string;
  /** URL to redirect to on cancel */
  cancelUrl: string;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
  /** Items in the checkout */
  items?: CheckoutItem[];
}

/**
 * Checkout session response
 */
export interface CheckoutSession {
  /** Session ID */
  id: string;
  /** Account ID */
  accountId: string;
  /** Success redirect URL */
  successUrl: string;
  /** Cancel redirect URL */
  cancelUrl: string;
  /** Hosted checkout page URL */
  url: string;
  /** Order ID */
  orderId: string;
  /** Session expiration timestamp */
  expiresAt: string;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Convert CreateCheckoutSessionRequest to API format (camelCase)
 */
export function serializeCreateCheckoutSessionRequest(
  request: CreateCheckoutSessionRequest
): Record<string, unknown> {
  return {
    accountId: request.accountId,
    total: request.total,
    currency: request.currency,
    successUrl: request.successUrl,
    cancelUrl: request.cancelUrl,
    metadata: request.metadata,
    items: request.items?.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      productName: item.productName,
    })),
  };
}

/**
 * Parse CheckoutSession from API response
 */
export function parseCheckoutSession(data: unknown): CheckoutSession {
  const d = data as Record<string, unknown>;
  return {
    id: (d.id ?? d.session_id) as string,
    accountId: (d.accountId ?? d.account_id) as string,
    successUrl: (d.successUrl ?? d.success_url) as string,
    cancelUrl: (d.cancelUrl ?? d.cancel_url) as string,
    url: d.url as string,
    orderId: (d.orderId ?? d.order_id) as string,
    expiresAt: (d.expiresAt ?? d.expires_at) as string,
    metadata: d.metadata as Record<string, unknown> | undefined,
    createdAt: (d.createdAt ?? d.created_at) as string,
    updatedAt: (d.updatedAt ?? d.updated_at) as string,
  };
}
