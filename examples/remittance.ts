/**
 * Remittance Example
 *
 * This example demonstrates how to create an international
 * money transfer using the Yabetoo SDK.
 */

import Yabetoo from 'yabetoo';

async function main() {
  const yabetoo = new Yabetoo('sk_test_your_secret_key');

  try {
    // Create a remittance
    console.log('Creating remittance...');
    const remittance = await yabetoo.remittances.create({
      amount: 50000, // 50,000 XAF
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
      metadata: {
        reference: 'REM-2024-001',
        senderName: 'Jean Moumeny',
        purpose: 'Family support',
      },
    });

    console.log('Remittance created:');
    console.log(`  ID: ${remittance.id}`);
    console.log(`  Amount: ${remittance.amount} ${remittance.currency}`);
    console.log(`  Status: ${remittance.status}`);

    // Check remittance status
    console.log('\nRetrieving remittance details...');
    const details = await yabetoo.remittances.retrieve(remittance.id);

    console.log('Remittance details:');
    console.log(`  Status: ${details.status}`);
    console.log(`  Recipient: ${details.firstName} ${details.lastName}`);
    console.log(`  Phone: ${details.phone}`);
    console.log(`  Country: ${details.country}`);
    console.log(`  Operator: ${details.operatorName}`);
    console.log(`  Transaction ID: ${details.transactionId}`);

    if (details.failureMessage) {
      console.log(`  Failure Reason: ${details.failureMessage}`);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
