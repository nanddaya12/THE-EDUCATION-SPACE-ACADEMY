// Initial Governance, Security, Public Site, and User Profile datasets

export const AVAILABLE_PERMISSIONS = [
  // Students & Enrollment
  { key: 'students.view', label: 'View Students Directory', module: 'Students & Enrollment', action: 'read' },
  { key: 'students.create', label: 'Enroll & Register Student', module: 'Students & Enrollment', action: 'create' },
  { key: 'students.update', label: 'Update Student Profile & Status', module: 'Students & Enrollment', action: 'update' },
  { key: 'students.archive', label: 'Archive / Suspend Student', module: 'Students & Enrollment', action: 'delete' },

  // Admissions & Registrar
  { key: 'admissions.view', label: 'View Inquiries & Applications', module: 'Admissions & Registrar', action: 'read' },
  { key: 'admissions.process', label: 'Evaluate & Process Admissions', module: 'Admissions & Registrar', action: 'update' },
  { key: 'admissions.approve', label: 'Issue Transfer Certificates & Final Approvals', module: 'Admissions & Registrar', action: 'audit' },

  // Faculty & Staff
  { key: 'staff.view', label: 'View Faculty & Staff Directory', module: 'Faculty & Staff', action: 'read' },
  { key: 'staff.manage', label: 'Manage Staff Rosters & Contracts', module: 'Faculty & Staff', action: 'update' },
  { key: 'staff.payroll', label: 'Access Staff Payroll & Benefits', module: 'Faculty & Staff', action: 'audit' },

  // Attendance Management
  { key: 'attendance.view', label: 'View Attendance Records', module: 'Attendance', action: 'read' },
  { key: 'attendance.mark', label: 'Mark Class & Bus Attendance', module: 'Attendance', action: 'create' },
  { key: 'attendance.edit', label: 'Modify Historical Attendance Logs', module: 'Attendance', action: 'update' },
  { key: 'attendance.approve', label: 'Authorize Leaves & Excuse Absences', module: 'Attendance', action: 'audit' },

  // Academics, Syllabus & Timetables
  { key: 'academics.view', label: 'View Academics & Syllabus', module: 'Academics & Timetables', action: 'read' },
  { key: 'academics.edit', label: 'Edit Curriculum, Units & Timetables', module: 'Academics & Timetables', action: 'update' },
  { key: 'courses.publish', label: 'Publish / Manage LMS Courses', module: 'Academics & Timetables', action: 'create' },

  // Examinations & Gradebook
  { key: 'results.view', label: 'View Exam Schedules & Gradebook', module: 'Examinations & Grading', action: 'read' },
  { key: 'results.enter', label: 'Enter & Edit Exam Marks', module: 'Examinations & Grading', action: 'update' },
  { key: 'results.publish', label: 'Publish Final Report Cards & Transcripts', module: 'Examinations & Grading', action: 'audit' },

  // Fees, Finance & Billing
  { key: 'fees.view', label: 'View Fee Challans & Invoices', module: 'Fees & Finance', action: 'read' },
  { key: 'fees.collect', label: 'Collect & Reconcile Fee Payments', module: 'Fees & Finance', action: 'create' },
  { key: 'fees.refund', label: 'Authorize Concessions, Waivers & Refunds', module: 'Fees & Finance', action: 'audit' },

  // Library & Learning Resources
  { key: 'library.view', label: 'Browse Library Catalog & Digital Assets', module: 'Library & Learning Resources', action: 'read' },
  { key: 'library.manage', label: 'Circulation, Book Check-In/Out & ISBN Inventory', module: 'Library & Learning Resources', action: 'update' },

  // Transport & Fleet
  { key: 'transport.view', label: 'View Bus Routes & Live Stops', module: 'Transport & Fleet', action: 'read' },
  { key: 'transport.manage', label: 'Manage Bus Fleet, Rosters & Live Tracking', module: 'Transport & Fleet', action: 'update' },

  // Health, Clinic & Counseling
  { key: 'health.view', label: 'View Medical History & Clinic Logs', module: 'Health & Well-being', action: 'read' },
  { key: 'health.manage', label: 'Record Clinic Visits, Dispense Meds & Care', module: 'Health & Well-being', action: 'update' },
  { key: 'counseling.manage', label: 'Confidential Guidance & Counseling Notes', module: 'Health & Well-being', action: 'audit' },

  // Facilities, Hostel & Store
  { key: 'hostel.manage', label: 'Manage Hostel Rooms, Curfews & Leaves', module: 'Facilities & Campus Operations', action: 'update' },
  { key: 'inventory.manage', label: 'Manage Textbooks, Uniforms & Store Stock', module: 'Facilities & Campus Operations', action: 'update' },

  // Public Website & CMS
  { key: 'website.edit', label: 'Edit Public Website Content & Hero Banner', module: 'Website CMS', action: 'update' },
  { key: 'website.publish', label: 'Publish News, Events & Announcements', module: 'Website CMS', action: 'create' },

  // Security, Audit & Global Governance
  { key: 'security.manage', label: 'Manage Roles, Permissions & Security Policies', module: 'Security & Governance', action: 'audit' },
  { key: 'system.config', label: 'Configure Global Institution Settings & Logs', module: 'Security & Governance', action: 'audit' }
];

