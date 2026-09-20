import { Request, Response, NextFunction } from 'express';
import { AdmissionsService } from './service.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export class PublicAdmissionsController {
  private service = new AdmissionsService();

  public async submitPublicApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicantName, email, phone, gender, guardianName, guardianPhone, campusId } = req.body;

      if (!applicantName || (!email && !phone)) {
        throw new BadRequestError('Applicant name and email or phone are required');
      }

      const application = await this.service.createApplication({
        applicantName,
        email,
        phone,
        gender: gender || 'Male',
        guardianName,
        guardianPhone,
        campusId
      });

      return res.status(201).json({
        success: true,
        data: {
          applicationNo: application.applicationNo,
          applicantName: application.applicantName,
          status: application.status,
          createdAt: application.createdAt
        }
      });
    } catch (err) {
      return next(err);
    }
  }

  public async trackApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationNo, verificationKey } = req.body; // verificationKey can be email or phone

      if (!applicationNo || !verificationKey) {
        throw new BadRequestError('Application number and email or phone verification key are required');
      }

      const resList = await this.service.getApplications({ search: applicationNo, limit: 1 });
      const app = resList.applications[0];

      if (!app || (app.email !== verificationKey && app.phone !== verificationKey)) {
        throw new BadRequestError('No matching application found with provided details');
      }

      // PII Masking Helper
      const maskName = (name: string) => {
        const parts = name.split(' ');
        return parts.map(p => p.charAt(0) + '***').join(' ');
      };

      return res.status(200).json({
        success: true,
        data: {
          applicationNo: app.applicationNo,
          maskedApplicantName: maskName(app.applicantName),
          status: app.status,
          documentVerified: app.documentVerified,
          testScore: app.testScore || null,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt
        }
      });
    } catch (err) {
      return next(err);
    }
  }
}
