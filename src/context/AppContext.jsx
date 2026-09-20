import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { 
  INITIAL_SYSTEM_ROLES, 
  INITIAL_SECURITY_SETTINGS, 
  INITIAL_SECURITY_AUDIT_LOGS, 
  INITIAL_PUBLIC_SITE_CONFIG, 
  INITIAL_SITE_PROFILES, 
  AVAILABLE_PERMISSIONS 
} from './initialGovernanceData';

export const AppContext = createContext();

const initialCourses = [
  {
    id: 'c1',
    title: 'Full-Stack Web Development Masterclass',
    category: 'Technology',
    instructor: 'Dr. Sarah Jenkins',
    instructorRole: 'Senior Lead Software Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    price: 499,
    rating: 4.9,
    enrolledCount: 1240,
    totalModules: 12,
    completedModules: 8,
    completionPercentage: 67,
    status: 'Published',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    description: 'Master React, Node.js, TypeScript, and modern Cloud DevOps architecture with real-world enterprise projects.',
    modules: [
      { id: 'm1', title: 'Module 1: Modern JavaScript & ES6+ Fundamentals', duration: '2.5 hrs', completed: true },
      { id: 'm2', title: 'Module 2: React State Architecture & Context API', duration: '3.8 hrs', completed: true },
      { id: 'm3', title: 'Module 3: Serverless Backend & RESTful APIs', duration: '4.2 hrs', completed: true },
      { id: 'm4', title: 'Module 4: Database Optimization & MongoDB Aggregations', duration: '5.0 hrs', completed: false }
    ]
  },
  {
    id: 'c2',
    title: 'AI & Data Science Engineering BootCamp',
    category: 'Data Science',
    instructor: 'Prof. Marcus Vance',
    instructorRole: 'AI Research Director',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    price: 699,
    rating: 4.85,
    enrolledCount: 980,
    totalModules: 16,
    completedModules: 4,
    completionPercentage: 25,
    status: 'Published',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80',
    description: 'Learn Neural Networks, Machine Learning pipelines, Python Data Analysis, and Generative AI prompt engineering.',
    modules: [
      { id: 'm21', title: 'Module 1: Python for Data Analysis & NumPy', duration: '4.0 hrs', completed: true },
      { id: 'm22', title: 'Module 2: Machine Learning Models & Scikit-Learn', duration: '6.5 hrs', completed: false },
      { id: 'm23', title: 'Module 3: Deep Learning with PyTorch', duration: '7.0 hrs', completed: false }
    ]
  },
  {
    id: 'c3',
    title: 'UX/UI Product Design System & Figma Pro',
    category: 'Design',
    instructor: 'Elena Rostova',
    instructorRole: 'Principal Product Designer',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    price: 349,
    rating: 4.92,
    enrolledCount: 850,
    totalModules: 8,
    completedModules: 8,
    completionPercentage: 100,
    status: 'Published',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80',
    description: 'Build responsive design systems, micro-interactions, mobile wireframes, and design tokens for scalable products.',
    modules: [
      { id: 'm31', title: 'Module 1: Design Tokens & Typography Scale', duration: '2.0 hrs', completed: true },
      { id: 'm32', title: 'Module 2: Figma Component Auto-Layouts', duration: '3.5 hrs', completed: true }
    ]
  },
  {
    id: 'c4',
    title: 'Strategic Cloud Operations & DevOps Security',
    category: 'Technology',
    instructor: 'David K. Miller',
    instructorRole: 'Cloud Infrastructure Lead',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    price: 549,
    rating: 4.78,
    enrolledCount: 620,
    totalModules: 10,
    completedModules: 0,
    completionPercentage: 0,
    status: 'Draft',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    description: 'Deploy Kubernetes clusters, automated CI/CD pipelines, Terraform infra, and Zero-Trust cloud security.',
    modules: [
      { id: 'm41', title: 'Module 1: Docker Containerization Architecture', duration: '3.0 hrs', completed: false }
    ]
  }
];

