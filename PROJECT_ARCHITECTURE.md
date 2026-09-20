# Technical Audit & Enterprise Architecture Specification

**Project:** The Education Space Academy - Production-Grade School & Academy ERP  
**Document Version:** 1.0.0  
**Date:** August 19, 2026  

---

## 1. Current Architecture

Currently, **The Education Space Academy** is structured as a **client-side Single Page Application (SPA)** built with React 18 and Vite.

```text
┌─────────────────────────────────────────────────────────┐
│                    React 18 SPA (Vite)                  │
├─────────────────────────────────────────────────────────┤
│  UI Components (Navbar, AdminSidebar, Modals)           │
│  View Pages (LandingPage, AdminDashboard, StudentHub)   │
├─────────────────────────────────────────────────────────┤
│  State & Mock Data Layer (AppContext.jsx)              │
│  - In-memory mock arrays: Courses, Students, Roles      │
│  - Client-side Role Switcher & Permission helper        │
└─────────────────────────────────────────────────────────┘
                           │
                 (No API / Backend / DB)
```

- **Data State**: All data (courses, students, attendance, tasks, roles) is stored in-memory in `src/context/AppContext.jsx`. Data changes reset upon browser reload.
- **Routing**: View switching is driven by a single state string (`currentView`) managed inside `AppContext`.
- **Backend & Database**: Currently non-existent (pure frontend prototype).

---

## 2. Current Technology Stack

| Layer | Technologies & Dependencies |
| :--- | :--- |
| **Frontend Core** | React 18.2.0, React-DOM 18.2.0, Vite 5.1.6 (JavaScript / JSX) |
| **Styling & Design Tokens** | Tailwind CSS 3.4.1, PostCSS 8.4.35, Autoprefixer 10.4.18 |
| **Stitch Design System** | Terracotta `#9b3f14` primary, Ice `#f8f9ff` surface, Dark Ink `#0b1c30`, `#1A1A1A` admin sidebar |
| **Typography & Icons** | Google Fonts (*Hanken Grotesk*, *Inter*, *JetBrains Mono*, *Plus Jakarta Sans*), Lucide React 0.344.0 |
| **Data Visualization** | Chart.js 4.4.1 & React-Chartjs-2 5.2.0 |
| **Utilities** | `clsx` 2.1.0, Client CSV Exporter (`src/utils/exporter.js`) |
| **Backend & Database** | *None currently configured* |
| **Testing & Linting** | *None currently configured* |

---

## 3. Current Folder Structure

```text
d:/the education space academy/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── stitch_unified_academy_management_system/   # Stitch reference screens & HTML templates
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── AppContext.jsx                       # Centralized React Context & mock state
    ├── components/
    │   ├── common/
    │   │   ├── Modals.jsx                       # Multi-purpose dialogs & certificate generator
    │   │   └── Notifications.jsx                # Toast alerts
    │   └── layout/
    │       ├── Navbar.jsx                       # Header navigation & role selector
    │       └── AdminSidebar.jsx                 # Admin navigation drawer
    ├── pages/
    │   ├── AdminDashboard.jsx                   # KPI metrics, Chart.js graph, task board
    │   ├── AttendanceTracking.jsx               # Attendance register & toggle controls
    │   ├── CourseManagement.jsx                 # Course catalog, summary stats & filters
    │   ├── LandingPage.jsx                      # Public marketing landing page
    │   ├── RolePermissions.jsx                  # RBAC role cards & permission matrix
    │   └── StudentHub.jsx                       # Student learning portal & assessment engine
    └── utils/
        └── exporter.js                          # Client-side CSV export helper
```

---

## 4. Existing Database Models (Current Mock Schemas)

Currently, schemas exist only as JavaScript object definitions in `AppContext.jsx`:

1. **Course Model**:
   - `id` (string), `title` (string), `category` (string), `instructor` (string), `instructorRole` (string), `instructorAvatar` (URL), `price` (number), `rating` (number), `enrolledCount` (number), `totalModules` (number), `completedModules` (number), `completionPercentage` (number), `status` ('Published' | 'Draft' | 'Archived'), `thumbnail` (URL), `description` (string), `modules` (Array of `{ id, title, duration, completed }`).
