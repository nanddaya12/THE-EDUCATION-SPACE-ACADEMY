# System Architecture & Technical Design Document

Comprehensive architecture design for **The Education Space Academy ERP & Dynamic Web CMS**.

---

## 1. System Topology & Layered Architecture

```
                                 ┌────────────────────────────────────────┐
                                 │          Web Browser Clients           │
                                 │  (Admins, Staff, Students, Parents)    │
                                 └──────────────────┬─────────────────────┘
                                                    │ HTTPS / REST API
                                                    ▼
                                 ┌────────────────────────────────────────┐
                                 │           Nginx Web Server             │
                                 │    (SSL Termination & Rate Limiting)   │
                                 └──────────────────┬─────────────────────┘
                                                    │ Reverse Proxy
                                                    ▼
                                 ┌────────────────────────────────────────┐
                                 │            Node.js Express API         │
                                 │    (JWT Auth, RBAC, Campus Isolation)   │
                                 └──────────────────┬─────────────────────┘
                                                    │ Prisma ORM
                                                    ▼
                                 ┌────────────────────────────────────────┐
                                 │        PostgreSQL Database (RDS)       │
                                 └────────────────────────────────────────┘
```

---

## 2. Express Backend Module Architecture

The server is decoupled into domain modules located under `server/modules/`:

- `auth/`: Authentication, JWT issuance, password hashing, profile resolution.
- `students/`: Enrollment, student profile repository, duplicate detection.
- `admissions/`: Admissions pipeline, application status tracking, conversion.
- `attendance/`: Daily attendance marking, governance rules, absenteeism alerts.
- `academics/`: Courses, subjects, 3-way conflict timetable detection engine.
- `exams/`: Exam events, assessment components, GPA calculation, PDF report card.
- `fees/`: Fee headers, invoice generation, payment gateways, defaulters roster.
- `hr/`: Staff profiles, 5-stage payroll workflow engine.
- `website/`: Dynamic homepage CMS engine, section ordering, news, gallery, downloads, FAQs, careers.
- `reports/`: Master multi-domain report generator with PDF, Excel, CSV, Print exporters.
- `analytics/`: Executive KPI dashboards with campus isolation guards.
- `system/`: 15-section system configuration center & secret masking.
- `audit/`: Centralized security audit log hub.
- `parent/`: Multi-child parent portal & guardian authorization.
- `studentPortal/`: Dedicated student portal & self-record isolation.
- `teacherPortal/`: Teacher portal & class/subject scope enforcement.
- `documents/`: Student/staff document management, certificate lifecycle & QR verification.

---

## 3. Database ERD & Schema Design

Key entities managed via Prisma schema (`prisma/schema.prisma`):
- `User` & `Role`: Identity, hashed passwords, permission arrays.
- `Institution` & `Campus`: Multi-campus hierarchy (`Main Campus`, `South Campus`).
- `Student` & `Guardian`: Student demographics, parent-child links.
- `Staff` & `TeacherAssignment`: Staff profile, class & subject assignments.
- `Course`, `Subject`, `TimetableSlot`: Curriculum & schedule.
- `Exam`, `AssessmentComponent`, `ExamMark`: Grading & GPA calculations.
- `FeeInvoice`, `PaymentReceipt`: Financial accounting.
- `AuditLog`: Security audit trail capturing IP, user agent, before/after JSON diffs.
- `Certificate`: Certificate numbering (`CERT-2026-90001`), revocation log, QR verification payload.
