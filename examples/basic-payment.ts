/**
 * Basic Payment Example
 *
 * This example demonstrates how to create and confirm a payment
 * using the Yabetoo SDK with mobile money (MTN).
 */

import Yabetoo from 'yabetoo';

async function main() {
  // Initialize the SDK with your secret key
  // Use 'sk_test_xxx' for sandbox, 'sk_live_xxx' for production
  const yabetoo = new Yabetoo('sk_test_your_secret_key');

  console.log(`Environment: ${yabetoo.environment}`);

  try {
    // Step 1: Create a payment intent
    console.log('\n1. Creating payment intent...');
    const intent = await yabetoo.payments.create({
      amount: 5000, // 5000 XAF
      currency: 'XAF',
      description: 'Order #12345',
      metadata: {
        orderId: '12345',
        customerEmail: 'customer@example.com',
      },
    });

    console.log('Payment intent created:');
    console.log(`  ID: ${intent.id}`);
    console.log(`  Amount: ${intent.amount} ${intent.currency}`);
    console.log(`  Client Secret: ${intent.clientSecret}`);

    // Step 2: Confirm the payment with mobile money
    console.log('\n2. Confirming payment with MTN Mobile Money...');
    const confirmation = await yabetoo.payments.confirm(intent.id, {
      clientSecret: intent.clientSecret,
      paymentMethodData: {
        type: 'momo',
        momo: {
          msisdn: '242064000000', // Customer phone number
          country: 'cg', // Congo
          operatorName: 'mtn', // MTN operator
        },
      },
      firstName: 'John',
      lastName: 'Doe',
      receiptEmail: 'customer@example.com',
    });

    console.log('Payment confirmed:');
    console.log(`  Charge ID: ${confirmation.id}`);
    console.log(`  Status: ${confirmation.status}`);
    console.log(`  Transaction ID: ${confirmation.transactionId}`);

    // Step 3: Retrieve payment details
    console.log('\n3. Retrieving payment details...');
    const payment = await yabetoo.payments.retrieve(intent.id);

    console.log('Payment details:');
    console.log(`  Status: ${payment.status}`);
    console.log(`  Amount: ${payment.amount} ${payment.currency}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
