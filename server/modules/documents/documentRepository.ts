import { db } from '../../core/database/db.js';
import { ForbiddenError, NotFoundError, BadRequestError } from '../../core/errors/AppError.js';
import { env } from '../../config/env.js';

export interface DocumentRecord {
  id: string;
  targetId: string; // studentId or staffId
  targetType: 'STUDENT' | 'STAFF';
  title: string;
  category: string; // ADMISSION, IDENTIFICATION, ACADEMIC, CERTIFICATE, EMPLOYMENT, QUALIFICATIONS, OTHER
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  securityLevel: 'PUBLIC' | 'PRIVATE';
  uploadedAt: string;
}

export interface CertificateTemplate {
  id: string;
  title: string;
  description: string;
  category: 'ACADEMIC' | 'SPORTS' | 'MERIT' | 'STAFF';
}

export interface IssuedCertificate {
  serialNumber: string; // e.g. CERT-2026-90001
  templateId: string;
  templateTitle: string;
  recipientId: string; // studentId or staffId
  recipientName: string;
  recipientRole: 'STUDENT' | 'STAFF';
  title: string;
  issuedDate: string;
  expiryDate?: string;
  status: 'ISSUED' | 'REVOKED' | 'EXPIRED';
  revocationReason?: string;
  qrVerificationUrl: string;
}

let serialCounter = 90001;

let memoryDocuments: DocumentRecord[] = [
  {
    id: 'doc-101',
    targetId: 'st-1001',
    targetType: 'STUDENT',
    title: 'High School Transcript 2025',
    category: 'ACADEMIC',
    fileUrl: '/files/transcripts/st-1001.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 1048576,
    securityLevel: 'PRIVATE',
    uploadedAt: '2026-08-10T10:00:00.000Z'
  },
  {
    id: 'doc-102',
    targetId: 'teacher-101',
    targetType: 'STAFF',
    title: 'Ph.D. Physics Degree Certificate',
    category: 'QUALIFICATIONS',
    fileUrl: '/files/staff/degree-101.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 2097152,
    securityLevel: 'PRIVATE',
    uploadedAt: '2026-08-12T14:00:00.000Z'
  }
];

let memoryCertificateTemplates: CertificateTemplate[] = [
  { id: 'tpl-merit', title: 'Certificate of Academic Merit & Excellence', description: 'Awarded to top ranking academic achievers', category: 'MERIT' },
  { id: 'tpl-sports', title: 'Sports Day Champion Award', description: 'Awarded for institution sports competition excellence', category: 'SPORTS' },
  { id: 'tpl-staff', title: 'Staff Service Appreciation Certificate', description: 'Recognizing outstanding faculty contributions', category: 'STAFF' }
];

let memoryCertificates: Map<string, IssuedCertificate> = new Map([
  ['CERT-2026-90001', {
    serialNumber: 'CERT-2026-90001',
    templateId: 'tpl-merit',
    templateTitle: 'Certificate of Academic Merit & Excellence',
    recipientId: 'st-1001',
    recipientName: 'Zainab Ahmed',
    recipientRole: 'STUDENT',
    title: 'First Place - Annual Physics Olympiad 2026',
    issuedDate: '2026-08-15',
    status: 'ISSUED',
    qrVerificationUrl: `${env.PUBLIC_URL || env.CLIENT_ORIGIN || 'http://localhost:5173'}/verify/cert/CERT-2026-90001`
  }]
]);

export class DocumentRepository {
  // Student Documents
  public async getStudentDocuments(studentId: string): Promise<DocumentRecord[]> {
    return memoryDocuments.filter(d => d.targetId === studentId && d.targetType === 'STUDENT');
  }

  public async uploadStudentDocument(payload: Omit<DocumentRecord, 'id' | 'uploadedAt' | 'targetType'>): Promise<DocumentRecord> {
    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      targetType: 'STUDENT',
      ...payload,
      uploadedAt: new Date().toISOString()
    };
    memoryDocuments.unshift(newDoc);
    return newDoc;
  }

  // Staff Documents
  public async getStaffDocuments(staffId: string): Promise<DocumentRecord[]> {
    return memoryDocuments.filter(d => d.targetId === staffId && d.targetType === 'STAFF');
  }

  public async uploadStaffDocument(payload: Omit<DocumentRecord, 'id' | 'uploadedAt' | 'targetType'>): Promise<DocumentRecord> {
    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      targetType: 'STAFF',
      ...payload,
      uploadedAt: new Date().toISOString()
    };
    memoryDocuments.unshift(newDoc);
    return newDoc;
  }

  // Get Document By ID
  public async getDocumentById(documentId: string): Promise<DocumentRecord | null> {
    return memoryDocuments.find(d => d.id === documentId) || null;
  }

  // Certificate Templates
  public async getCertificateTemplates(): Promise<CertificateTemplate[]> {
    return memoryCertificateTemplates;
  }

  // Get All Certificates
  public async getCertificates(): Promise<IssuedCertificate[]> {
    return Array.from(memoryCertificates.values());
  }

  // Issue Certificate with Auto Serial Numbering
  public async issueCertificate(payload: {
    templateId: string;
    recipientId: string;
    recipientName: string;
    recipientRole: 'STUDENT' | 'STAFF';
    title: string;
    issuedDate: string;
  }): Promise<IssuedCertificate> {
    const serialNumber = `CERT-2026-${serialCounter++}`;
    const template = memoryCertificateTemplates.find(t => t.id === payload.templateId);

    const cert: IssuedCertificate = {
      serialNumber,
      templateId: payload.templateId,
      templateTitle: template ? template.title : 'Official Institutional Certificate',
      recipientId: payload.recipientId,
      recipientName: payload.recipientName,
      recipientRole: payload.recipientRole,
      title: payload.title,
      issuedDate: payload.issuedDate || new Date().toISOString().split('T')[0],
      status: 'ISSUED',
      qrVerificationUrl: `${env.PUBLIC_URL || env.CLIENT_ORIGIN || 'http://localhost:5173'}/verify/cert/${serialNumber}`
    };

    memoryCertificates.set(serialNumber, cert);
    return cert;
  }

  // Revoke Certificate
  public async revokeCertificate(serialNumber: string, reason: string): Promise<IssuedCertificate> {
    const cert = memoryCertificates.get(serialNumber);
    if (!cert) throw new NotFoundError(`Certificate with serial number '${serialNumber}' not found.`);

    cert.status = 'REVOKED';
    cert.revocationReason = reason || 'Revoked by institution administration.';
    memoryCertificates.set(serialNumber, cert);
    return cert;
  }

  // Public QR Verification
  public async verifyCertificatePublic(serialNumber: string) {
    const cert = memoryCertificates.get(serialNumber);
    if (!cert) {
      return {
        isValid: false,
        serialNumber,
        verificationStatus: 'INVALID_SERIAL_NUMBER',
        message: 'No institutional certificate matching this serial number exists in official registry.'
      };
    }

    return {
      isValid: cert.status === 'ISSUED',
      serialNumber: cert.serialNumber,
      verificationStatus: cert.status,
      recipientName: cert.recipientName,
      title: cert.title,
      templateTitle: cert.templateTitle,
      issuedDate: cert.issuedDate,
      revocationReason: cert.revocationReason || null,
      authenticitySignature: `DIGITAL_SIG_${cert.serialNumber}_VALIDATED`
    };
  }
}
