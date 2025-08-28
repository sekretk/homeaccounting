// Export utility functions and non-conflicting types
export {
  formatCurrency,
  calculateBalance,
  validateEmail,
  categorizeTransaction,
  formatDate,
  getDateRange,
  calculatePercentageChange,
  roundToDecimalPlaces,
} from './lib/shared';

// Export types with renamed conflicting Account interface
export type { User, Transaction, Account as AccountInterface } from './lib/shared';

// Export migration core
export * from './lib/migration-core';

// Export TypeORM entities explicitly to avoid conflicts
export { Account } from './entities/account.entity';
export { Expense } from './entities/expense.entity';
