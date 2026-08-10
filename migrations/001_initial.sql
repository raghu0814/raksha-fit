CREATE TABLE IF NOT EXISTS gyms (
  id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, phone VARCHAR(10) NOT NULL,
  email VARCHAR(255), address TEXT, public_code VARCHAR(24) NOT NULL UNIQUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY, gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL, phone VARCHAR(10) NOT NULL UNIQUE, password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'owner' CHECK (role IN ('owner','staff')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS membership_plans (
  id BIGSERIAL PRIMARY KEY, gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL, duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (gym_id, name)
);
CREATE TABLE IF NOT EXISTS members (
  id BIGSERIAL PRIMARY KEY, gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  plan_id BIGINT REFERENCES membership_plans(id) ON DELETE SET NULL, name VARCHAR(120) NOT NULL,
  phone VARCHAR(10) NOT NULL, email VARCHAR(255), start_date DATE, valid_till DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(gym_id, phone)
);
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY, gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE, amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE, payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('cash','upi','card','bank_transfer','other')),
  reference VARCHAR(150), notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY, gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE, date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIMESTAMPTZ NOT NULL DEFAULT NOW(), check_out TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(member_id, date)
);
CREATE TABLE IF NOT EXISTS notification_templates (
  id BIGSERIAL PRIMARY KEY, gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('whatsapp','sms')), name VARCHAR(80) NOT NULL,
  template TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(gym_id, channel, name)
);
CREATE TABLE IF NOT EXISTS notification_logs (
  id BIGSERIAL PRIMARY KEY, gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  member_id BIGINT REFERENCES members(id) ON DELETE SET NULL, channel VARCHAR(20) NOT NULL,
  message TEXT NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'pending_manual', sent_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS members_gym_status_idx ON members(gym_id, status, valid_till);
CREATE INDEX IF NOT EXISTS attendance_gym_date_idx ON attendance(gym_id, date DESC);
CREATE INDEX IF NOT EXISTS payments_gym_date_idx ON payments(gym_id, payment_date DESC);
CREATE INDEX IF NOT EXISTS notification_logs_gym_idx ON notification_logs(gym_id, created_at DESC);
