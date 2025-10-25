-- -------------------------------------------------------------
-- ACCOUNT TABLE
-- -------------------------------------------------------------
INSERT INTO account (id, scheme) VALUES ('pune.institute@icicibank', 'ICICIBANK');
INSERT INTO account (id, scheme) VALUES ('mumbai.university@hdfcbank', 'HDFCBANK');
INSERT INTO account (id, scheme) VALUES ('CUST12345', 'CUSTOMER-ID');
INSERT INTO account (id, scheme) VALUES ('CUST67890', 'CUSTOMER-ID');
INSERT INTO account (id, scheme) VALUES ('CUST24680', 'CUSTOMER-ID');

-- -------------------------------------------------------------
-- INSTRUCTED AMOUNT
-- -------------------------------------------------------------
INSERT INTO instructed_amount (id, currency, amount) VALUES ('AMT-001', 'INR', 140000.00);
INSERT INTO instructed_amount (id, currency, amount) VALUES ('AMT-002', 'INR', 5000.00);
INSERT INTO instructed_amount (id, currency, amount) VALUES ('AMT-003', 'INR', 120000.00);
INSERT INTO instructed_amount (id, currency, amount) VALUES ('AMT-004', 'INR', 2500.00);
INSERT INTO instructed_amount (id, currency, amount) VALUES ('AMT-005', 'INR', 90000.00);

-- -------------------------------------------------------------
-- PAYMENT INFO
-- -------------------------------------------------------------
INSERT INTO payment_info (id, instruction_id, instructed_amount_id)
VALUES 
('PAY-001', 'TXN-ID-ABC-123', 'AMT-001'),
('PAY-002', 'TXN-ID-ABC-124', 'AMT-002'),
('PAY-003', 'TXN-ID-ABC-125', 'AMT-003'),
('PAY-004', 'TXN-ID-ABC-126', 'AMT-004'),
('PAY-005', 'TXN-ID-ABC-127', 'AMT-005');

-- -------------------------------------------------------------
-- DEBTORS
-- -------------------------------------------------------------
INSERT INTO debtor (id, name, account_id)
VALUES 
('DEBTOR-001', 'Ramesh Kumar', 'CUST12345'),
('DEBTOR-002', 'Priya Nair', 'CUST67890'),
('DEBTOR-003', 'Arjun Mehta', 'CUST24680'),
('DEBTOR-004', 'Sneha Rao', 'CUST67890'),
('DEBTOR-005', 'Vikram Patel', 'CUST12345');

-- -------------------------------------------------------------
-- CREDITORS
-- -------------------------------------------------------------
INSERT INTO creditor (id, name, account_id)
VALUES 
('CREDITOR-001', 'Pune Institute of Technology', 'pune.institute@icicibank'),
('CREDITOR-002', 'Mumbai University', 'mumbai.university@hdfcbank');

-- -------------------------------------------------------------
-- REMITTANCE INFO
-- -------------------------------------------------------------
INSERT INTO remittance_info (id, unstructured)
VALUES 
('REMIT-001', 'Payment for Semester 5 Fees, Student ID 9876'),
('REMIT-002', 'Library Fine - Late submission of books, Student ID 7654'),
('REMIT-003', 'Hostel Room Rent - Block B, Student ID 3421'),
('REMIT-004', 'Semester 4 Backlog Exam Fees, Student ID 2211'),
('REMIT-005', 'Semester 6 Fees, Student ID 5567');

-- -------------------------------------------------------------
-- TRANSACTION EVENT TABLE
-- -------------------------------------------------------------
INSERT INTO transction_event (
    id, payment_info_id, debtor_id, creditor_id, remittance_info_id, flaged, reason, transaction_date
) VALUES
(1, 'PAY-001', 'DEBTOR-001', 'CREDITOR-001', 'REMIT-001', false, NULL, '2025-10-09 05:30:00'),
(2, 'PAY-002', 'DEBTOR-002', 'CREDITOR-001', 'REMIT-002', true, 'Excess fine amount detected', '2025-10-09 06:00:00'),
(3, 'PAY-003', 'DEBTOR-003', 'CREDITOR-002', 'REMIT-003', false, NULL, '2025-10-09 07:15:00'),
(4, 'PAY-004', 'DEBTOR-004', 'CREDITOR-002', 'REMIT-004', true, 'Duplicate transaction detected', '2025-10-09 08:45:00'),
(5, 'PAY-005', 'DEBTOR-005', 'CREDITOR-001', 'REMIT-005', false, NULL, '2025-10-09 09:00:00');