CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(36) PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(5) NOT NULL,
  table_number INTEGER NOT NULL,
  people_count INTEGER NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('PENDENTE', 'CONFIRMADA', 'CANCELADA')),
  matter_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_table ON reservations(table_number);
CREATE INDEX IF NOT EXISTS idx_reservations_matter ON reservations(matter_id);