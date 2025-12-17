# Yabetoo JavaScript/TypeScript SDK

Official JavaScript/TypeScript SDK for the Yabetoo Payment Platform.

## Installation

```bash
npm install @yabetoo/sdk-js
# or
yarn add @yabetoo/sdk-js
# or
pnpm add @yabetoo/sdk-js
```

## Quick Start

```typescript
import Yabetoo from '@yabetoo/sdk-js';

// Initialize with your secret key
const yabetoo = new Yabetoo('sk_test_your_secret_key');

// Create a payment intent
const intent = await yabetoo.payments.create({
  amount: 5000,
  currency: 'XAF',
  description: 'Order #123',
});

// Confirm with mobile money
const result = await yabetoo.payments.confirm(intent.id, {
  clientSecret: intent.clientSecret,
  paymentMethodData: {
    type: 'momo',
    momo: {
      msisdn: '242064000000',
      country: 'cg',
      operatorName: 'mtn',
    },
  },
  firstName: 'John',
  lastName: 'Doe',
});

console.log('Payment status:', result.status);
```

## Features

- **Payments** - Create, confirm, retrieve, and list payment intents
- **Checkout Sessions** - Create hosted checkout pages for e-commerce
- **Disbursements** - Send money to recipients via mobile money
- **Remittances** - International money transfers

## API Reference

### Initialization

```typescript
import Yabetoo from '@yabetoo/sdk-js';

// Sandbox environment
const yabetoo = new Yabetoo('sk_test_xxx');

// Production environment
const yabetoo = new Yabetoo('sk_live_xxx');

// With custom options
const yabetoo = new Yabetoo('sk_test_xxx', {
  options: {
    timeout: 60000, // Request timeout (ms)
    maxRetries: 5, // Max retry attempts
    retryDelay: 1000, // Initial retry delay (ms)
    customHeaders: {
      // Additional headers
      'X-Custom-Header': 'value',
    },
  },
});
```

### Payments

```typescript
// Create a payment intent
const intent = await yabetoo.payments.create({
  amount: 5000,
  currency: 'XAF',
  description: 'Order #123',
  metadata: { orderId: '123' },
});

// Confirm the payment
const result = await yabetoo.payments.confirm(intent.id, {
  clientSecret: intent.clientSecret,
  paymentMethodData: {
    type: 'momo',
    momo: {
      msisdn: '242064000000',
      country: 'cg',
      operatorName: 'mtn', // or 'airtel'
    },
  },
  firstName: 'John',
  lastName: 'Doe',
  receiptEmail: 'john@example.com',
});

// Retrieve a payment
const payment = await yabetoo.payments.retrieve('pi_xxx');

// List all payments
const payments = await yabetoo.payments.all({
  page: 1,
  perPage: 20,
  sorting: [{ id: 'createdAt', desc: true }],
});
```

### Checkout Sessions

```typescript
const session = await yabetoo.sessions.create({
  accountId: 'acc_xxx',
  total: 15000,
  currency: 'XAF',
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
  metadata: { orderId: '123' },
  items: [
    {
      productId: 'prod_xxx',
      productName: 'T-Shirt',
      price: 5000,
      quantity: 3,
    },
  ],
});

// Redirect customer to checkout
window.location.href = session.url;
```

### Disbursements

```typescript
// Send money to a recipient
const disbursement = await yabetoo.disbursements.create({
  amount: 10000,
  currency: 'XAF',
  firstName: 'Marie',
  lastName: 'Dupont',
  paymentMethodData: {
    type: 'momo',
    momo: {
      msisdn: '242065000000',
      country: 'cg',
      operatorName: 'airtel',
    },
  },
});

// Check status
const status = await yabetoo.disbursements.retrieve(disbursement.id);
```

### Remittances

```typescript
// Create a remittance
const remittance = await yabetoo.remittances.create({
  amount: 50000,
  currency: 'XAF',
  firstName: 'Pierre',
  lastName: 'Martin',
  paymentMethodData: {
    type: 'momo',
    momo: {
      msisdn: '242066000000',
      country: 'cg',
      operatorName: 'mtn',
    },
  },
  metadata: { reference: 'REM-001' },
});

// Get remittance details
const details = await yabetoo.remittances.retrieve(remittance.id);
```

## Error Handling

```typescript
import Yabetoo, {
  YabetooError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
} from 'yabetoo';

try {
  await yabetoo.payments.create({ amount: 5000, currency: 'XAF' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.errors);
  } else if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limited, retry after:', error.retryAfter);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof YabetooError) {
    console.error('API error:', error.code, error.message);
  }
}
```

## Supported Payment Methods

| Operator         | Country | Code |
| ---------------- | ------- | ---- |
| MTN Mobile Money | Congo   | `cg` |
| Airtel Money     | Congo   | `cg` |

## TypeScript Support

This SDK is written in TypeScript and includes full type definitions. All models and interfaces are exported for use in your TypeScript projects.

```typescript
import type {
  PaymentIntent,
  CreateIntentRequest,
  CheckoutSession,
  Disbursement,
  Remittance,
  MomoData,
  PaymentMethodData,
} from '@yabetoo/sdk-js';
```

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 5.0.0 (for TypeScript users)

## License

MIT

# sdk-js
