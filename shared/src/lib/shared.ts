// Common types for the home accounting application
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: Date;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit' | 'investment';
}

// Utility functions
export function formatCurrency(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency codes
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income' 
      ? total + transaction.amount 
      : total - transaction.amount;
  }, 0);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;
  return emailRegex.test(email);
}

export function categorizeTransaction(description: string): string {
  const categories: Record<string, string[]> = {
    'Food & Dining': ['restaurant', 'grocery', 'food', 'dining', 'cafe', 'pizza', 'lunch', 'dinner', 'breakfast', 'coffee', 'starbucks'],
    'Transportation': ['gas', 'fuel', 'uber', 'taxi', 'bus', 'train', 'parking', 'metro', 'car', 'business', 'name'],
    'Utilities': ['electricity', 'water', 'gas', 'internet', 'phone', 'cable', 'utility', 'electric', 'company', 'provider', 'bill'],
    'Entertainment': ['movie', 'netflix', 'spotify', 'game', 'concert', 'theater', 'entertainment'],
    'Shopping': ['amazon', 'target', 'walmart', 'mall', 'clothes', 'clothing', 'shopping'],
    'Healthcare': ['doctor', 'pharmacy', 'hospital', 'medical', 'dentist', 'health', 'medicine'],
    'Home': ['rent', 'mortgage', 'home', 'furniture', 'appliance', 'repair'],
    'Income': ['salary', 'wage', 'bonus', 'refund', 'dividend', 'interest', 'payment received']
  };

  const lowerDescription = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerDescription.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

export function formatDate(date: Date, format: 'short' | 'long' | 'numeric' = 'short'): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }

  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    numeric: { year: 'numeric', month: '2-digit', day: '2-digit' }
  };

  return new Intl.DateTimeFormat('en-US', formatOptions[format]).format(date);
}

export function getDateRange(period: 'week' | 'month' | 'quarter' | 'year', offset = 0): { start: Date; end: Date } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  let start: Date;
  let end: Date;
  
  switch (period) {
    case 'week':
      const currentDay = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - currentDay - (offset * 7));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      start = startOfWeek;
      end = endOfWeek;
      break;
      
    case 'month':
      start = new Date(currentYear, currentMonth - offset, 1);
      end = new Date(currentYear, currentMonth - offset + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'quarter':
      const quarterStart = Math.floor(currentMonth / 3) * 3 - (offset * 3);
      start = new Date(currentYear, quarterStart, 1);
      end = new Date(currentYear, quarterStart + 3, 0);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'year':
      start = new Date(currentYear - offset, 0, 1);
      end = new Date(currentYear - offset, 11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : 100;
  }
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

export function roundToDecimalPlaces(value: number, places: number): number {
  return Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
}
