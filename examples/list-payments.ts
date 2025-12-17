/**
 * List Payments Example
 *
 * This example demonstrates how to list and paginate through payments.
 */

import Yabetoo from 'yabetoo';

async function main() {
  const yabetoo = new Yabetoo('sk_test_your_secret_key');

  try {
    // List payments with pagination
    console.log('Fetching payments (page 1)...\n');
    const page1 = await yabetoo.payments.all({
      page: 1,
      perPage: 10,
      sorting: [
        { id: 'createdAt', desc: true }, // Most recent first
      ],
    });

    console.log(`Total payments: ${page1.totalCount}`);
    console.log(`Current page: ${page1.page}`);
    console.log(`Items per page: ${page1.perPage}`);
    console.log(`Has more pages: ${page1.hasMore}`);
    console.log('\nPayments:');

    for (const payment of page1.items) {
      console.log(`  - ${payment.id}`);
      console.log(`    Amount: ${payment.amount} ${payment.currency}`);
      console.log(`    Status: ${payment.status}`);
      console.log(`    Created: ${payment.createdAt}`);
      console.log('');
    }

    // Fetch next page if available
    if (page1.hasMore) {
      console.log('Fetching page 2...\n');
      const page2 = await yabetoo.payments.getPage(2, 10, [
        { id: 'createdAt', desc: true },
      ]);

      console.log(`Page 2 - ${page2.items.length} payments`);
      for (const payment of page2.items) {
        console.log(`  - ${payment.id}: ${payment.status}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
