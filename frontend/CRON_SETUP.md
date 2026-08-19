# FreshPlate - Expiry alert Cron Job Setup

This document covers the installation, scheduling rules, and manual execution triggers for the FreshPlate notification engine.

## Cron Scheduling
We use the lightweight `node-cron` runtime library to schedule internal events. 

### Trigger Rule
The cron task is defined in `server/src/services/cron.service.ts` and initialized on server bootstrap inside `index.ts`:

- **Rule**: `0 7 * * *`
- **Meaning**: Run at minute 0 of hour 7 (7:00 AM) every day, every month, and every day-of-week.
- **Goal**: Scan user pantry databases, identify critical items expiring in 1-3 days, compile recommendations, and send a daily warning digest.

---

## SMTP & Email Integration
The email alert scheduler connects via:
1. **Resend API**: Sends high-deliverability marketing/transactional emails in production.
2. **Nodemailer Transport**: Sends emails via SMTP in development (e.g. Mailtrap sandbox).
3. **Console Fallback**: Logs formatted HTML content to standard console if credentials are unconfigured.

---

## Manual Trigger for Development
To test the cron logic immediately without waiting for 7:00 AM:
Developers can trigger checks manually by sending a request or using a local debug route. We have exported a helper function `runDailyExpiryChecks()` that can be bound to a test endpoint or run inside seed scripts.
