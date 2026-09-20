import { Request, Response, NextFunction } from 'express';
import { ContactCareersService } from './contactCareersService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class ContactCareersController {
  private service = new ContactCareersService();

  // Public Handlers
  public async submitContactMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await this.service.submitContactMessage(req.body);
      return res.status(200).json({ success: true, message: 'Contact message received successfully!', data: msg });
    } catch (err) { return next(err); }
  }

  public async getPublicVacancies(req: Request, res: Response, next: NextFunction) {
    try {
      const department = req.query.department as string;
      const vacancies = await this.service.getPublicVacancies(department);
      return res.status(200).json({ success: true, data: vacancies });
    } catch (err) { return next(err); }
  }

  public async getVacancyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vacancy = await this.service.getVacancyById(id);
      return res.status(200).json({ success: true, data: vacancy });
    } catch (err) { return next(err); }
  }

  public async submitJobApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // vacancyId
      const app = await this.service.submitJobApplication({ ...req.body, vacancyId: id });
      return res.status(201).json({ success: true, message: 'Job application submitted successfully!', data: app });
    } catch (err) { return next(err); }
  }

  // Admin Contact Inbox Handlers
  public async listContactMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const messages = await this.service.listContactMessages(status);
      return res.status(200).json({ success: true, data: messages });
    } catch (err) { return next(err); }
  }

  public async updateContactStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.updateContactStatus(id, status, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async replyContactMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { replyMessage } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.replyContactMessage(id, replyMessage, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  // Admin Careers Management Handlers
  public async listAdminVacancies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const department = req.query.department as string;
      const vacancies = await this.service.listAdminVacancies(status, department);
      return res.status(200).json({ success: true, data: vacancies });
    } catch (err) { return next(err); }
  }

  public async createVacancy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const vacancy = await this.service.createVacancy(req.body, userId);
      return res.status(201).json({ success: true, data: vacancy });
    } catch (err) { return next(err); }
  }

  public async updateVacancyStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.updateVacancyStatus(id, status, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async listJobApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const vacancyId = req.query.vacancyId as string;
      const apps = await this.service.listJobApplications(vacancyId);
      return res.status(200).json({ success: true, data: apps });
    } catch (err) { return next(err); }
  }

  public async updateApplicationStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.updateApplicationStatus(id, status, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  // Protected CV Download File Endpoint
  public async downloadProtectedCv(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // applicationId
      const userId = req.user?.userId;
      const cvData = await this.service.getProtectedCvFile(id, userId);
      return res.status(200).json({ success: true, data: cvData });
    } catch (err) { return next(err); }
  }
}