export const INITIAL_SYSTEM_ROLES = [
  // ==========================================
  // 1. EXECUTIVE & GOVERNANCE LEADERSHIP
  // ==========================================
  {
    id: 'r_super_admin',
    name: 'SUPER_ADMIN',
    displayName: 'Super Administrator',
    usersCount: 2,
    category: 'Executive',
    type: 'System',
    isProtected: true,
    description: 'Supreme institutional authority across all campuses, security policies, public CMS, and all profile operations.',
    permissions: AVAILABLE_PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: true }), {})
  },
  {
    id: 'r_managing_director',
    name: 'MANAGING_DIRECTOR',
    displayName: 'Managing Director / Patron',
    usersCount: 1,
    category: 'Executive',
    type: 'System',
    isProtected: true,
    description: 'High-level strategic management, expansion oversight, institutional capital planning, and board-level reporting.',
    permissions: AVAILABLE_PERMISSIONS.reduce((acc, p) => {
      acc[p.key] = !p.key.includes('attendance.mark') && !p.key.includes('results.enter');
      return acc;
    }, {})
  },
  {
    id: 'r_institution_admin',
    name: 'INSTITUTION_ADMIN',
    displayName: 'Institution Administrator',
    usersCount: 3,
    category: 'Executive',
    type: 'System',
    isProtected: true,
    description: 'Institution-wide administration, academic quality oversight, accreditation compliance, and executive operations.',
    permissions: AVAILABLE_PERMISSIONS.reduce((acc, p) => {
      acc[p.key] = !p.key.includes('security.manage');
      return acc;
    }, {})
  },
  {
    id: 'r_campus_admin',
    name: 'CAMPUS_ADMIN',
    displayName: 'Campus Administrator',
    usersCount: 5,
    category: 'Executive',
    type: 'System',
    isProtected: true,
    description: 'Branch campus day-to-day administration, local facilities governance, staff coordination, and campus safety.',
    permissions: {
      'students.view': true,
      'students.create': true,
      'students.update': true,
      'staff.view': true,
      'staff.manage': true,
      'attendance.view': true,
      'attendance.approve': true,
      'academics.view': true,
      'results.view': true,
      'fees.view': true,
      'fees.collect': true,
      'transport.view': true,
      'transport.manage': true,
      'library.view': true,
      'website.edit': true
    }
  },
  {
    id: 'r_principal',
    name: 'PRINCIPAL',
    displayName: 'Campus Principal / Head of School',
    usersCount: 4,
    category: 'Academic',
    type: 'System',
    isProtected: true,
    description: 'Academic leader directing curriculum quality, pedagogy standards, faculty appraisals, and student discipline.',
    permissions: {
      'students.view': true,
      'students.create': true,
      'students.update': true,
      'admissions.view': true,
      'admissions.approve': true,
      'staff.view': true,
      'staff.manage': true,
      'attendance.view': true,
      'attendance.approve': true,
      'academics.view': true,
      'academics.edit': true,
      'courses.publish': true,
      'results.view': true,
      'results.publish': true,
      'fees.view': true,
      'library.view': true,
      'counseling.manage': true
    }
  },
  {
    id: 'r_vice_principal',
    name: 'VICE_PRINCIPAL',
    displayName: 'Vice Principal / Deputy Head',
    usersCount: 4,
    category: 'Academic',
    type: 'System',
    isProtected: false,
    description: 'Direct assistant to the principal, timetabling manager, student conduct officer, and substitute teacher coordinator.',
    permissions: {
      'students.view': true,
      'students.update': true,
      'admissions.view': true,
      'staff.view': true,
      'attendance.view': true,
      'attendance.approve': true,
      'academics.view': true,
      'academics.edit': true,
      'results.view': true,
      'results.enter': true,
      'counseling.manage': true
    }
  },
  {
    id: 'r_academic_dean',
    name: 'ACADEMIC_DEAN',
    displayName: 'Academic Dean / Director of Studies',
    usersCount: 2,
    category: 'Academic',
    type: 'System',
    isProtected: false,
    description: 'Directs curriculum frameworks, standardized testing policies, faculty training workshops, and academic research.',
    permissions: {
      'students.view': true,
      'staff.view': true,
      'academics.view': true,
      'academics.edit': true,
      'courses.publish': true,
      'results.view': true,
      'results.publish': true
    }
  },

  // ==========================================
  // 2. FACULTY & INSTRUCTIONAL LEADERSHIP
  // ==========================================
  {
    id: 'r_hod',
    name: 'HEAD_OF_DEPARTMENT',
    displayName: 'Head of Department (HOD)',
    usersCount: 8,
    category: 'Faculty',
    type: 'System',
    isProtected: false,
    description: 'Subject department head (Science, Math, Languages, Humanities) overseeing lesson plans, tests, and department mentors.',
    permissions: {
      'students.view': true,
      'staff.view': true,
      'attendance.view': true,
      'academics.view': true,
      'academics.edit': true,
      'courses.publish': true,
      'results.view': true,
      'results.enter': true,
      'results.publish': true
    }
  },
  {
    id: 'r_teacher',
    name: 'TEACHER',
    displayName: 'Senior Faculty / Subject Teacher',
    usersCount: 42,
    category: 'Faculty',
    type: 'System',
    isProtected: true,
    description: 'Classroom instructor handling lectures, daily homework assignments, continuous evaluations, and exam marking.',
    permissions: {
      'students.view': true,
      'attendance.view': true,
      'attendance.mark': true,
      'attendance.edit': true,
      'academics.view': true,
      'academics.edit': true,
      'results.view': true,
      'results.enter': true
    }
  },
  {
    id: 'r_class_teacher',
    name: 'CLASS_TEACHER',
    displayName: 'Head Class Teacher / Homeroom Advisor',
    usersCount: 18,
    category: 'Faculty',
    type: 'System',
    isProtected: true,
    description: 'Section homeroom tutor tracking student conduct, daily homeroom attendance, and parent-teacher communication logs.',
    permissions: {
      'students.view': true,
      'students.update': true,
      'attendance.view': true,
      'attendance.mark': true,
      'attendance.edit': true,
      'attendance.approve': true,
      'academics.view': true,
      'results.view': true,
      'results.enter': true
    }
  },
  {
    id: 'r_teaching_assistant',
    name: 'TEACHING_ASSISTANT',
    displayName: 'Teaching Assistant / Co-Teacher',
    usersCount: 12,
    category: 'Faculty',
    type: 'System',
    isProtected: false,
    description: 'Assists senior faculty with laboratory setups, grading support, remedial learner sessions, and classroom activity supervision.',
    permissions: {
      'students.view': true,
      'attendance.view': true,
      'attendance.mark': true,
      'academics.view': true,
      'results.view': true
    }
  },
  {
    id: 'r_sen_coordinator',
    name: 'SEN_COORDINATOR',
    displayName: 'Special Needs (SEN) Coordinator',
    usersCount: 3,
    category: 'Student Care',
    type: 'System',
    isProtected: false,
    description: 'Designs Individualized Education Programs (IEP), coordinates accessibility aids, and supports neurodiverse learners.',
    permissions: {
      'students.view': true,
      'students.update': true,
      'academics.view': true,
      'attendance.view': true,
      'counseling.manage': true,
      'results.view': true
    }
  },
  {
    id: 'r_substitute_teacher',
    name: 'SUBSTITUTE_TEACHER',
    displayName: 'Substitute / Visiting Teacher',
    usersCount: 6,
    category: 'Faculty',
    type: 'Custom',
    isProtected: false,
    description: 'Temporary visiting instructor assigned to relieve absent teachers with limited classroom attendance and lecture permissions.',
    permissions: {
      'students.view': true,
      'attendance.view': true,
      'attendance.mark': true,
      'academics.view': true
    }
  },

  // ==========================================
  // 3. STUDENT WELL-BEING, HEALTH & GUIDANCE
  // ==========================================
  {
    id: 'r_counselor',
    name: 'SCHOOL_COUNSELOR',
    displayName: 'School Counselor & Psychologist',
    usersCount: 4,
    category: 'Student Care',
    type: 'System',
    isProtected: false,
    description: 'Confidential mental health guidance, psycho-social wellness, behavioral intervention plans, and student support.',
    permissions: {
      'students.view': true,
      'attendance.view': true,
      'counseling.manage': true
    }
  },
  {
    id: 'r_career_advisor',
    name: 'CAREER_ADVISOR',
    displayName: 'College & Career Placement Advisor',
    usersCount: 2,
    category: 'Student Care',
    type: 'System',
    isProtected: false,
    description: 'Guides senior secondary students on SAT/ACT prep, international university applications, scholarships, and career pathways.',
    permissions: {
      'students.view': true,
      'results.view': true,
      'academics.view': true
    }
  },
  {
    id: 'r_campus_nurse',
    name: 'CAMPUS_NURSE',
    displayName: 'Campus Medical Officer / School Nurse',
    usersCount: 3,
    category: 'Student Care',
    type: 'System',
    isProtected: false,
    description: 'Infirmary management, first-aid administration, student immunization logs, prescription dispensary, and health triage.',
    permissions: {
      'students.view': true,
      'health.view': true,
      'health.manage': true,
      'attendance.view': true
    }
  },

  // ==========================================
  // 4. CO-CURRICULAR, SPORTS & ARTS
  // ==========================================
  {
    id: 'r_sports_director',
    name: 'SPORTS_DIRECTOR',
    displayName: 'Athletic & Sports Director',
    usersCount: 2,
    category: 'Faculty',
    type: 'System',
    isProtected: false,
    description: 'Directs the campus sports academy, inter-school tournament fixtures, fitness tracking, and athletic facilities.',
    permissions: {
      'students.view': true,
      'attendance.view': true,
      'attendance.mark': true,
      'inventory.manage': true
    }
  },
  {
    id: 'r_pe_teacher',
    name: 'PE_TEACHER',
    displayName: 'Physical Education (PE) Coach',
    usersCount: 5,
    category: 'Faculty',
    type: 'Custom',
    isProtected: false,
    description: 'Conducts daily PE physical fitness drills, gymnastics, swimming, team sports coaching, and athletics scorekeeping.',
    permissions: {
      'students.view': true,
      'attendance.view': true,
      'attendance.mark': true,
      'results.view': true,
      'results.enter': true
    }
  },
  {
    id: 'r_arts_coordinator',
    name: 'ARTS_COORDINATOR',
    displayName: 'Arts & Cultural Coordinator',
    usersCount: 2,
    category: 'Faculty',
    type: 'Custom',
    isProtected: false,
    description: 'Manages visual arts studios, music ensembles, drama productions, annual day galas, and auditorium rehearsals.',
    permissions: {
      'students.view': true,
      'attendance.view': true,
      'academics.view': true,
      'website.edit': true
    }
  },

  // ==========================================
  // 5. LIBRARY, INFORMATION & ACADEMIC TECH
  // ==========================================
  {
    id: 'r_chief_librarian',
    name: 'CHIEF_LIBRARIAN',
    displayName: 'Campus Chief Librarian',
    usersCount: 2,
    category: 'Library & IT',
    type: 'System',
    isProtected: false,
    description: 'Oversees digital research subscriptions, physical library inventory, Dewey decimal cataloguing, and book purchases.',
    permissions: {
      'students.view': true,
      'staff.view': true,
      'library.view': true,
      'library.manage': true
    }
  },
  {
    id: 'r_assistant_librarian',
    name: 'ASSISTANT_LIBRARIAN',
    displayName: 'Assistant Librarian / Cataloguer',
    usersCount: 4,
    category: 'Library & IT',
    type: 'Custom',
    isProtected: false,
    description: 'Circulation desk check-in and check-out, barcode scanning, overdue fines tracking, and student reading hall supervision.',
    permissions: {
      'students.view': true,
      'library.view': true,
      'library.manage': true
    }
  },
  {
    id: 'r_it_admin',
    name: 'IT_ADMINISTRATOR',
    displayName: 'IT & Network Systems Administrator',
    usersCount: 3,
    category: 'Library & IT',
    type: 'System',
    isProtected: false,
    description: 'Campus Wi-Fi infrastructure, computer labs, smartboards, LMS integration, hardware inventory, and domain accounts.',
    permissions: {
      'staff.view': true,
      'students.view': true,
      'security.manage': true,
      'system.config': true,
      'website.edit': true
    }
  },
  {
    id: 'r_lab_technician',
    name: 'LAB_TECHNICIAN',
    displayName: 'Science & STEM Lab Demonstrator',
    usersCount: 4,
    category: 'Library & IT',
    type: 'Custom',
    isProtected: false,
    description: 'Calibrates physics, chemistry, biology, and robotics laboratory equipment, prepares chemical reagents, and enforces safety.',
    permissions: {
      'students.view': true,
      'academics.view': true,
      'inventory.manage': true
    }
  },

  // ==========================================
  // 6. ADMISSIONS, FRONT DESK & PUBLIC RELATIONS
  // ==========================================
  {
    id: 'r_admissions_officer',
    name: 'ADMISSIONS_OFFICER',
    displayName: 'Registrar & Admissions Officer',
    usersCount: 4,
    category: 'Admissions',
    type: 'System',
    isProtected: true,
    description: 'Manages incoming prospective applicants, campus tours, entrance testing, enrollment files, and official student records.',
    permissions: {
      'students.view': true,
      'students.create': true,
      'students.update': true,
      'admissions.view': true,
      'admissions.process': true,
      'admissions.approve': true,
      'fees.view': true
    }
  },
  {
    id: 'r_receptionist',
    name: 'RECEPTIONIST',
    displayName: 'Front Desk Receptionist & Visitor Liaison',
    usersCount: 6,
    category: 'Admissions',
    type: 'System',
    isProtected: true,
    description: 'Front desk reception, visitor check-in gate passes, telephone inquiry dispatch, and appointment scheduling.',
    permissions: {
      'students.view': true,
      'admissions.view': true,
      'admissions.process': true,
      'fees.view': true
    }
  },
  {
    id: 'r_pr_officer',
    name: 'PR_COMMUNICATIONS',
    displayName: 'Public Relations & Media Officer',
    usersCount: 2,
    category: 'Admissions',
    type: 'Custom',
    isProtected: false,
    description: 'Publishes public announcements, school newsletters, press releases, social media highlights, and website stories.',
    permissions: {
      'website.edit': true,
      'website.publish': true
    }
  },

  // ==========================================
  // 7. FINANCE, BURSARY & PROCUREMENT
  // ==========================================
  {
    id: 'r_finance_manager',
    name: 'FINANCE_MANAGER',
    displayName: 'Chief Financial Officer / Finance Manager',
    usersCount: 2,
    category: 'Finance',
    type: 'System',
    isProtected: true,
    description: 'Institutional budget allocation, fiscal compliance audits, revenue forecasting, payroll sign-off, and vendor contracts.',
    permissions: {
      'fees.view': true,
      'fees.collect': true,
      'fees.refund': true,
      'staff.payroll': true,
      'inventory.manage': true
    }
  },
  {
    id: 'r_accountant',
    name: 'ACCOUNTANT',
    displayName: 'Accountant / Bursar',
    usersCount: 5,
    category: 'Finance',
    type: 'System',
    isProtected: true,
    description: 'Student fee challan generation, online payment gateway reconciliation, expense vouchers, and bank statements.',
    permissions: {
      'students.view': true,
      'fees.view': true,
      'fees.collect': true,
      'fees.refund': true,
      'staff.payroll': true
    }
  },
  {
    id: 'r_cashier',
    name: 'CASHIER',
    displayName: 'Cashier / Fee Counter Clerk',
    usersCount: 4,
    category: 'Finance',
    type: 'Custom',
    isProtected: false,
    description: 'Walk-in parent fee collection counter, physical receipt stamping, and end-of-day cash drawer balancing.',
    permissions: {
      'students.view': true,
      'fees.view': true,
      'fees.collect': true
    }
  },
  {
    id: 'r_store_keeper',
    name: 'STORE_KEEPER',
    displayName: 'Procurement & Store Keeper',
    usersCount: 3,
    category: 'Operations',
    type: 'Custom',
    isProtected: false,
    description: 'Manages school uniform inventory, textbooks, stationery packs, lab supplies, and vendor goods receipts.',
    permissions: {
      'inventory.manage': true,
      'fees.view': true
    }
  },

  // ==========================================
  // 8. LOGISTICS, CAMPUS OPERATIONS & SAFETY
  // ==========================================
  {
    id: 'r_transport_manager',
    name: 'TRANSPORT_SUPERVISOR',
    displayName: 'Transport & Fleet Supervisor',
    usersCount: 3,
    category: 'Logistics & Safety',
    type: 'System',
    isProtected: false,
    description: 'School bus fleet planning, GPS route tracking, driver assignments, vehicle roadworthiness inspection, and safety drills.',
    permissions: {
      'students.view': true,
      'transport.view': true,
      'transport.manage': true,
      'attendance.view': true
    }
  },
  {
    id: 'r_bus_driver',
    name: 'BUS_ATTENDANT',
    displayName: 'Bus Driver & Route Attendant',
    usersCount: 14,
    category: 'Logistics & Safety',
    type: 'Custom',
    isProtected: false,
    description: 'Daily bus route pickup/drop boarding checks, student travel safety supervision, and emergency communication.',
    permissions: {
      'students.view': true,
      'transport.view': true,
      'attendance.mark': true
    }
  },
  {
    id: 'r_facilities_supervisor',
    name: 'FACILITIES_SUPERVISOR',
    displayName: 'Estate & Facilities Supervisor',
    usersCount: 3,
    category: 'Operations',
    type: 'Custom',
    isProtected: false,
    description: 'Maintains school infrastructure, HVAC, backup generators, plumbing, campus grounds, and janitorial sanitation crews.',
    permissions: {
      'staff.view': true,
      'inventory.manage': true
    }
  },
  {
    id: 'r_security_chief',
    name: 'SECURITY_OFFICER',
    displayName: 'Chief Campus Security & Safety Officer',
    usersCount: 4,
    category: 'Logistics & Safety',
    type: 'System',
    isProtected: false,
    description: 'Campus perimeter security, 24/7 CCTV surveillance, gate visitor badges, emergency evacuation, and fire drill drills.',
    permissions: {
      'students.view': true,
      'staff.view': true,
      'transport.view': true
    }
  },
  {
    id: 'r_hostel_warden',
    name: 'HOSTEL_WARDEN',
    displayName: 'Hostel & Dormitory Warden',
    usersCount: 4,
    category: 'Operations',
    type: 'System',
    isProtected: false,
    description: 'Supervises residential boarding dormitories, room assignments, evening study hours, night curfews, and weekend passes.',
    permissions: {
      'students.view': true,
      'attendance.view': true,
      'attendance.mark': true,
      'hostel.manage': true,
      'counseling.manage': true
    }
  },
  {
    id: 'r_cafeteria_manager',
    name: 'CAFETERIA_MANAGER',
    displayName: 'Cafeteria & Nutrition Coordinator',
    usersCount: 2,
    category: 'Operations',
    type: 'Custom',
    isProtected: false,
    description: 'Plans student nutritious meal menus, dietary allergen logs, kitchen sanitation standards, and cafeteria meal tokens.',
    permissions: {
      'students.view': true,
      'inventory.manage': true
    }
  },

  // ==========================================
  // 9. PORTAL USERS & COMMUNITY
  // ==========================================
  {
    id: 'r_student',
    name: 'STUDENT',
    displayName: 'Enrolled Student',
    usersCount: 1420,
    category: 'Portal',
    type: 'System',
    isProtected: true,
    description: 'Student access to learning hub, lesson lectures, homework submissions, timetables, and fee vouchers.',
    permissions: {
      'academics.view': true,
      'attendance.view': true,
      'results.view': true,
      'fees.view': true,
      'library.view': true
    }
  },
  {
    id: 'r_parent',
    name: 'PARENT',
    displayName: 'Parent / Legal Guardian',
    usersCount: 1280,
    category: 'Portal',
    type: 'System',
    isProtected: true,
    description: 'Parent view of student attendance alerts, fee voucher payments, academic reports, and teacher consultations.',
    permissions: {
      'attendance.view': true,
      'results.view': true,
      'fees.view': true,
      'transport.view': true
    }
  },
  {
    id: 'r_alumni',
    name: 'ALUMNI',
    displayName: 'Alumni Association Member',
    usersCount: 310,
    category: 'Portal',
    type: 'Custom',
    isProtected: false,
    description: 'Graduated students participating in mentorship programs, alumni networking reunions, and scholarship endowments.',
    permissions: {
      'website.edit': false,
      'results.view': true
    }
  }
];

