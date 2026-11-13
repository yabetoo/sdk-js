import { serializeConfirmIntentRequest } from '../src/models/payment';
import { serializeCreateDisbursementRequest } from '../src/models/disbursement';
import { serializeCreateRemittanceRequest } from '../src/models/remittance';

const paymentMethodData = {
  type: 'momo',
  momo: { msisdn: '242066000001', country: 'cg' as const, operatorName: 'airtel' as const },
};

const snakeCasePaymentMethodData = {
  type: 'momo',
  momo: { msisdn: '242066000001', country: 'cg', operator_name: 'airtel' },
};

describe('request serialization', () => {
  it('sends the confirm request in snake_case, as the API requires', () => {
    expect(
      serializeConfirmIntentRequest({
        clientSecret: 'cs_123',
        paymentMethodData,
        firstName: 'Jean',
        lastName: 'Malonga',
        receiptEmail: 'jean@example.com',
      })
    ).toEqual({
      client_secret: 'cs_123',
      payment_method_data: snakeCasePaymentMethodData,
      first_name: 'Jean',
      last_name: 'Malonga',
      receipt_email: 'jean@example.com',
    });
  });

  it('sends the disbursement request in snake_case, as the API requires', () => {
    expect(
      serializeCreateDisbursementRequest({
        amount: 100,
        currency: 'xaf',
        firstName: 'Jean',
        lastName: 'Malonga',
        paymentMethodData,
      })
    ).toEqual({
      amount: 100,
      currency: 'xaf',
      first_name: 'Jean',
      last_name: 'Malonga',
      payment_method_data: snakeCasePaymentMethodData,
    });
  });

  it('sends the remittance request in snake_case, as the API requires', () => {
    expect(
      serializeCreateRemittanceRequest({
        amount: 100,
        currency: 'xaf',
        firstName: 'Jean',
        lastName: 'Malonga',
        paymentMethodData,
        metadata: { orderId: 'o_1' },
      })
    ).toEqual({
      amount: 100,
      currency: 'xaf',
      first_name: 'Jean',
      last_name: 'Malonga',
      payment_method_data: snakeCasePaymentMethodData,
      metadata: { orderId: 'o_1' },
    });
  });
});
