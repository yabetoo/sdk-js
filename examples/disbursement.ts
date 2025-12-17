/**
 * Disbursement Example
 *
 * This example demonstrates how to send money to a recipient
 * via mobile money.
 */

import Yabetoo from 'yabetoo';

async function main() {
  const yabetoo = new Yabetoo('sk_test_your_secret_key');

  try {
    // Create a disbursement (send money)
    console.log('Creating disbursement...');
    const disbursement = await yabetoo.disbursements.create({
      amount: 10000, // 10,000 XAF
      currency: 'XAF',
      firstName: 'Marie',
      lastName: 'Dupont',
      paymentMethodData: {
        type: 'momo',
        momo: {
          msisdn: '242065000000', // Recipient phone number
          country: 'cg',
          operatorName: 'airtel', // Airtel operator
        },
      },
    });

    console.log('Disbursement created:');
    console.log(`  ID: ${disbursement.id}`);
    console.log(`  Amount: ${disbursement.amount} ${disbursement.currency}`);
    console.log(`  Status: ${disbursement.status}`);
    console.log(`  Recipient: ${disbursement.firstName} ${disbursement.lastName}`);
    console.log(`  Phone: ${disbursement.phone}`);

    // Check disbursement status later
    console.log('\nRetrieving disbursement status...');
    const status = await yabetoo.disbursements.retrieve(disbursement.id);
    console.log(`  Current Status: ${status.status}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
