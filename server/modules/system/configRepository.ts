import { logAuditEvent } from '../../core/audit/auditLogger.js';

export interface SystemConfigStore {
  general: {
    environment: 'production' | 'staging' | 'development';
    maintenanceMode: boolean;
    logLevel: 'info' | 'warn' | 'error' | 'debug';
    defaultPaginationLimit: number;
  };
  institution: {
    institutionName: string;
    registrationCode: string;
    accreditationBody: string;
    founderMessage: string;
  };
  campuses: {
    mainCampusCapacity: number;
    southCampusCapacity: number;
    activeStatus: boolean;
  };
  academic: {
    currentAcademicSession: string;
    termStructure: string;
    classCreditHours: number;
  };
  attendance: {
    minimumRequiredAttendance: number; // e.g. 75
    lateCutoffTime: string; // e.g. "08:15"
    automatedAbsentNotification: boolean;
  };
  fees: {
    currency: string; // e.g. "PKR"
    currencySymbol: string; // e.g. "Rs."
    gracePeriodDays: number; // e.g. 10
    lateFeePenaltyRate: number; // e.g. 5.0
    onlineProcessingFeePolicy: string;
  };
  examinations: {
    gradingScaleScheme: string; // e.g. "LETTER_GRADE_SCALE"
    passingPercentageThreshold: number; // e.g. 40
    gpaCalculationAlgorithm: string; // e.g. "4.0_SCALE"
  };
  notifications: {
    inAppDeliveryTriggers: boolean;
    smsAlertToggles: boolean;
    emailNotificationPreferences: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    senderName: string;
    senderEmail: string;
    smtpPasswordSecret: string; // Real secret stored on server
  };
  sms: {
    gatewayProvider: string;
    apiSenderId: string;
    apiKeySecret: string; // Real secret stored on server
  };
  branding: {
    primaryColorHex: string;
    headerLogoUrl: string;
    faviconUrl: string;
    websiteTitle: string;
  };
  documents: {
    maxUploadSizeMb: number;
    allowedExtensions: string[];
    protectedCvAccessPolicy: string;
  };
  reports: {
    defaultExportFormat: 'PDF' | 'EXCEL' | 'CSV' | 'PRINT';
    watermarkEnabled: boolean;
    printLogoHeaderUrl: string;
  };
  security: {
    passwordMinLength: number;
    sessionTimeoutMinutes: number;
    requireTwoFactorAuth: boolean;
    ipWhitelist: string;
  };
  localization: {
    timezone: string;
    dateFormat: string;
    primaryLanguage: string;
    currencySymbol: string;
  };
}

let realSystemConfig: SystemConfigStore = {
  general: {
    environment: 'production',
    maintenanceMode: false,
    logLevel: 'info',
    defaultPaginationLimit: 20
  },
  institution: {
    institutionName: 'The Education Space Academy',
    registrationCode: 'REG-EDU-2026-ISB',
    accreditationBody: 'Cambridge International & Higher Education Commission',
    founderMessage: 'Dedicated to cultivating world-class scholars, ethical leaders, and AI innovators.'
  },
  campuses: {
    mainCampusCapacity: 1800,
    southCampusCapacity: 1200,
    activeStatus: true
  },
  academic: {
    currentAcademicSession: '2026-2027',
    termStructure: 'Trimester (Fall, Spring, Summer)',
    classCreditHours: 4
  },
  attendance: {
    minimumRequiredAttendance: 75,
    lateCutoffTime: '08:15 AM',
    automatedAbsentNotification: true
  },
  fees: {
    currency: 'PKR',
    currencySymbol: 'PKR ',
    gracePeriodDays: 10,
    lateFeePenaltyRate: 5.0,
    onlineProcessingFeePolicy: 'Academy Absorbs Gateway Fees'
  },
  examinations: {
    gradingScaleScheme: 'LETTER_GRADE_SCALE (A+, A, B, C, D, F)',
    passingPercentageThreshold: 40,
    gpaCalculationAlgorithm: '4.0_SCALE'
  },
  notifications: {
    inAppDeliveryTriggers: true,
    smsAlertToggles: true,
    emailNotificationPreferences: true
  },
  email: {
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    senderName: 'The Education Space Academy Admissions',
    senderEmail: 'admissions@educationspace.edu',
    smtpPasswordSecret: 'SG.real_secret_smtp_key_9988776655'
  },
  sms: {
    gatewayProvider: 'Twilio Local Telco Gateway',
    apiSenderId: 'EDU-SPACE',
    apiKeySecret: 'SK_twilio_real_api_key_44332211'
  },
  branding: {
    primaryColorHex: '#0284c7',
    headerLogoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300',
    faviconUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=64',
    websiteTitle: 'The Education Space Academy | Official Portal'
  },
  documents: {
    maxUploadSizeMb: 15,
    allowedExtensions: ['.pdf', '.docx', '.xlsx', '.zip'],
    protectedCvAccessPolicy: 'PERMISSION_GUARDED_WEBSITE_MANAGE'
  },
  reports: {
    defaultExportFormat: 'PDF',
    watermarkEnabled: true,
    printLogoHeaderUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300'
  },
  security: {
    passwordMinLength: 8,
    sessionTimeoutMinutes: 60,
    requireTwoFactorAuth: false,
    ipWhitelist: '127.0.0.1, 192.168.1.0/24'
  },
  localization: {
    timezone: 'Asia/Karachi',
    dateFormat: 'YYYY-MM-DD',
    primaryLanguage: 'en-US',
    currencySymbol: 'PKR '
  }
};

