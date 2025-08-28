import React from 'react';
import { Expense } from 'shared';
import styles from './ExpenseCard.module.css';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount?: string) => {
    const numAmount = parseFloat(amount || '0');
    return isNaN(numAmount) ? '$0.00' : `$${numAmount.toFixed(2)}`;
  };

  const getPaymentMethodIcon = (method?: string | null) => {
    switch (method) {
      case 'credit_card': return '💳';
      case 'debit_card': return '💳';
      case 'cash': return '💵';
      case 'bank_transfer': return '🏦';
      case 'check': return '📝';
      case 'mobile_payment': return '📱';
      default: return '💰';
    }
  };

  const formatPaymentMethod = (method?: string | null) => {
    if (!method) return 'Cash';
    return method.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleEdit = () => {
    onEdit(expense);
  };

  const handleDelete = () => {
    if (expense.id) {
      onDelete(expense.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          <h4 className={styles.title}>{expense.title || 'Untitled Expense'}</h4>
          <div className={styles.amount}>{formatAmount(expense.amount)}</div>
        </div>
        <div className={styles.actions}>
          <button
            onClick={handleEdit}
            className={styles.editButton}
            title="Edit expense"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            title="Delete expense"
          >
            🗑️
          </button>
        </div>
      </div>

      {expense.description && (
        <p className={styles.description}>{expense.description}</p>
      )}

      <div className={styles.metadata}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>📅 Date:</span>
          <span className={styles.metaValue}>{formatDate(expense.expenseDate)}</span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>
            {getPaymentMethodIcon(expense.paymentMethod)} Payment:
          </span>
          <span className={styles.metaValue}>
            {formatPaymentMethod(expense.paymentMethod)}
          </span>
        </div>

        {expense.isRecurring && (
          <div className={styles.badge}>
            🔄 Recurring
          </div>
        )}

        {expense.tags && expense.tags.length > 0 && (
          <div className={styles.tags}>
            {expense.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {expense.receiptUrl && (
          <div className={styles.receipt}>
            <a 
              href={expense.receiptUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.receiptLink}
            >
              📎 View Receipt
            </a>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.status}>
          <span className={`${styles.statusBadge} ${
            expense.isActive ? styles.active : styles.inactive
          }`}>
            {expense.isActive ? '✅ Active' : '❌ Inactive'}
          </span>
        </div>
        <div className={styles.createdAt}>
          Added: {formatDate(expense.createdAt?.toString())}
        </div>
      </div>
    </div>
  );
};

