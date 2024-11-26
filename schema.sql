-- schema.sql
-- Drop existing tables if they exist
DROP TABLE IF EXISTS maintenance_logs;

-- Create maintenance_logs table
CREATE TABLE maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ph DECIMAL(4,2) NOT NULL,
    ammonia DECIMAL(4,2) NOT NULL,
    nitrite DECIMAL(4,2) NOT NULL,
    nitrate DECIMAL(4,2) NOT NULL,
    temperature DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Create indexes
CREATE INDEX idx_maintenance_logs_created_at ON maintenance_logs(created_at);