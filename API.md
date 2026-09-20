# REST API Endpoint Reference Specification

Complete API reference documentation for **The Education Space Academy ERP**.

---

## 1. Authentication & Health Endpoints

- `GET /api/v1/health`: System health & module readiness check (`200 OK`).
- `POST /api/v1/auth/login`: Authenticate credentials (`email`, `password`) and receive JWT token.
- `GET /api/v1/auth/me`: Fetch profile payload for current authenticated user.

---

## 2. Core ERP Endpoints

### Student Lifecycle
- `GET /api/v1/students`: List students (Guarded by campus isolation & `students.read`).
- `POST /api/v1/students`: Enroll new student with duplicate check on email & admission code.
- `GET /api/v1/students/:id`: Get student profile details.

### Admissions Pipeline
- `GET /api/v1/admissions`: List online admission applications.
- `POST /api/v1/public/admissions/apply`: Public online admission submission.
- `POST /api/v1/admissions/:id/convert`: Convert verified applicant into active enrolled student.

### Attendance Management
- `POST /api/v1/attendance/mark-bulk`: Bulk mark class attendance (`PRESENT, ABSENT, LATE, LEAVE`).

### Financial & Fee System
- `GET /api/v1/fees/structures`: Fee structure templates.
- `POST /api/v1/fees/collect`: Record fee payment (Requires `fees.collect`).
- `POST /api/v1/fees/refund`: Process fee refund with audit log recording.

### Examinations & Marks
- `GET /api/v1/exams`: List scheduled exam events.
- `POST /api/v1/exams/marks`: Submit student component marks (Validates `0 <= marks <= maxMarks`).

### HR & Payroll Workflow
- `GET /api/v1/hr/staff`: Staff directory.
- `POST /api/v1/hr/payroll/process`: Process payroll run through 5-stage sequential workflow.

---

## 3. Dedicated Portal Endpoints

### Student Portal (`/api/v1/student-portal/`)
- `GET /me/dashboard`: Self-service overview dashboard.
- `GET /me/attendance`: Student's personal attendance percentage & log.
- `GET /me/timetable`: Weekly period schedule.
- `GET /me/results`: Exam marks, GPA, & PDF report card download.

### Parent Portal (`/api/v1/parent/`)
- `GET /children`: List linked children roster.
- `GET /children/:studentId/dashboard`: Child overview (Guarded by relationship validation).
- `GET /children/:studentId/fees`: Fee invoices & receipts.

### Teacher Portal (`/api/v1/teacher-portal/`)
- `GET /dashboard`: Today's classes & assigned stats.
- `GET /classes/:classId/students`: Roster for assigned class (Guarded by scope check).
- `POST /classes/:classId/attendance`: Mark attendance for assigned class.
- `POST /leave-requests`: Submit faculty leave application.

---

## 4. Administration & Documents Endpoints

- `GET /api/v1/system/config`: System settings across 15 sections with secret masking (`••••••••••••`).
- `PUT /api/v1/system/config`: Update configuration settings.
- `GET /api/v1/system/audit-logs`: Audit logs hub with JSON state diff inspector.
- `POST /api/v1/documents/certificates/issue`: Issue institutional certificate with auto serial number (`CERT-2026-90001`).
- `GET /api/v1/public/certificates/verify/:serialNumber`: Public QR code certificate verification.
