import { DocumentRepository, DocumentRecord } from './documentRepository.js';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '../../core/errors/AppError.js';

export class DocumentService {
  private repo = new DocumentRepository();

  public async getStudentDocuments(studentId: string) {
    return await this.repo.getStudentDocuments(studentId);
  }

  public async uploadStudentDocument(payload: Omit<DocumentRecord, 'id' | 'uploadedAt' | 'targetType'>) {
    return await this.repo.uploadStudentDocument(payload);
  }

  public async getStaffDocuments(staffId: string) {
    return await this.repo.getStaffDocuments(staffId);
  }

  public async uploadStaffDocument(payload: Omit<DocumentRecord, 'id' | 'uploadedAt' | 'targetType'>) {
    return await this.repo.uploadStaffDocument(payload);
  }

  // Private Document File Download Security Validation
  public async downloadPrivateDocument(documentId: string, user?: { userId: string; role: string; permissions?: string[] }) {
    if (!user) {
      throw new UnauthorizedError("Authentication token is required to access private documents.");
    }

    const doc = await this.repo.getDocumentById(documentId);
    if (!doc) {
      throw new NotFoundError(`Document with ID '${documentId}' not found.`);
    }

    // Check authorization: Admin, Document Owner, or permissions
    const isOwner = user.userId === doc.targetId;
    const isAdmin = ['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN'].includes(user.role);
    const hasPerm = user.permissions?.includes('documents.read');

    if (!isOwner && !isAdmin && !hasPerm) {
      throw new ForbiddenError("Access denied. You do not have permission to download this private document.");
    }

    return doc;
  }

  public async getCertificateTemplates() {
    return await this.repo.getCertificateTemplates();
  }

  public async getCertificates() {
    return await this.repo.getCertificates();
  }

  public async issueCertificate(payload: any) {
    return await this.repo.issueCertificate(payload);
  }

  public async revokeCertificate(serialNumber: string, reason: string) {
    return await this.repo.revokeCertificate(serialNumber, reason);
  }

  public async verifyCertificatePublic(serialNumber: string) {
    return await this.repo.verifyCertificatePublic(serialNumber);
  }
}
