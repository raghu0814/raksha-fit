# Raksha Fit MVP

Raksha Fit is an Express and PostgreSQL gym-management MVP. It serves its owner dashboard and member QR check-in page from the same application.

## Setup

1. Copy `.env.example` to `.env` and set a long `JWT_SECRET` and a PostgreSQL `DATABASE_URL`.
2. Run `npm install`.
3. Run `npm run migrate`.
4. Run `npm start`.
5. Open `http://localhost:5000` and create the first gym-owner account.

## Production environment

Set `DATABASE_URL`, `JWT_SECRET`, `PORT`, and optionally `FRONTEND_ORIGIN`. The application supports HTTPS deployments and does not require a browser-supplied `gym_id`.

`GET /health` reports application/database health. Schedule `npm run automation` once daily using the deployment platform's cron facility; it only queues `pending_manual` notifications and never claims provider delivery.

## QR check-in

The authenticated owner dashboard generates a gym-specific QR link. A member scans it with their phone camera, opens the check-in page, and enters their registered mobile number. The server resolves the gym from the QR code and enforces member status, membership expiry, and one check-in per calendar day.

## Messaging and SMS

WhatsApp uses manual `wa.me` compose links and records `pending_manual` notification logs. No automated WhatsApp or SMS delivery is claimed. `notification_templates` and `notification_logs` provide the provider-ready SMS/WhatsApp architecture.
