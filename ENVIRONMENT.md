# Production Environment Variables & Secret Isolation Reference

This document describes all required environment variables and secret management policies for **The Education Space Academy ERP**.

> [!WARNING]
> **Zero Exposure Rule**: Never commit actual production secrets, passwords, or API keys to git repositories. Always use secret vaults or environment variable injections.

---

## 1. Core Server Environment Variables

| Variable Name | Type | Allowed Values | Description | Example Placeholder |
|---|---|---|---|---|
| `NODE_ENV` | String | `development`, `production`, `test` | Runtime environment mode | `production` |
| `PORT` | Number | Integer (`1024-65535`) | Express HTTP service listening port | `5000` |
| `DATABASE_URL` | String | PostgreSQL Connection URI | Primary production database connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | String | 64+ char entropy string | Secret key used for signing JWT authentication tokens | `••••••••••••` |
| `JWT_EXPIRES_IN` | String | `1h`, `1d`, `7d` | Access token lifespan duration | `7d` |
| `CORS_ORIGIN` | String | Comma-separated URLs | Whitelisted CORS origin domains | `https://educationspace.edu.pk` |

---

## 2. Email SMTP Settings

| Variable Name | Type | Description | Example Placeholder |
|---|---|---|---|
| `SMTP_HOST` | String | Production SMTP relay host | `smtp.sendgrid.net` |
| `SMTP_PORT` | Number | SMTP port (`587` TLS / `465` SSL) | `587` |
| `SMTP_USER` | String | SMTP account username | `apikey` |
| `SMTP_PASS` | String | Secret SMTP API key | `••••••••••••` |
| `SMTP_SENDER_EMAIL` | String | Default system outbound email address | `noreply@educationspace.edu.pk` |

---

## 3. SMS Gateway Settings

| Variable Name | Type | Description | Example Placeholder |
|---|---|---|---|
| `SMS_GATEWAY_URL` | String | SMS gateway API endpoint | `https://api.sms-provider.com/v1/send` |
| `SMS_API_KEY` | String | Secret SMS provider authentication key | `••••••••••••` |
| `SMS_SENDER_ID` | String | Institutional SMS Alpha-numeric Sender ID | `EDU_ACADEMY` |

---

## 4. Secret Masking Security Pattern

In the admin UI system configuration center (`/system-config`), all secret fields (e.g. `smtpPasswordSecret`, `apiKeySecret`) are automatically masked as `••••••••••••` upon GET requests. 

When updating configuration settings via `PUT /api/v1/system/config`, if the server receives `••••••••••••`, the underlying stored unmasked secret is strictly preserved without overwriting or leaking secrets over HTTP payloads.
