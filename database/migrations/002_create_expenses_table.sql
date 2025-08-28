-- Migration: create_expenses_table
-- Created: 2025-01-27
-- Description: Create expenses table for tracking financial expenditures

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    account_id UUID,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[], -- Array of tags for flexible categorization
    receipt_url VARCHAR(500), -- URL to receipt image/document
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_amount ON expenses(amount);
CREATE INDEX IF NOT EXISTS idx_expenses_account_id ON expenses(account_id);
CREATE INDEX IF NOT EXISTS idx_expenses_active ON expenses(is_active);
CREATE INDEX IF NOT EXISTS idx_expenses_created ON expenses(created_at);
CREATE INDEX IF NOT EXISTS idx_expenses_tags ON expenses USING GIN(tags);

-- Add foreign key constraint to accounts table
ALTER TABLE expenses 
ADD CONSTRAINT fk_expenses_account 
FOREIGN KEY (account_id) REFERENCES accounts(id) 
ON DELETE SET NULL;

-- Add check constraints
ALTER TABLE expenses ADD CONSTRAINT check_payment_method 
    CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'mobile_payment', 'other'));

ALTER TABLE expenses ADD CONSTRAINT check_category_not_empty 
    CHECK (length(trim(category)) > 0);

ALTER TABLE expenses ADD CONSTRAINT check_title_not_empty 
    CHECK (length(trim(title)) > 0);

-- Add comment to table
COMMENT ON TABLE expenses IS 'Financial expenses tracking with categorization and payment methods';
COMMENT ON COLUMN expenses.amount IS 'Expense amount in the base currency, must be positive';
COMMENT ON COLUMN expenses.expense_date IS 'Date when the expense occurred';
COMMENT ON COLUMN expenses.tags IS 'Flexible tagging system for expense categorization';
COMMENT ON COLUMN expenses.receipt_url IS 'URL reference to receipt image or document';
