ALTER TABLE leads ADD CONSTRAINT leads_phone_unique UNIQUE (phone);

-- 2. Scoring rules table
CREATE TABLE scoring_rules (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50),
    match_value VARCHAR(100),
    operator VARCHAR(20),
    score_impact INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Seed rules
INSERT INTO scoring_rules (category, match_value, operator, score_impact) VALUES
('EMPLOYMENT', 'SELF_EMPLOYED', 'EQUALS', 20),
('AMOUNT', '5000000', 'LESS_THAN', 15),
('LOAN_TYPE', 'BUSINESS', 'CONTAINS', 10);
