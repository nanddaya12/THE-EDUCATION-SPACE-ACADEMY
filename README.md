# The Education Space Academy - Enterprise ERP & Web CMS Platform

[![Build Status](https://img.shields.io/badge/build-passing-emerald.svg)](file:///d:/the%20education%20space%20academy)
[![Unit Tests](https://img.shields.io/badge/tests-100%25%20pass%20(115%2F115)-success.svg)](file:///d:/the%20education%20space%20academy/tests)
[![Security Audit](https://img.shields.io/badge/security%20audit-passed-blue.svg)](file:///d:/the%20education%20space%20academy/SECURITY_AUDIT.md)
[![License](https://img.shields.io/badge/license-Proprietary-slate.svg)]()

Production-grade **Multi-Campus Education Resource Planning (ERP) System & Dynamic Website Content Management System (CMS)** built for **The Education Space Academy**.

---

## Key Modules & Core Capabilities

- 🎓 **Student Lifecycle Management**: Admissions pipeline, enrollment conversion, student demographics, duplicate detection engine.
- 👨‍🏫 **Faculty & HR Suite**: Staff profiles, payroll processing, attendance tracking, leave application workflows.
- 🏫 **Academics & Timetable**: Course management, subject allocations, 3-way conflict detection timetable engine.
- 📊 **Executive Analytics & Reports**: Live KPI dashboards, multi-domain report generator with PDF, Excel, CSV & Print server-side exporters.
- 💰 **Finance & Fee System**: Fee structure setup, challan issuance, payment gateway collection, defaulters roster, audit-logged refund processing.
- 📝 **Examinations & Report Cards**: Exam scheduling, assessment components, GPA calculation engine, official PDF report card generator.
- 🔐 **Dedicated Portals**:
  - **Student Portal**: Self-service profile, attendance percentage rate, timetable, homework, exam results, documents.
  - **Parent Portal**: Multi-child switcher, overview dashboard, fee challans, teacher messages, report card view.
  - **Teacher Portal**: Class/subject scope enforcement, today's schedule, attendance entry grid, marks submission, leave requests.
- 🌐 **Dynamic Public CMS Engine**: Hero banners, welcome message, principal quote, statistics, program offerings, announcements, news & press releases, events calendar, album-based gallery, downloads center, FAQs, contact inbox, and careers portal.
- 🔒 **Enterprise System Administration**: 15-section system configuration center, secret masking (`••••••••••••`), and centralized audit log hub.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Context API State Management
- **Backend**: Node.js, Express.js (TypeScript), Prisma ORM
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Testing**: Vitest (32 Test Files / 115 Unit Tests)
- **Security**: JWT Authentication, RBAC Permission Engine, Helmet Headers, Input Sanitization, Audit Logging

---

## Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Run database migrations
npx prisma migrate dev

# 3. Start development server (Frontend + API)
npm run dev

# 4. Execute automated test suite
npm test
```

---

## Operations Documentation Suite

- 🚀 [DEPLOYMENT.md](file:///d:/the%20education%20space%20academy/DEPLOYMENT.md) — Production Deployment Runbook (Docker, Nginx, HTTPS, PM2)
- ⚙️ [ENVIRONMENT.md](file:///d:/the%20education%20space%20academy/ENVIRONMENT.md) — Production Environment Variables & Secret Isolation
- 💾 [BACKUP.md](file:///d:/the%20education%20space%20academy/BACKUP.md) — Automated Database Backup & Disaster Recovery
- 🛡️ [SECURITY.md](file:///d:/the%20education%20space%20academy/SECURITY.md) — Security Hardening, Headers & Rate Limiting
- 📡 [API.md](file:///d:/the%20education%20space%20academy/API.md) — Complete REST API Endpoint Specification
- 🏗️ [ARCHITECTURE.md](file:///d:/the%20education%20space%20academy/ARCHITECTURE.md) — System Architecture, ERD & Module Design
- 🔐 [SECURITY_AUDIT.md](file:///d:/the%20education%20space%20academy/SECURITY_AUDIT.md) — 25+ Vector Security Audit Results
