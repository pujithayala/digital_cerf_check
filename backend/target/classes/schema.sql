-- CertiVerify Database Schema for PostgreSQL & AWS RDS

CREATE TABLE IF NOT EXISTS admin (
    admin_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
    certificate_id VARCHAR(100) PRIMARY KEY,
    student_name VARCHAR(200) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    organisation VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    certificate_url VARCHAR(500),
    qr_code_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    revocation_reason VARCHAR(500),
    grade VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_logs (
    id BIGSERIAL PRIMARY KEY,
    certificate_id VARCHAR(100) NOT NULL,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_at_verification VARCHAR(50),
    ip_address VARCHAR(100),
    user_agent VARCHAR(300)
);

CREATE INDEX IF NOT EXISTS idx_certificates_student_name ON certificates(student_name);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
CREATE INDEX IF NOT EXISTS idx_certificates_issue_date ON certificates(issue_date);