export const INITIAL_SECURITY_SETTINGS = {
  mfaEnforcement: 'ADMINS_ONLY', // 'DISABLED' | 'ADMINS_ONLY' | 'ALL_USERS'
  sessionTimeoutMinutes: 30,
  maxFailedLogins: 5,
  lockoutDurationMinutes: 15,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90
  },
  ipRestrictionEnabled: false,
  allowedIpRanges: '192.168.1.0/24, 10.0.0.0/8',
  enforceHttpsOnly: true,
  auditLogRetentionDays: 365
};

export const INITIAL_SECURITY_AUDIT_LOGS = [
  {
    id: 'log_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleString(),
    actor: 'admin@educationspace.edu',
    action: 'POLICY_UPDATE',
    category: 'Security',
    details: 'Enforced MFA for all administrative roles and configured session timeout to 30 mins.',
    status: 'SUCCESS',
    ip: '192.168.1.104'
  },
  {
    id: 'log_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleString(),
    actor: 'admin@educationspace.edu',
    action: 'ROLES_CATALOG_EXPANDED',
    category: 'RBAC',
    details: 'Expanded institutional RBAC schema to 39 comprehensive school roles spanning Executive, Faculty, Well-being, Logistics, and Operations.',
    status: 'SUCCESS',
    ip: '192.168.1.104'
  },
  {
    id: 'log_3',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toLocaleString(),
    actor: 'admin@educationspace.edu',
    action: 'ROLE_MODIFIED',
    category: 'RBAC',
    details: 'Updated TEACHER capability matrix to include "results.enter".',
    status: 'SUCCESS',
    ip: '192.168.1.104'
  },
  {
    id: 'log_4',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toLocaleString(),
    actor: 'system',
    action: 'SYSTEM_AUDIT',
    category: 'Governance',
    details: 'Routine integrity scan completed: all role capabilities aligned with institutional policy.',
    status: 'SUCCESS',
    ip: '127.0.0.1'
  }
];

