ALTER TABLE gyms ADD COLUMN IF NOT EXISTS inactivity_threshold_days INTEGER NOT NULL DEFAULT 7 CHECK (inactivity_threshold_days BETWEEN 1 AND 90);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS expiry_reminder_days INTEGER NOT NULL DEFAULT 7 CHECK (expiry_reminder_days BETWEEN 1 AND 30);
ALTER TABLE members ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS template_name VARCHAR(80);
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS event_key VARCHAR(180);
CREATE UNIQUE INDEX IF NOT EXISTS notification_logs_event_key_idx ON notification_logs(event_key) WHERE event_key IS NOT NULL;
CREATE TABLE IF NOT EXISTS membership_history (
  id BIGSERIAL PRIMARY KEY, gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  plan_id BIGINT REFERENCES membership_plans(id) ON DELETE SET NULL,
  start_date DATE NOT NULL, valid_till DATE, action VARCHAR(30) NOT NULL CHECK (action IN ('created','renewed','extended','plan_changed','manual_update')),
  payment_id BIGINT REFERENCES payments(id) ON DELETE SET NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS membership_history_member_idx ON membership_history(gym_id, member_id, created_at DESC);
CREATE INDEX IF NOT EXISTS users_gym_active_idx ON users(gym_id, is_active);
