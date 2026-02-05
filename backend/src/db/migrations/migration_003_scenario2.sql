CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    role VARCHAR(50),
    specialty VARCHAR(50)
);

ALTER TABLE leads 
    ADD COLUMN urgency_level VARCHAR(20),
    ADD COLUMN special_notes TEXT,
    ADD COLUMN assigned_to INT REFERENCES users(id),
    ADD COLUMN created_by INT REFERENCES users(id),
    ADD COLUMN tags TEXT[],
    ADD COLUMN follow_up_date TIMESTAMP;

INSERT INTO users (name, email, role, specialty) VALUES 
('Sandeep Jain', 'sandeep@bhavyaa.com', 'LOAN_OFFICER', 'BUSINESS_LOAN'),
('Vivek Jain', 'vivek.jain171@gmail.com', 'LOAN_OFFICER', 'HOME_LOAN'),
('Nitin Jain', 'mail@bhavyaa.com', 'BOOTH_STAFF', 'ALL');
