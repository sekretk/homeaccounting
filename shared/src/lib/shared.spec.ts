
import { calculateBalance, formatCurrency, validateEmail, Transaction } from './shared';

describe('calculateBalance', () => {
  const createTransaction = (
    id: string,
    amount: number,
    type: 'income' | 'expense',
    description = 'Test transaction'
  ): Transaction => ({
    id,
    userId: 'user-1',
    amount,
    description,
    category: 'test',
    type,
    date: new Date('2024-01-01'),
  });

  describe('when transactions array is empty', () => {
    it('should return 0', () => {
      expect(calculateBalance([])).toBe(0);
    });
  });

  describe('when transactions contain only income', () => {
    it('should return positive balance for single income transaction', () => {
      const transactions = [createTransaction('1', 100, 'income')];
      expect(calculateBalance(transactions)).toBe(100);
    });

    it('should return sum of all income transactions', () => {
      const transactions = [
        createTransaction('1', 100, 'income'),
        createTransaction('2', 200, 'income'),
        createTransaction('3', 50, 'income'),
      ];
      expect(calculateBalance(transactions)).toBe(350);
    });

    it('should handle decimal amounts correctly', () => {
      const transactions = [
        createTransaction('1', 100.50, 'income'),
        createTransaction('2', 25.25, 'income'),
      ];
      expect(calculateBalance(transactions)).toBe(125.75);
    });
  });

  describe('when transactions contain only expenses', () => {
    it('should return negative balance for single expense transaction', () => {
      const transactions = [createTransaction('1', 100, 'expense')];
      expect(calculateBalance(transactions)).toBe(-100);
    });

    it('should return negative sum of all expense transactions', () => {
      const transactions = [
        createTransaction('1', 50, 'expense'),
        createTransaction('2', 30, 'expense'),
        createTransaction('3', 20, 'expense'),
      ];
      expect(calculateBalance(transactions)).toBe(-100);
    });
  });

  describe('when transactions contain mixed income and expenses', () => {
    it('should calculate net balance correctly', () => {
      const transactions = [
        createTransaction('1', 1000, 'income'), // +1000
        createTransaction('2', 200, 'expense'), // -200
        createTransaction('3', 50, 'expense'),  // -50
        createTransaction('4', 300, 'income'),  // +300
      ];
      expect(calculateBalance(transactions)).toBe(1050); // 1000 - 200 - 50 + 300
    });

    it('should handle equal income and expenses', () => {
      const transactions = [
        createTransaction('1', 500, 'income'),
        createTransaction('2', 300, 'expense'),
        createTransaction('3', 200, 'expense'),
      ];
      expect(calculateBalance(transactions)).toBe(0);
    });

    it('should handle more expenses than income', () => {
      const transactions = [
        createTransaction('1', 100, 'income'),
        createTransaction('2', 200, 'expense'),
        createTransaction('3', 50, 'expense'),
      ];
      expect(calculateBalance(transactions)).toBe(-150);
    });
  });

  describe('when transactions contain zero amounts', () => {
    it('should handle zero amount transactions', () => {
      const transactions = [
        createTransaction('1', 0, 'income'),
        createTransaction('2', 100, 'income'),
        createTransaction('3', 0, 'expense'),
        createTransaction('4', 50, 'expense'),
      ];
      expect(calculateBalance(transactions)).toBe(50);
    });

    it('should return 0 for all zero transactions', () => {
      const transactions = [
        createTransaction('1', 0, 'income'),
        createTransaction('2', 0, 'expense'),
      ];
      expect(calculateBalance(transactions)).toBe(0);
    });
  });

  describe('when handling large numbers', () => {
    it('should handle large transaction amounts', () => {
      const transactions = [
        createTransaction('1', 999999999.99, 'income'),
        createTransaction('2', 100000000, 'expense'),
      ];
      expect(calculateBalance(transactions)).toBe(899999999.99);
    });
  });

  describe('with real-world scenarios', () => {
    it('should calculate monthly budget correctly', () => {
      const monthlyTransactions = [
        createTransaction('salary', 5000, 'income', 'Monthly Salary'),
        createTransaction('bonus', 1000, 'income', 'Performance Bonus'),
        createTransaction('rent', 1200, 'expense', 'Monthly Rent'),
        createTransaction('groceries', 400, 'expense', 'Groceries'),
        createTransaction('utilities', 150, 'expense', 'Utilities'),
        createTransaction('transportation', 200, 'expense', 'Transportation'),
        createTransaction('entertainment', 300, 'expense', 'Entertainment'),
      ];
      // Income: 5000 + 1000 = 6000
      // Expenses: 1200 + 400 + 150 + 200 + 300 = 2250
      // Net: 6000 - 2250 = 3750
      expect(calculateBalance(monthlyTransactions)).toBe(3750);
    });

    it('should handle business accounting scenario', () => {
      const businessTransactions = [
        createTransaction('revenue1', 10000, 'income', 'Client Payment'),
        createTransaction('revenue2', 7500, 'income', 'Product Sales'),
        createTransaction('office-rent', 2000, 'expense', 'Office Rent'),
        createTransaction('salaries', 8000, 'expense', 'Staff Salaries'),
        createTransaction('marketing', 1500, 'expense', 'Marketing Campaign'),
        createTransaction('equipment', 3000, 'expense', 'New Equipment'),
      ];
      // Income: 10000 + 7500 = 17500
      // Expenses: 2000 + 8000 + 1500 + 3000 = 14500
      // Net: 17500 - 14500 = 3000
      expect(calculateBalance(businessTransactions)).toBe(3000);
    });
  });
});

describe('formatCurrency', () => {
  it('should format USD currency by default', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format different currencies', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
  });

  it('should handle zero amounts', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle negative amounts', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });
});

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.email+tag@domain.org')).toBe(true);
    expect(validateEmail('user123@test-domain.co.uk')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user.domain.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});