2. **Student Model**:
   - `id` (string), `name` (string), `email` (string), `avatar` (URL), `batch` (string), `course` (string), `attendance` (percentage string), `status` ('Present' | 'Absent' | 'Late' | 'Excused'), `grade` (string).
3. **AdminTask Model**:
   - `id` (string), `title` (string), `completed` (boolean), `priority` ('High' | 'Medium' | 'Low').
4. **Role Model**:
   - `id` (string), `name` (string), `usersCount` (number), `type` ('System' | 'Custom'), `description` (string), `permissions` (Map of module to `{ create, read, update, delete, audit }`).

---

## 5. Existing Authentication System

- **Status**: **No real backend authentication system.**
- **Current Behavior**:
  - The header dropdown in `Navbar.jsx` mutates a `userRole` string in state (`'Admin'`, `'Student'`, or `'Instructor'`).
  - No user accounts, credentials, password hashing, tokens, sessions, or HTTP cookies exist.

---

## 6. Existing Authorization System

- **Status**: **Purely frontend-based.**
- **Current Behavior**:
  - `AppContext.jsx` exposes `hasPermission(module, action)`.
  - UI components conditionally render buttons (e.g. "Add Course", "Edit Course") based on `hasPermission`.
  - **Vulnerability**: Any client can modify local state or bypass frontend checks to execute actions because there is no backend API enforcing authorization.

---

## 7. Existing Modules

1. **Public Website & Landing Page** (`LandingPage.jsx`): Hero banner, statistics grid, course catalog search & filter, CTA section.
2. **Student Hub** (`StudentHub.jsx`): Student streak banner, enrolled tracks, interactive video player, module syllabus drawer, knowledge assessment check, achievements & certificate printer.
3. **Admin Executive Dashboard** (`AdminDashboard.jsx`): KPI metrics cards, student registration line chart, admin task board, recent enrollments log.
4. **Course Management System** (`CourseManagement.jsx`): Catalog grid, price & rating displays, status filters, course creation & editing modals.
5. **Attendance Tracking Hub** (`AttendanceTracking.jsx`): Class attendance register, P/A/L/E toggle controls, low attendance alert triggers, date & batch filters.
6. **Role & Permissions Governance** (`RolePermissions.jsx`): Role selection cards, custom role creator, interactive RBAC capability matrix.

---

## 8. Existing Reusable Components

- **`Navbar`**: Sticky header navigation bar with view links, role dropdown, and notification popover.
- **`AdminSidebar`**: Vertical admin sidebar with active section highlights and user profile card.
- **`Modals`**: Shared modal dialog renderer handling course creation, course editing, custom role definition, student enrollment, and official PDF certificate rendering.
- **`Notifications`**: Floating toast notification provider.
- **`exporter.js`**: Reusable CSV file export utility function.

---

## 9. Existing Problems

1. **Lack of Persistence & Backend**: All state is reset on page refresh.
2. **Lack of Type Safety**: Project uses JavaScript (`.jsx`/`.js`) rather than strict TypeScript (`.tsx`/`.ts`).
3. **Frontend-Only Business Logic**: Data filtering, authorization checks, and state mutations live directly inside React Context and UI components.
4. **No Automated Testing**: Zero unit, integration, or end-to-end tests exist in the project repository.
5. **Client-Side View Router**: Navigation relies on a single string state rather than an established routing engine with URL history and guard middleware.

---

## 10. Missing Functionality (To Reach Production ERP Scope)

To meet the approved product scope for a production-grade School & Academy ERP:

1. **Backend & Database Infrastructure**:
   - Node.js/Express or NestJS REST API server.
   - Relational Database (PostgreSQL) with Prisma ORM, migrations, and database transactions for financial records.
2. **Security & Auth Engine**:
   - User Accounts (Students, Parents, Teachers, Staff, Admins).
   - Password hashing (Argon2 / bcrypt).
   - JWT access & refresh token rotation with secure HTTP-only cookies.
   - Server-side RBAC middleware enforcing authorization on every API endpoint.
