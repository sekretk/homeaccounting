import React from 'react';
import { Expense } from 'shared';
import { ExpenseCard } from './ExpenseCard';
import styles from './ExpenseList.module.css';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💳</div>
        <h3>No expenses recorded yet</h3>
        <p>Start tracking your expenses by adding your first expense record.</p>
      </div>
    );
  }

  // Group expenses by category for better organization
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Calculate totals
  const totalAmount = expenses.reduce((sum, expense) => 
    sum + (parseFloat(expense.amount || '0') || 0), 0
  );

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <h3>📊 Summary</h3>
          <div className={styles.summaryStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Expenses</span>
              <span className={styles.statValue}>{expenses.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Amount</span>
              <span className={styles.statValue}>${totalAmount.toFixed(2)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Categories</span>
              <span className={styles.statValue}>{Object.keys(expensesByCategory).length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.categoriesContainer}>
        {Object.entries(expensesByCategory).map(([category, categoryExpenses]) => {
          const categoryTotal = categoryExpenses.reduce((sum, expense) => 
            sum + (parseFloat(expense.amount || '0') || 0), 0
          );

          return (
            <div key={category} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>
                  {category}
                  <span className={styles.categoryCount}>
                    ({categoryExpenses.length})
                  </span>
                </h3>
                <div className={styles.categoryTotal}>
                  ${categoryTotal.toFixed(2)}
                </div>
              </div>
              
              <div className={styles.expenseGrid}>
                {categoryExpenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

