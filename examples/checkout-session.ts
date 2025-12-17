/**
 * Checkout Session Example
 *
 * This example demonstrates how to create a hosted checkout session
 * for e-commerce integrations.
 */

import Yabetoo from 'yabetoo';

async function main() {
  const yabetoo = new Yabetoo('sk_test_your_secret_key');

  try {
    // Create a checkout session
    console.log('Creating checkout session...');
    const session = await yabetoo.sessions.create({
      accountId: 'acc_your_account_id',
      total: 15000, // 15,000 XAF
      currency: 'XAF',
      successUrl: 'https://yourwebsite.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: 'https://yourwebsite.com/cancel',
      metadata: {
        orderId: 'ORDER-001',
        customerId: 'CUST-123',
      },
      items: [
        {
          productId: 'prod_tshirt_001',
          productName: 'T-Shirt Blue',
          price: 5000,
          quantity: 2,
        },
        {
          productId: 'prod_cap_001',
          productName: 'Baseball Cap',
          price: 5000,
          quantity: 1,
        },
      ],
    });

    console.log('Checkout session created:');
    console.log(`  Session ID: ${session.id}`);
    console.log(`  Order ID: ${session.orderId}`);
    console.log(`  Expires At: ${session.expiresAt}`);
    console.log(`\n  Checkout URL: ${session.url}`);
    console.log('\nRedirect your customer to this URL to complete the payment.');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
