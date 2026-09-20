import { Request, Response, NextFunction } from 'express';
import { WebsiteService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class WebsiteController {
  private service = new WebsiteService();

  public async getHome(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getHomePage(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getAbout(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getAbout(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getPrincipalMessage(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getPrincipalMessage(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getAcademics(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getAcademics(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getPrograms(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getPrograms(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getClasses(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getClasses(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getFacultyStaff(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getFacultyStaff(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getAdmissionsInfo(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getAdmissionsInfo(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getFeeStructure(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getFeeStructure(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getNews(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getNews(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getAnnouncements(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getAnnouncements(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getEvents(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getEvents(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getGallery(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getGallery(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getDownloads(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getDownloads(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getFaqs(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getFaqs(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getCareers(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getCareers(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async getContactInfo(req: Request, res: Response, next: NextFunction) {
    try { const data = await this.service.getContactInfo(); return res.status(200).json({ success: true, data }); }
    catch (err) { return next(err); }
  }

  public async submitContact(req: Request, res: Response, next: NextFunction) {
    try { const result = await this.service.submitContactForm(req.body); return res.status(200).json({ success: true, data: result }); }
    catch (err) { return next(err); }
  }

  public async submitOnlineApplication(req: Request, res: Response, next: NextFunction) {
    try { const result = await this.service.submitOnlineApplication(req.body); return res.status(201).json({ success: true, data: result }); }
    catch (err) { return next(err); }
  }

  // Admin Panel CMS Controller Methods
  public async listAdminContent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const moduleName = req.query.module as string;
      const status = req.query.status as string;
      const items = await this.service.listAdminContent(moduleName, status);
      return res.status(200).json({ success: true, data: items });
    } catch (err) { return next(err); }
  }

  public async createAdminContent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await this.service.createAdminContent(req.body);
      return res.status(201).json({ success: true, data: item });
    } catch (err) { return next(err); }
  }

  public async updateAdminContentStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await this.service.updateAdminContentStatus(id, status);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async listContactMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const msgs = await this.service.listContactMessages();
      return res.status(200).json({ success: true, data: msgs });
    } catch (err) { return next(err); }
  }

  public async updateWebsiteSettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const settings = await this.service.updateWebsiteSettings(req.body);
      return res.status(200).json({ success: true, data: settings });
    } catch (err) { return next(err); }
  }
}
