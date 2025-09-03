-- Seed: Sample accounts data
-- Migration: 001_create_accounts_table.sql
-- Description: Inserts sample account data for development and testing

-- Insert sample accounts (only if table is empty)
INSERT INTO accounts (name, type, balance, currency, description, is_active) 
SELECT * FROM (VALUES
    ('Main Checking Account', 'checking', 2500.00, 'USD', 'Primary checking account for daily transactions', true),
    ('Emergency Savings', 'savings', 10000.00, 'USD', 'Emergency fund savings account', true),
    ('Credit Card - Main', 'credit_card', -1250.75, 'USD', 'Primary credit card for purchases', true),
    ('Cash Wallet', 'cash', 150.00, 'USD', 'Physical cash on hand', true),
    ('Investment Portfolio', 'investment', 15750.25, 'USD', 'Stock and bond investment account', true),
    ('Car Loan', 'loan', -18500.00, 'USD', 'Auto loan for Honda Civic', true),
    ('Old Savings Account', 'savings', 50.00, 'USD', 'Closed savings account with remaining balance', false)
) AS v(name, type, balance, currency, description, is_active)
WHERE NOT EXISTS (SELECT 1 FROM accounts);
