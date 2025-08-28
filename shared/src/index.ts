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

// Export TypeORM entities (Account entity will be the default Account export)
export * from './entities';