const initialStudents = [
  { id: 's1', name: 'Alex Rivera', email: 'alex.rivera@edu.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', batch: 'Batch 2026-A', course: 'Full-Stack Web Dev', attendance: '96%', status: 'Present', grade: 'A+' },
  { id: 's2', name: 'Sophia Chen', email: 'sophia.c@edu.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', batch: 'Batch 2026-A', course: 'AI & Data Science', attendance: '92%', status: 'Present', grade: 'A' },
  { id: 's3', name: 'Michael Brown', email: 'm.brown@edu.com', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', batch: 'Batch 2026-B', course: 'UX/UI Product Design', attendance: '84%', status: 'Late', grade: 'B+' },
  { id: 's4', name: 'Emily Davis', email: 'e.davis@edu.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', batch: 'Batch 2026-B', course: 'Full-Stack Web Dev', attendance: '78%', status: 'Absent', grade: 'B' },
  { id: 's5', name: 'Carlos Mendez', email: 'carlos.m@edu.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', batch: 'Batch 2026-A', course: 'Cloud Operations', attendance: '98%', status: 'Excused', grade: 'A+' }
];

const initialRoles = INITIAL_SYSTEM_ROLES;

const initialAdminTasks = [
  { id: 't1', title: 'Audit Fall Semester Attendance Logs', priority: 'High', completed: false },
  { id: 't2', title: 'Publish Cloud DevOps Module 4', priority: 'Medium', completed: true },
  { id: 't3', title: 'Review Instructor Submissions for Q3', priority: 'High', completed: false },
  { id: 't4', title: 'Generate Monthly Fiscal Financial Report', priority: 'Low', completed: false }
];

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('edu_view');
    return (saved && saved !== 'undefined' && saved !== 'null') ? saved : 'landing';
  });
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('erp_user');
      return (savedUser && savedUser !== 'undefined' && savedUser !== 'null') ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [userRole, setUserRole] = useState(() => user?.role || localStorage.getItem('edu_role') || 'SUPER_ADMIN');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('erp_auth_token'));
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_courses');
      return saved ? JSON.parse(saved) : initialCourses;
    } catch (e) {
      return initialCourses;
    }
  });
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_students');
      return saved ? JSON.parse(saved) : initialStudents;
    } catch (e) {
      return initialStudents;
    }
  });
  const [roles, setRoles] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_roles_governance_v5');
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length >= 20) ? parsed : INITIAL_SYSTEM_ROLES;
    } catch (e) {
      return INITIAL_SYSTEM_ROLES;
    }
  });
  const [securitySettings, setSecuritySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_security_settings');
      const parsed = saved ? JSON.parse(saved) : null;
      return (parsed && parsed.mfaEnforcement) ? parsed : INITIAL_SECURITY_SETTINGS;
    } catch (e) {
      return INITIAL_SECURITY_SETTINGS;
    }
  });
  const [securityAuditLogs, setSecurityAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_security_audit_logs');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_SECURITY_AUDIT_LOGS;
    } catch (e) {
      return INITIAL_SECURITY_AUDIT_LOGS;
    }
  });
  const [publicSiteConfig, setPublicSiteConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_public_site_config');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && parsed.hero) {
        if (parsed.stats?.campusesCount === '4 Campuses') {
          parsed.stats.campusesCount = '1 Main Campus';
        }
        if (!parsed.contactInfo?.campusName || parsed.contactInfo?.campusName === 'Campus One') {
          parsed.contactInfo = {
            ...parsed.contactInfo,
            campusName: 'The Education Space Academy (Main Campus)',
            address: 'The Education Space Academy, Main Campus, Pakistan'
          };
        }
        return parsed;
      }
      return INITIAL_PUBLIC_SITE_CONFIG;
    } catch (e) {
      return INITIAL_PUBLIC_SITE_CONFIG;
    }
  });
  const [siteProfiles, setSiteProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_site_profiles');
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_SITE_PROFILES;
    } catch (e) {
      return INITIAL_SITE_PROFILES;
    }
  });
  const [adminTasks, setAdminTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_tasks');
      return saved ? JSON.parse(saved) : initialAdminTasks;
    } catch (e) {
      return initialAdminTasks;
    }
  });

  const [selectedCourse, setSelectedCourse] = useState(initialCourses[0]);
  const [selectedEditCourse, setSelectedEditCourse] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    localStorage.setItem('edu_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('edu_roles_governance_v5', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('edu_security_settings', JSON.stringify(securitySettings));
  }, [securitySettings]);

  useEffect(() => {
    localStorage.setItem('edu_security_audit_logs', JSON.stringify(securityAuditLogs));
  }, [securityAuditLogs]);

  useEffect(() => {
    localStorage.setItem('edu_public_site_config', JSON.stringify(publicSiteConfig));
  }, [publicSiteConfig]);

  useEffect(() => {
    localStorage.setItem('edu_site_profiles_v3', JSON.stringify(siteProfiles));
  }, [siteProfiles]);

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
      localStorage.setItem('edu_role', user.role);
    }
  }, [user]);

  // Auth Handler Functions
  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await apiClient.post('/auth/login', { email, password });

      if (res.success && res.data) {
        const { accessToken, refreshToken, user: authUser } = res.data;
        localStorage.setItem('erp_auth_token', accessToken);
        localStorage.setItem('erp_refresh_token', refreshToken);
        localStorage.setItem('erp_user', JSON.stringify(authUser));

        setUser(authUser);
        setUserRole(authUser.role);
        setIsAuthenticated(true);
        setAuthLoading(false);

        const roleViewMap = {
          SUPER_ADMIN: 'admin-dashboard',
          INSTITUTION_ADMIN: 'admin-dashboard',
          CAMPUS_ADMIN: 'admin-dashboard',
          TEACHER: 'teacher-portal',
          STUDENT: 'student-portal',
          PARENT: 'parent-portal',
          ACCOUNTANT: 'fee-management'
        };
        const targetView = roleViewMap[authUser.role] || 'fee-management';
        addNotification(`Welcome back, ${authUser.fullName}! Logged in as ${authUser.role}.`, 'success');
        setCurrentView(targetView);
        return;
      }
    } catch (e) {
      console.warn('Backend API unavailable, activating demo mode...', e);
    }

    // Demo Mode fallback when backend API is offline
    const normalizedEmail = (email || '').trim().toLowerCase();
    const demoProfiles = {
      'admin@educationspace.edu': {
        id: 'u_admin_01',
        fullName: 'System Administrator',
        email: 'admin@educationspace.edu',
        role: 'SUPER_ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        defaultView: 'admin-dashboard'
      },
      'teacher@educationspace.edu': {
        id: 'u_teacher_01',
        fullName: 'Dr. Sarah Jenkins',
        email: 'teacher@educationspace.edu',
        role: 'TEACHER',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        defaultView: 'teacher-portal'
      },
      'accountant@educationspace.edu': {
        id: 'u_acct_01',
        fullName: 'Marcus Vance (Finance)',
        email: 'accountant@educationspace.edu',
        role: 'ACCOUNTANT',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        defaultView: 'fee-management'
      },
      'alex.rivera@edu.com': {
        id: 'u_student_01',
        fullName: 'Alex Rivera',
        email: 'alex.rivera@edu.com',
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        defaultView: 'student-portal'
      },
      'student@educationspace.edu': {
        id: 'u_student_02',
        fullName: 'Alex Rivera',
        email: 'student@educationspace.edu',
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        defaultView: 'student-portal'
      },
      'parent@educationspace.edu': {
        id: 'u_parent_01',
        fullName: 'Robert Rivera (Parent)',
        email: 'parent@educationspace.edu',
        role: 'PARENT',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        defaultView: 'parent-portal'
      }
    };

    const matchedProfile = demoProfiles[normalizedEmail] || {
      id: 'u_user_' + Date.now(),
      fullName: normalizedEmail ? normalizedEmail.split('@')[0].replace('.', ' ').toUpperCase() : 'Administrator',
      email: normalizedEmail || 'admin@educationspace.edu',
      role: normalizedEmail.includes('teacher') ? 'TEACHER' : normalizedEmail.includes('accountant') ? 'ACCOUNTANT' : normalizedEmail.includes('student') ? 'STUDENT' : normalizedEmail.includes('parent') ? 'PARENT' : 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      defaultView: normalizedEmail.includes('teacher') ? 'teacher-portal' : normalizedEmail.includes('student') ? 'student-portal' : normalizedEmail.includes('parent') ? 'parent-portal' : normalizedEmail.includes('accountant') ? 'fee-management' : 'admin-dashboard'
    };

    const mockToken = 'demo_jwt_token_' + Date.now();
    localStorage.setItem('erp_auth_token', mockToken);
    localStorage.setItem('erp_user', JSON.stringify(matchedProfile));
    setUser(matchedProfile);
    setUserRole(matchedProfile.role);
    setIsAuthenticated(true);
    setAuthLoading(false);

    addNotification(`Logged in as ${matchedProfile.fullName} (${matchedProfile.role})`, 'success');
    setCurrentView(matchedProfile.defaultView || 'admin-dashboard');
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('erp_auth_token');
    localStorage.removeItem('erp_refresh_token');
    localStorage.removeItem('erp_user');
    setUser(null);
    setIsAuthenticated(false);
    addNotification('Logged out successfully', 'info');
    setCurrentView('landing');
  };

  const handleQuickLogin = (email) => {
    handleLogin(email, 'Password@123');
  };

  const handleRegister = async ({ fullName, email, password, role = 'STUDENT' }) => {
    setAuthLoading(true);
    setAuthError(null);

    const normalizedRole = role.toUpperCase();
    const roleViewMap = {
      SUPER_ADMIN: 'admin-dashboard',
      INSTITUTION_ADMIN: 'admin-dashboard',
      CAMPUS_ADMIN: 'admin-dashboard',
      TEACHER: 'teacher-portal',
      STUDENT: 'student-portal',
      PARENT: 'parent-portal',
      ACCOUNTANT: 'fee-management'
    };
    const defaultView = roleViewMap[normalizedRole] || 'student-portal';

    try {
      const res = await apiClient.post('/auth/register', { 
        fullName, 
        email, 
        password, 
        role: normalizedRole 
      });

      if (res.success && res.data) {
        const { accessToken, refreshToken, user: authUser } = res.data;
        localStorage.setItem('erp_auth_token', accessToken);
        localStorage.setItem('erp_refresh_token', refreshToken);
        localStorage.setItem('erp_user', JSON.stringify(authUser));

        setUser(authUser);
        setUserRole(authUser.role);
        setIsAuthenticated(true);
        setAuthLoading(false);

        addNotification(`Account created! Welcome, ${authUser.fullName}.`, 'success');
        setCurrentView(defaultView);
        return { success: true };
      }
    } catch (e) {
      console.warn('Backend registration offline, activating instant registration session...', e);
    }

    // Client registration demo fallback
    const newUser = {
      id: 'u_' + Date.now(),
      fullName,
      email,
      role: normalizedRole,
      avatar: normalizedRole === 'TEACHER'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        : normalizedRole === 'PARENT'
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
        : normalizedRole === 'ACCOUNTANT'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      defaultView
    };

    const mockToken = 'demo_jwt_token_' + Date.now();
    localStorage.setItem('erp_auth_token', mockToken);
    localStorage.setItem('erp_user', JSON.stringify(newUser));
    setUser(newUser);
    setUserRole(newUser.role);
    setIsAuthenticated(true);
    setAuthLoading(false);

    if (normalizedRole === 'STUDENT') {
      setStudents(prev => [
        {
          id: newUser.id,
          name: newUser.fullName,
          email: newUser.email,
          avatar: newUser.avatar,
          batch: 'Batch 2026-A',
          course: 'Full-Stack Web Dev',
          attendance: '100%',
          status: 'Present',
          grade: 'A+'
        },
        ...prev
      ]);
    }

    addNotification(`Account successfully created for ${fullName}! Welcome to the Academy.`, 'success');
    setCurrentView(defaultView);
    return { success: true };
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const addCourse = (newCourse) => {
    setCourses(prev => [newCourse, ...prev]);
    addNotification(`Course "${newCourse.title}" successfully added!`, 'success');
  };

  const editCourse = (updatedCourse) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    addNotification(`Course "${updatedCourse.title}" updated successfully!`, 'success');
  };

  const deleteCourse = (courseId) => {
    const target = courses.find(c => c.id === courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
    addNotification(`Course "${target?.title || ''}" deleted`, 'info');
  };

  const duplicateCourse = (courseId) => {
    const target = courses.find(c => c.id === courseId);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `c_${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: 'Draft',
      enrolledCount: 0
    };
    setCourses(prev => [duplicated, ...prev]);
    addNotification(`Duplicated course "${target.title}"`, 'success');
  };

  const updateCourseStatus = (courseId, newStatus) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: newStatus } : c));
    addNotification(`Course status updated to ${newStatus}`, 'info');
  };

  const updateStudentAttendance = (studentId, status) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    addNotification(`Attendance for student updated to ${status}`, 'success');
  };

  const markAllAttendance = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
    addNotification(`All student statuses updated to ${status}`, 'info');
  };

  // Roles Management Methods (Add, Remove, Update, Reset)
  const addRole = (newRoleData) => {
    const formatted = {
      id: `r_${Date.now()}`,
      name: (newRoleData.name || 'CUSTOM_ROLE').toUpperCase().replace(/\s+/g, '_'),
      displayName: newRoleData.displayName || newRoleData.name,
      usersCount: 0,
      category: newRoleData.category || 'Custom',
      type: 'Custom',
      isProtected: false,
      description: newRoleData.description || 'Custom administrative or operational role.',
      permissions: newRoleData.permissions || {}
    };
    setRoles(prev => [...prev, formatted]);
    addSecurityAuditLog('CREATE_ROLE', `Created new role "${formatted.displayName}" (${formatted.name}).`);
    addNotification(`Role "${formatted.displayName}" successfully created!`, 'success');
  };

  const updateRole = (roleId, updatedData) => {
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, ...updatedData } : r));
    addSecurityAuditLog('UPDATE_ROLE', `Updated role metadata/permissions for role ID "${roleId}".`);
    addNotification('Role updated successfully', 'success');
  };

  const deleteRole = (roleId) => {
    const target = roles.find(r => r.id === roleId);
    if (!target) return;
    if (target.isProtected || target.name === 'SUPER_ADMIN') {
      addNotification('Cannot delete core protected system role', 'error');
      return;
    }
    setRoles(prev => prev.filter(r => r.id !== roleId));
    addSecurityAuditLog('DELETE_ROLE', `Deleted role "${target.name}".`);
    addNotification(`Role "${target.displayName || target.name}" removed successfully`, 'info');
  };

  const updateRolePermission = (roleId, permissionKey, value) => {
    setRoles(prev => prev.map(r => {
      if (r.id === roleId) {
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [permissionKey]: value
          }
        };
      }
      return r;
    }));
    addNotification(`Permission "${permissionKey}" updated for role`, 'info');
  };

  const batchUpdateRolePermissions = (roleId, permissionsMap) => {
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions: permissionsMap } : r));
    addSecurityAuditLog('BATCH_PERM_UPDATE', `Batch updated permissions for role ID "${roleId}".`);
    addNotification('Permissions batch updated successfully', 'success');
  };

  const resetRolesToDefault = () => {
    setRoles(INITIAL_SYSTEM_ROLES);
    addSecurityAuditLog('RESET_ROLES', 'Reset all system roles to factory defaults.');
    addNotification('All system roles reset to default configurations', 'info');
  };

  // Security Governance Methods
  const updateSecuritySettings = (newSettings) => {
    setSecuritySettings(prev => ({ ...prev, ...newSettings }));
    addSecurityAuditLog('POLICY_UPDATE', 'Updated global authentication and security policies.');
    addNotification('Security policies updated successfully!', 'success');
  };

  const addSecurityAuditLog = (action, details, category = 'Security') => {
    const newEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: user?.email || 'admin@educationspace.edu',
      action,
      category,
      details,
      status: 'SUCCESS',
      ip: '192.168.1.104'
    };
    setSecurityAuditLogs(prev => [newEntry, ...prev.slice(0, 99)]);
  };

  // Public Site Customizer Methods
  const updatePublicSiteConfig = (newConfig) => {
    setPublicSiteConfig(prev => ({ ...prev, ...newConfig }));
    addNotification('Public website changes saved and live!', 'success');
  };

  const resetPublicSiteConfig = () => {
    setPublicSiteConfig(INITIAL_PUBLIC_SITE_CONFIG);
    addNotification('Public site restored to standard layout', 'info');
  };

  // User & Site Profiles Management Methods
  const addProfile = (newProfile) => {
    const formatted = {
      id: `u_${Date.now()}`,
      status: 'Active',
      joinedDate: 'Sep 2026',
      avatar: newProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      ...newProfile
    };
    setSiteProfiles(prev => [formatted, ...prev]);
    addSecurityAuditLog('CREATE_PROFILE', `Created ${formatted.role} profile for ${formatted.fullName}.`, 'Profiles');
    addNotification(`Profile for ${formatted.fullName} created successfully`, 'success');
  };

  const updateProfile = (profileId, updatedData) => {
    setSiteProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updatedData } : p));
    addSecurityAuditLog('UPDATE_PROFILE', `Updated profile data for ID "${profileId}".`, 'Profiles');
    addNotification('User profile updated successfully', 'success');
  };

  const deleteProfile = (profileId) => {
    const target = siteProfiles.find(p => p.id === profileId);
    if (!target) return;
    if (target.email === user?.email || target.role === 'SUPER_ADMIN') {
      addNotification('Cannot delete primary Super Administrator profile', 'error');
      return;
    }
    setSiteProfiles(prev => prev.filter(p => p.id !== profileId));
    addSecurityAuditLog('DELETE_PROFILE', `Deleted profile for ${target.fullName} (${target.email}).`, 'Profiles');
    addNotification(`Profile for ${target.fullName} deleted`, 'info');
  };

  const impersonateProfile = (profileId) => {
    const target = siteProfiles.find(p => p.id === profileId);
    if (!target) return;
    setUser(target);
    setUserRole(target.role);
    setIsAuthenticated(true);
    localStorage.setItem('erp_auth_token', `demo_token_${target.role.toLowerCase()}`);
    localStorage.setItem('erp_user', JSON.stringify(target));
    localStorage.setItem('edu_role', target.role);
    const viewMap = {
      SUPER_ADMIN: 'admin-dashboard',
      INSTITUTION_ADMIN: 'admin-dashboard',
      CAMPUS_ADMIN: 'admin-dashboard',
      TEACHER: 'teacher-portal',
      STUDENT: 'student-portal',
      PARENT: 'parent-portal',
      ACCOUNTANT: 'fee-management'
    };
    const targetView = target.defaultView || viewMap[target.role] || 'student-portal';
    localStorage.setItem('edu_view', targetView);
    setCurrentView(targetView);
    addNotification(`Now previewing portal as ${target.fullName} (${target.role})`, 'success');
  };

  const switchToSuperAdmin = () => {
    const adminUser = (siteProfiles || []).find(p => p.role === 'SUPER_ADMIN') || {
      id: 'u_admin_01',
      fullName: 'System Administrator',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      roleCategory: 'Executive'
    };
    setUser(adminUser);
    setUserRole('SUPER_ADMIN');
    setIsAuthenticated(true);
    localStorage.setItem('erp_auth_token', 'demo_super_admin_jwt_2026');
    localStorage.setItem('erp_user', JSON.stringify(adminUser));
    localStorage.setItem('edu_role', 'SUPER_ADMIN');
    localStorage.setItem('edu_view', 'admin-dashboard');
    setCurrentView('admin-dashboard');
    addNotification('Switched back to Super Administrator Workspace', 'success');
  };

  const addAdminTask = (title, priority = 'Medium') => {
    const newTask = { id: `t_${Date.now()}`, title, priority, completed: false };
    setAdminTasks(prev => [newTask, ...prev]);
    addNotification(`Task "${title}" added to board`, 'success');
  };

  const toggleAdminTask = (taskId) => {
    setAdminTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const deleteAdminTask = (taskId) => {
    setAdminTasks(prev => prev.filter(t => t.id !== taskId));
    addNotification('Task removed from board', 'info');
  };

  const hasPermission = (module, action = 'read') => {
    if (!userRole || userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'SUPER_ADMIN') return true;
    if (!Array.isArray(roles)) return true;
    const currentRoleObj = roles.find(r => r && (r.name === userRole || r.displayName === userRole));
    if (!currentRoleObj || !currentRoleObj.permissions) return true;
    const modPerms = currentRoleObj.permissions[module];
    if (typeof modPerms === 'object' && modPerms !== null) {
      return !!modPerms[action];
    }
    const dotKey = `${module.toLowerCase()}.${action}`;
    if (typeof currentRoleObj.permissions[dotKey] !== 'undefined') {
      return !!currentRoleObj.permissions[dotKey];
    }
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        user,
        userRole,
        setUserRole,
        isAuthenticated,
        authLoading,
        authError,
        handleLogin,
        handleLogout,
        handleQuickLogin,
        handleRegister,
        courses,
        setCourses,
        students,
        setStudents,
        roles,
        setRoles,
        addRole,
        updateRole,
        deleteRole,
        updateRolePermission,
        batchUpdateRolePermissions,
        resetRolesToDefault,
        availablePermissions: AVAILABLE_PERMISSIONS,
        securitySettings,
        updateSecuritySettings,
        securityAuditLogs,
        addSecurityAuditLog,
        publicSiteConfig,
        updatePublicSiteConfig,
        resetPublicSiteConfig,
        siteProfiles,
        setSiteProfiles,
        addProfile,
        updateProfile,
        deleteProfile,
        impersonateProfile,
        switchToSuperAdmin,
        adminTasks,
        selectedCourse,
        setSelectedCourse,
        selectedEditCourse,
        setSelectedEditCourse,
        certificateData,
        setCertificateData,
        notifications,
        addNotification,
        selectedDate,
        setSelectedDate,
        isModalOpen,
        setIsModalOpen,
        modalType,
        setModalType,
        addCourse,
        editCourse,
        deleteCourse,
        duplicateCourse,
        updateCourseStatus,
        updateStudentAttendance,
        markAllAttendance,
        addAdminTask,
        toggleAdminTask,
        deleteAdminTask,
        hasPermission
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
