-- Seed: expenses sample data
-- Migration: 002_create_expenses_table.sql
-- Description: Sample expense data for development and testing

-- Insert sample expenses (only if table is empty)
INSERT INTO expenses (
    title, 
    description, 
    amount, 
    expense_date, 
    category, 
    payment_method, 
    account_id, 
    is_recurring, 
    tags, 
    receipt_url
) 
SELECT * FROM (VALUES
    ('Groceries at Whole Foods', 'Weekly grocery shopping - organic produce and essentials', 156.78, DATE '2025-01-25', 'Food & Dining', 'credit_card', (SELECT id FROM accounts WHERE name = 'Checking Account' LIMIT 1), false, ARRAY['groceries', 'organic', 'weekly'], null),
    ('Gas Station Fill-up', 'Shell station on Highway 101', 45.32, DATE '2025-01-24', 'Transportation', 'debit_card', (SELECT id FROM accounts WHERE name = 'Checking Account' LIMIT 1), false, ARRAY['gas', 'car', 'commute'], null),
    ('Netflix Subscription', 'Monthly streaming service subscription', 15.99, DATE '2025-01-23', 'Entertainment', 'credit_card', null, true, ARRAY['subscription', 'streaming', 'entertainment'], null),
    ('Coffee Shop', 'Morning coffee at local café', 8.50, DATE '2025-01-23', 'Food & Dining', 'cash', null, false, ARRAY['coffee', 'café', 'morning'], null),
    ('Electric Bill', 'Monthly electricity utility payment', 127.45, DATE '2025-01-22', 'Utilities', 'bank_transfer', (SELECT id FROM accounts WHERE name = 'Checking Account' LIMIT 1), true, ARRAY['utilities', 'electric', 'monthly'], null),
    ('Pharmacy - Medications', 'Prescription medications pickup', 89.99, DATE '2025-01-21', 'Healthcare', 'credit_card', null, false, ARRAY['pharmacy', 'health', 'prescription'], null),
    ('Amazon Purchase', 'Office supplies and household items', 67.23, DATE '2025-01-20', 'Shopping', 'credit_card', null, false, ARRAY['amazon', 'office', 'household'], null),
    ('Restaurant Dinner', 'Dinner at Italian restaurant with family', 98.76, DATE '2025-01-19', 'Food & Dining', 'credit_card', null, false, ARRAY['restaurant', 'dinner', 'family'], null),
    ('Gym Membership', 'Monthly fitness center membership', 49.99, DATE '2025-01-18', 'Health & Fitness', 'bank_transfer', (SELECT id FROM accounts WHERE name = 'Checking Account' LIMIT 1), true, ARRAY['gym', 'fitness', 'health'], null),
    ('Uber Ride', 'Transportation to downtown meeting', 23.45, DATE '2025-01-17', 'Transportation', 'mobile_payment', null, false, ARRAY['uber', 'rideshare', 'meeting'], null),
    ('Book Purchase', 'Programming books from technical bookstore', 78.90, DATE '2025-01-16', 'Education', 'debit_card', null, false, ARRAY['books', 'programming', 'education'], null),
    ('Car Insurance', 'Quarterly auto insurance premium', 287.50, DATE '2025-01-15', 'Insurance', 'bank_transfer', (SELECT id FROM accounts WHERE name = 'Checking Account' LIMIT 1), true, ARRAY['insurance', 'car', 'quarterly'], null)
) AS v(title, description, amount, expense_date, category, payment_method, account_id, is_recurring, tags, receipt_url)
WHERE NOT EXISTS (SELECT 1 FROM expenses);

-- Update statistics after insert
ANALYZE expenses;