const SECRET_MASK = '••••••••••••';

export class ConfigRepository {
  // Helper: Returns Safe Configuration Payload with Masked Secrets
  public getAdminConfig(): SystemConfigStore {
    const cloned = JSON.parse(JSON.stringify(realSystemConfig));
    cloned.email.smtpPasswordSecret = SECRET_MASK;
    cloned.sms.apiKeySecret = SECRET_MASK;
    return cloned;
  }

  // Helper: Updates Configuration Preserving Real Secrets if Masked String is Submitted
  public async updateAdminConfig(data: Partial<SystemConfigStore>, req?: any) {
    if (data.general) realSystemConfig.general = { ...realSystemConfig.general, ...data.general };
    if (data.institution) realSystemConfig.institution = { ...realSystemConfig.institution, ...data.institution };
    if (data.campuses) realSystemConfig.campuses = { ...realSystemConfig.campuses, ...data.campuses };
    if (data.academic) realSystemConfig.academic = { ...realSystemConfig.academic, ...data.academic };
    if (data.attendance) realSystemConfig.attendance = { ...realSystemConfig.attendance, ...data.attendance };
    if (data.fees) realSystemConfig.fees = { ...realSystemConfig.fees, ...data.fees };
    if (data.examinations) realSystemConfig.examinations = { ...realSystemConfig.examinations, ...data.examinations };
    if (data.notifications) realSystemConfig.notifications = { ...realSystemConfig.notifications, ...data.notifications };
    
    if (data.email) {
      const newPwd = data.email.smtpPasswordSecret;
      const pwdToStore = (!newPwd || newPwd === SECRET_MASK) ? realSystemConfig.email.smtpPasswordSecret : newPwd;
      realSystemConfig.email = { ...realSystemConfig.email, ...data.email, smtpPasswordSecret: pwdToStore };
    }

    if (data.sms) {
      const newKey = data.sms.apiKeySecret;
      const keyToStore = (!newKey || newKey === SECRET_MASK) ? realSystemConfig.sms.apiKeySecret : newKey;
      realSystemConfig.sms = { ...realSystemConfig.sms, ...data.sms, apiKeySecret: keyToStore };
    }

    if (data.branding) realSystemConfig.branding = { ...realSystemConfig.branding, ...data.branding };
    if (data.documents) realSystemConfig.documents = { ...realSystemConfig.documents, ...data.documents };
    if (data.reports) realSystemConfig.reports = { ...realSystemConfig.reports, ...data.reports };
    if (data.security) realSystemConfig.security = { ...realSystemConfig.security, ...data.security };
    if (data.localization) realSystemConfig.localization = { ...realSystemConfig.localization, ...data.localization };

    // Audit Logging
    if (req) {
      await logAuditEvent(req, {
        action: 'UPDATE_SYSTEM_CONFIG',
        module: 'SYSTEM',
        resource: 'SystemConfig',
        resourceId: 'global-config',
        details: 'Updated global system configuration settings across 15 sections'
      });
    }

    return this.getAdminConfig();
  }
}
