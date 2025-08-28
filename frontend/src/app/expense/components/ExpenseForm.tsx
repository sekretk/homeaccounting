import React, { useState, useEffect } from 'react';
import { Expense } from 'shared';
import styles from './ExpenseForm.module.css';

interface ExpenseFormProps {
  expense?: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  description: string;
  amount: string;
  expenseDate: string;
  category: string;
  paymentMethod: string;
  accountId: string;
  isRecurring: boolean;
  tags: string[];
  receiptUrl: string;
  isActive: boolean;
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Education',
  'Insurance',
  'Health & Fitness',
  'Travel',
  'Other'
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'mobile_payment', label: 'Mobile Payment' },
  { value: 'other', label: 'Other' },
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    category: 'Other',
    paymentMethod: 'cash',
    accountId: '',
    isRecurring: false,
    tags: [],
    receiptUrl: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        description: expense.description || '',
        amount: expense.amount || '',
        expenseDate: expense.expenseDate || new Date().toISOString().split('T')[0],
        category: expense.category || 'Other',
        paymentMethod: expense.paymentMethod || 'cash',
        accountId: expense.accountId || '',
        isRecurring: expense.isRecurring ?? false,
        tags: expense.tags || [],
        receiptUrl: expense.receiptUrl || '',
        isActive: expense.isActive ?? true,
      });
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        accountId: formData.accountId || null,
        receiptUrl: formData.receiptUrl || null,
      };

      const url = expense ? `/api/expense/${expense.id}` : '/api/expense';
      const method = expense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${expense ? 'update' : 'create'} expense`);
      }

      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>{expense ? 'Edit' : 'Create'} Expense</h2>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                className={styles.input}
                placeholder="Enter expense title"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="amount">Amount *</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                required
                disabled={loading}
                className={styles.input}
                placeholder="0.00"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="expenseDate">Date *</label>
              <input
                id="expenseDate"
                name="expenseDate"
                type="date"
                value={formData.expenseDate}
                onChange={handleChange}
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
                className={styles.select}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                disabled={loading}
                className={styles.select}
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="receiptUrl">Receipt URL</label>
              <input
                id="receiptUrl"
                name="receiptUrl"
                type="url"
                value={formData.receiptUrl}
                onChange={handleChange}
                disabled={loading}
                className={styles.input}
                placeholder="https://example.com/receipt.pdf"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              className={styles.textarea}
              rows={3}
              placeholder="Optional description..."
            />
          </div>

          <div className={styles.field}>
            <label>Tags</label>
            <div className={styles.tagContainer}>
              <div className={styles.tagInputContainer}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  disabled={loading}
                  className={styles.tagInput}
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={loading || !tagInput.trim()}
                  className={styles.addTagButton}
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className={styles.tagList}>
                  {formData.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={loading}
                        className={styles.removeTagButton}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <div className={styles.field}>
              <label className={styles.checkboxLabel}>
                <input
                  name="isRecurring"
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  disabled={loading}
                  className={styles.checkbox}
                />
                Recurring Expense
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.checkboxLabel}>
                <input
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={loading}
                  className={styles.checkbox}
                />
                Active
              </label>
            </div>
          </div>

          <footer className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : expense ? 'Update' : 'Create'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