3. **Core ERP Scope Modules**:
   - **Multi-Campus System**: Campus definitions, campus-scoped data isolation.
   - **Admissions & Enrollment**: Application pipeline, student onboarding, parent/guardian links.
   - **Academics**: Classes, Sections, Subjects, Teacher assignments, Class Timetables, Homework & Assignments.
   - **Exams & Grading**: Exam scheduling, marks entry, automated grade calculation, report card generation.
   - **Fees & Financial Management**: Fee structures, payment gateways, challans, payment receipts, discounts, scholarships, fee defaulter tracking, expenses, and payroll.
   - **Staff & HR**: Teacher profiles, staff directory, leave requests & approvals, payroll calculation.
   - **Communication & CMS**: Announcements, news, event calendars, download center, FAQ manager, contact messages, audit logs, and system settings.

---

## 11. Security Risks

1. **Client-Side Authorization Bypass**: Permission checks happen in React state. Anyone can manipulate state or call functions directly in browser memory.
2. **Missing Input Validation**: No server-side schema validation (e.g. Zod/Joi) for user input, leaving potential SQL/NoSQL Injection or XSS vulnerabilities.
3. **No Financial Transaction Integrity**: Payment and fee records currently do not use ACID database transactions.
4. **Lack of Rate Limiting & Security Headers**: Missing rate limiting (express-rate-limit), CORS policies, and HTTP security headers (Helmet).
5. **Insecure Data Exposure**: Changing URL parameters or IDs could expose unauthorized records without backend authorization checks.

---

## 12. Recommended Migration Strategy

```text
Phase 1: Architecture & TypeScript Migration
└── Convert JSX to strict TypeScript (.tsx), define domain types & API service interfaces.

Phase 2: Database & Backend ORM Setup
└── Establish PostgreSQL / Prisma ORM schemas, migration scripts, and database seeders.

Phase 3: Authentication & Server-Side RBAC Engine
└── Implement secure JWT auth, password hashing, HTTP-only cookies, and server RBAC middleware.

Phase 4: Core Modular ERP API Integration
└── Connect existing UI views (Courses, Attendance, Roles, Dashboard) to authenticated REST endpoints.

Phase 5: Incremental Scope Expansion
└── Implement Admissions, Academics, Exams/Marks, Fees/Challans, HR/Payroll, CMS, and Audit Logs.
```

---

## 13. Recommended Implementation Order

1. **Section 1: Architecture & TypeScript Migration**: Set up strict TypeScript configuration (`tsconfig.json`), type definitions (`src/types/`), and API service layer (`src/services/api.ts`).
2. **Section 2: Database Schema & Migration Engine**: Define PostgreSQL schemas using Prisma ORM for Users, Campuses, Students, Courses, Attendance, Fees, Exams, and Roles.
3. **Section 3: Authentication & Security Middleware**: Build backend auth routes (`/api/v1/auth`), password hashing, JWT token rotation, and server-side authorization middleware.
4. **Section 4: Academics & Course Management API**: Create backend controllers, Zod validation, and frontend API integration for Courses, Modules, and Syllabi.
5. **Section 5: Admissions & Student Management**: Implement Student & Parent models, admission application pipelines, and batch/class assignments.
6. **Section 6: Attendance & Leave Management Engine**: Implement daily class attendance APIs, leave requests, low attendance warning alerts, and CSV reporting.
7. **Section 7: Examination, Marks & Report Cards Engine**: Build exam scheduling, marks entry, grade calculation, and printable report cards.
8. **Section 8: Fees, Payments, Challans & Financial Transactions**: Implement fee structures, payment receipts, challan generation, discount/scholarship handling, and database transactions.
9. **Section 9: Staff, HR & Payroll Management**: Build staff directory, salary structures, leave management, and monthly payroll processing.
10. **Section 10: Announcements, News, CMS & Communication Hub**: Implement announcements, event calendars, public site CMS, FAQs, and contact messages.
11. **Section 11: System Settings, Audit Logging & End-to-End Verification**: Implement audit log recorder, system configuration settings, type checking, linting, unit/integration tests, and production build verification.
