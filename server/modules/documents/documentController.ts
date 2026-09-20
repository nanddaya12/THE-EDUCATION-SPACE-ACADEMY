import { Request, Response, NextFunction } from 'express';
import { DocumentService } from './documentService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class DocumentController {
  private service = new DocumentService();

  public async getStudentDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getStudentDocuments(req.params.studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async uploadStudentDocument(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.uploadStudentDocument({
        ...req.body,
        targetId: req.params.studentId
      });
      return res.status(201).json({ success: true, message: 'Student document uploaded successfully!', data });
    } catch (err) { return next(err); }
  }

  public async getStaffDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getStaffDocuments(req.params.staffId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async uploadStaffDocument(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.uploadStaffDocument({
        ...req.body,
        targetId: req.params.staffId
      });
      return res.status(201).json({ success: true, message: 'Staff document uploaded successfully!', data });
    } catch (err) { return next(err); }
  }

  public async downloadPrivateDocument(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const doc = await this.service.downloadPrivateDocument(req.params.documentId, req.user);
      return res.status(200).json({
        success: true,
        message: 'Private document access authorized.',
        data: {
          fileUrl: doc.fileUrl,
          title: doc.title,
          mimeType: doc.mimeType
        }
      });
    } catch (err) { return next(err); }
  }

  public async getCertificateTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getCertificateTemplates();
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getCertificates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getCertificates();
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async issueCertificate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.issueCertificate(req.body);
      return res.status(201).json({ success: true, message: 'Certificate issued successfully!', data });
    } catch (err) { return next(err); }
  }

  public async revokeCertificate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.revokeCertificate(req.params.serialNumber, req.body.reason);
      return res.status(200).json({ success: true, message: 'Certificate revoked!', data });
    } catch (err) { return next(err); }
  }

  public async verifyCertificatePublic(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.verifyCertificatePublic(req.params.serialNumber);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }
}
