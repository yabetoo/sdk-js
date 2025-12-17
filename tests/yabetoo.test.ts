import Yabetoo from '../src/yabetoo';
import { Payments } from '../src/resources/payments';
import { Sessions } from '../src/resources/sessions';
import { Disbursements } from '../src/resources/disbursements';
import { Remittances } from '../src/resources/remittances';

describe('Yabetoo SDK', () => {
  describe('constructor', () => {
    it('should create SDK instance with test key', () => {
      const yabetoo = new Yabetoo('sk_test_123');

      expect(yabetoo.isSandbox()).toBe(true);
      expect(yabetoo.isProduction()).toBe(false);
      expect(yabetoo.environment).toBe('sandbox');
    });

    it('should create SDK instance with live key', () => {
      const yabetoo = new Yabetoo('sk_live_456');

      expect(yabetoo.isSandbox()).toBe(false);
      expect(yabetoo.isProduction()).toBe(true);
      expect(yabetoo.environment).toBe('production');
    });

    it('should initialize all resources', () => {
      const yabetoo = new Yabetoo('sk_test_123');

      expect(yabetoo.payments).toBeInstanceOf(Payments);
      expect(yabetoo.sessions).toBeInstanceOf(Sessions);
      expect(yabetoo.disbursements).toBeInstanceOf(Disbursements);
      expect(yabetoo.remittances).toBeInstanceOf(Remittances);
    });

    it('should throw error for invalid key', () => {
      expect(() => new Yabetoo('invalid_key')).toThrow('Invalid secret key format');
    });

    it('should accept custom options', () => {
      const yabetoo = new Yabetoo('sk_test_123', {
        options: {
          timeout: 60000,
          maxRetries: 5,
        },
      });

      expect(yabetoo).toBeDefined();
    });
  });
});