export const INITIAL_PUBLIC_SITE_CONFIG = {
  hero: {
    badge: '★ Premier K-12 & Higher Secondary Education',
    title: 'Nurturing Intellect, Character & Leadership',
    subtitle: 'Welcome to The Education Space Academy. We empower curious minds with world-class faculty, cutting-edge STEM labs, and personalized academic pathways.',
    ctaPrimaryText: 'Explore Admissions 2026',
    ctaPrimaryLink: '#admissions',
    ctaSecondaryText: 'Campus Virtual Tour',
    ctaSecondaryLink: '#campus',
    bannerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'
  },
  announcementBar: {
    enabled: true,
    text: '⚡ Fall 2026 Admissions are now officially OPEN for Cambridge O/A-Levels & Pre-Engineering/Pre-Medical.',
    linkText: 'Apply Online Now →',
    linkUrl: '#admissions',
    type: 'info'
  },
  contactInfo: {
    phone: '+92 300 1234567',
    email: 'admissions@educationspace.edu',
    campusName: 'The Education Space Academy (Main Campus)',
    address: 'The Education Space Academy, Main Campus, Pakistan',
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  stats: {
    studentsEnrolled: '2,850+',
    expertFaculty: '120+',
    acceptanceRate: '98.4%',
    campusesCount: '1 Main Campus'
  },
  admissionsBanner: {
    isOpen: true,
    statusText: 'Admissions Open for Academic Year 2026-27',
    deadline: 'October 15, 2026',
    gradesEligible: 'Grade 6 through A-Levels / F.Sc Pre-Eng & Pre-Med'
  }
};

export const INITIAL_SITE_PROFILES = [
  {
    id: 'u_admin_01',
    fullName: 'System Administrator',
    email: 'admin@educationspace.edu',
    role: 'SUPER_ADMIN',
    roleCategory: 'Executive',
    phone: '+92 300 1234567',
    identifier: 'EMP-ADM-001',
    department: 'Central Administration & Governance',
    gradeOrBatch: 'Executive Board',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Jan 2024',
    defaultView: 'admin-dashboard'
  },
  {
    id: 'u_principal_01',
    fullName: 'Prof. Niaz Dars',
    email: 'director@tesacademy.edu.pk',
    role: 'PRINCIPAL',
    roleCategory: 'Academic',
    phone: '0333 2613913',
    identifier: 'EMP-DIR-001',
    department: 'Office of the Academic Director',
    gradeOrBatch: 'Executive Leadership',
    status: 'Active',
    avatar: '/images/tes_director_portrait.jpg',
    joinedDate: 'Jan 2020',
    defaultView: 'admin-dashboard'
  },
  {
    id: 'u_hod_01',
    fullName: 'Dr. Evelyn Sterling',
    email: 'hod.science@educationspace.edu',
    role: 'HEAD_OF_DEPARTMENT',
    roleCategory: 'Faculty',
    phone: '+92 311 2345678',
    identifier: 'EMP-HOD-002',
    department: 'Science & STEM Department',
    gradeOrBatch: 'Department Head',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Aug 2023',
    defaultView: 'teacher-portal'
  },
  {
    id: 'u_teacher_01',
    fullName: 'Dr. Sarah Jenkins',
    email: 'teacher@educationspace.edu',
    role: 'TEACHER',
    roleCategory: 'Faculty',
    phone: '+92 312 9876543',
    identifier: 'EMP-FAC-014',
    department: 'Computer Science & Software Engineering',
    gradeOrBatch: 'Senior Faculty',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Aug 2023',
    defaultView: 'teacher-portal'
  },
  {
    id: 'u_teacher_02',
    fullName: 'Prof. Marcus Vance',
    email: 'm.vance@educationspace.edu',
    role: 'TEACHER',
    roleCategory: 'Faculty',
    phone: '+92 321 4567890',
    identifier: 'EMP-FAC-022',
    department: 'Artificial Intelligence & Robotics',
    gradeOrBatch: 'Lead Professor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Feb 2024',
    defaultView: 'teacher-portal'
  },
  {
    id: 'u_counselor_01',
    fullName: 'Claire Bennett, M.Sc',
    email: 'counselor@educationspace.edu',
    role: 'SCHOOL_COUNSELOR',
    roleCategory: 'Student Care',
    phone: '+92 331 8765412',
    identifier: 'EMP-CNS-005',
    department: 'Student Well-being & Guidance',
    gradeOrBatch: 'Resident Psychologist',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Jan 2024',
    defaultView: 'admin-dashboard'
  },
  {
    id: 'u_nurse_01',
    fullName: 'Nurse Hannah Abbott',
    email: 'clinic@educationspace.edu',
    role: 'CAMPUS_NURSE',
    roleCategory: 'Student Care',
    phone: '+92 322 7654321',
    identifier: 'EMP-MED-002',
    department: 'Campus Health Clinic & Infirmary',
    gradeOrBatch: 'Chief Medical Officer',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'May 2023',
    defaultView: 'admin-dashboard'
  },
  {
    id: 'u_librarian_01',
    fullName: 'Jonathan Reed',
    email: 'library@educationspace.edu',
    role: 'CHIEF_LIBRARIAN',
    roleCategory: 'Library & IT',
    phone: '+92 333 1122334',
    identifier: 'EMP-LIB-001',
    department: 'Central Knowledge & Media Center',
    gradeOrBatch: 'Chief Librarian',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Sep 2022',
    defaultView: 'admin-dashboard'
  },
  {
    id: 'u_admissions_01',
    fullName: 'Amina Siddiqui',
    email: 'admissions.desk@educationspace.edu',
    role: 'ADMISSIONS_OFFICER',
    roleCategory: 'Admissions',
    phone: '+92 300 4455667',
    identifier: 'EMP-ADM-012',
    department: 'Enrollment & Registrar Office',
    gradeOrBatch: 'Senior Registrar',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Apr 2023',
    defaultView: 'admin-dashboard'
  },
  {
    id: 'u_acct_01',
    fullName: 'Marcus Vance (Finance)',
    email: 'accountant@educationspace.edu',
    role: 'ACCOUNTANT',
    roleCategory: 'Finance',
    phone: '+92 300 8882233',
    identifier: 'EMP-FIN-003',
    department: 'Treasury & Accounts',
    gradeOrBatch: 'Senior Bursar',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Mar 2024',
    defaultView: 'fee-management'
  },
  {
    id: 'u_transport_01',
    fullName: 'Tariq Mahmood',
    email: 'transport@educationspace.edu',
    role: 'TRANSPORT_SUPERVISOR',
    roleCategory: 'Logistics & Safety',
    phone: '+92 345 6789012',
    identifier: 'EMP-TRN-001',
    department: 'Campus Transport & Fleet',
    gradeOrBatch: 'Fleet Supervisor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Jul 2022',
    defaultView: 'admin-dashboard'
  },
  {
    id: 'u_student_01',
    fullName: 'Alex Rivera',
    email: 'alex.rivera@edu.com',
    role: 'STUDENT',
    roleCategory: 'Portal',
    phone: '+92 333 5551234',
    identifier: 'STU-2026-089',
    department: 'Senior Cambridge & STEM',
    gradeOrBatch: 'Batch 2026-A (Grade 11)',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Sep 2024',
    defaultView: 'student-portal'
  },
  {
    id: 'u_student_02',
    fullName: 'Sophia Chen',
    email: 'sophia.c@edu.com',
    role: 'STUDENT',
    roleCategory: 'Portal',
    phone: '+92 334 7778899',
    identifier: 'STU-2026-104',
    department: 'Pre-Medical Science',
    gradeOrBatch: 'Batch 2026-A (Grade 11)',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Sep 2024',
    defaultView: 'student-portal'
  },
  {
    id: 'u_parent_01',
    fullName: 'Robert Rivera (Parent)',
    email: 'parent@educationspace.edu',
    role: 'PARENT',
    roleCategory: 'Portal',
    phone: '+92 301 9991122',
    identifier: 'PAR-2026-044',
    department: 'Guardian Office',
    gradeOrBatch: 'Guardian of Alex Rivera',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Sep 2024',
    defaultView: 'parent-portal'
  }
];
