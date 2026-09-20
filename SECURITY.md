# Enterprise Security Architecture & Hardening Guidelines

This document outlines the security policies, defense-in-depth architecture, security headers, CORS settings, rate limiting, and vulnerability handling for **The Education Space Academy ERP**.

---

## 1. Security Architecture Summary

- **Authentication**: JWT Access Tokens signed with 64-character high-entropy secret.
- **Authorization**: Granular Role-Based Access Control (RBAC) enforcing permissions (`system.manage`, `system.audit`, `website.delete`, `payroll.manage`, `fees.collect`).
- **Data Isolation**: Strict campus isolation (`req.user.campusId`), student self-record isolation, parent-child link authorization, and teacher class/subject scope checks.
- **IDOR / BOLA Resilience**: Target object IDs in requests are validated server-side against the caller's JWT identity context.
- **Secret Masking**: Admin system configuration masks secrets with `••••••••••••`. Updating settings preserves unmasked secrets in memory/DB without wire leakage.

---

## 2. Production Security Headers & CORS

### Helmet HTTP Headers Setup (`server/app.ts`)
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));
```

### Rate Limiting Configuration
```typescript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 300, // Max 300 requests per IP per window
  message: { success: false, error: { message: 'Too many requests. Please try again later.' } }
});

app.use('/api/', apiLimiter);
```

---

## 3. Protected Upload File Extensions

File upload endpoints strictly whitelist permitted extensions to prevent execution of malicious code:

- **Allowed Extensions**: `.pdf`, `.docx`, `.xlsx`, `.zip`
- **Prohibited Extensions**: `.exe`, `.bat`, `.cmd`, `.sh`, `.js`, `.py`, `.php`, `.vbs`, `.dll`

Attempts to upload prohibited files are rejected with `400 Bad Request`.

---

## 4. Security Audit Compliance Matrix

The system has passed security audit testing across 25+ attack dimensions:
- **Audit Documentation**: [`SECURITY_AUDIT.md`](file:///d:/the%20education%20space%20academy/SECURITY_AUDIT.md)
- **Automated Test Suite**: [`tests/unit/securityAudit.test.ts`](file:///d:/the%20education%20space%20academy/tests/unit/securityAudit.test.ts) — **100% PASSED (115/115 Unit Tests)**
