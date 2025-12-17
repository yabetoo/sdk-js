/**
 * Error Handling Example
 *
 * This example demonstrates how to handle different types of errors
 * that can occur when using the Yabetoo SDK.
 */

import Yabetoo, {
  YabetooError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
} from 'yabetoo';

async function main() {
  const yabetoo = new Yabetoo('sk_test_your_secret_key');

  try {
    // Attempt to create a payment
    const intent = await yabetoo.payments.create({
      amount: 5000,
      currency: 'XAF',
    });

    console.log('Payment created:', intent.id);

  } catch (error) {
    // Handle specific error types
    if (error instanceof ValidationError) {
      console.error('Validation Error:', error.message);
      if (error.errors) {
        console.error('Field errors:');
        for (const fieldError of error.errors) {
          console.error(`  - ${fieldError.field}: ${fieldError.message}`);
        }
      }
    } else if (error instanceof AuthenticationError) {
      console.error('Authentication Error:', error.message);
      console.error('Please check your API key.');
    } else if (error instanceof RateLimitError) {
      console.error('Rate Limit Error:', error.message);
      if (error.retryAfter) {
        console.error(`Retry after ${error.retryAfter} seconds`);
      }
    } else if (error instanceof NetworkError) {
      console.error('Network Error:', error.message);
      console.error('Please check your internet connection.');
    } else if (error instanceof YabetooError) {
      // Generic Yabetoo error
      console.error('Yabetoo Error:', error.message);
      console.error('Error code:', error.code);
      console.error('HTTP status:', error.statusCode);
    } else {
      // Unknown error
      console.error('Unknown error:', error);
    }
  }
}

// Example with retry logic
async function createPaymentWithRetry(
  yabetoo: Yabetoo,
  maxRetries: number = 3
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const intent = await yabetoo.payments.create({
        amount: 5000,
        currency: 'XAF',
      });
      console.log('Payment created on attempt', attempt);
      console.log('Payment ID:', intent.id);
      return;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof RateLimitError) {
        const waitTime = error.retryAfter ?? Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (error instanceof NetworkError) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Network error. Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        // Don't retry on validation or authentication errors
        throw error;
      }
    }
  }

  throw lastError;
}

main();
