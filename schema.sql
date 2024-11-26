DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS water_parameters;
DROP TABLE IF EXISTS maintenance_logs;
DROP TABLE IF EXISTS inhabitants;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS maintenance_schedules;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE water_parameters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ph DECIMAL(4,2) NOT NULL,
    temperature DECIMAL(4,1),
    ammonia DECIMAL(4,2) NOT NULL,
    nitrite DECIMAL(4,2) NOT NULL,
    nitrate DECIMAL(4,2) NOT NULL,
    gh DECIMAL(4,2),
    kh DECIMAL(4,2),
    tds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    maintenance_type TEXT NOT NULL,
    water_change_amount INTEGER,
    filter_cleaned INTEGER DEFAULT 0,
    substrate_vacuumed INTEGER DEFAULT 0,
    plants_trimmed INTEGER DEFAULT 0,
    equipment_cleaned TEXT,
    products_used TEXT,
    notes TEXT,
    ph DECIMAL(4,2),
    ammonia DECIMAL(4,2),
    nitrite DECIMAL(4,2),
    nitrate DECIMAL(4,2),
    temperature DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inhabitants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    species TEXT NOT NULL,
    count INTEGER NOT NULL,
    date_added DATE NOT NULL,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_type TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    purchase_date DATE,
    last_maintenance DATE,
    maintenance_interval INTEGER,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER,
    maintenance_type TEXT NOT NULL,
    last_performed DATE,
    interval_days INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);

CREATE INDEX idx_water_parameters_created_at ON water_parameters(created_at);
CREATE INDEX idx_maintenance_logs_created_at ON maintenance_logs(created_at);
CREATE INDEX idx_inhabitants_species ON inhabitants(species);
CREATE INDEX idx_equipment_type ON equipment(equipment_type);
CREATE INDEX idx_maintenance_schedules_equipment ON maintenance_schedules(equipment_id);