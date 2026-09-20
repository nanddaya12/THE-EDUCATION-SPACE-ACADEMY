import { Request, Response, NextFunction } from 'express';
import { GalleryService } from './galleryService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class GalleryController {
  private service = new GalleryService();

  // Public Endpoints
  public async getPublicAlbums(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const albums = await this.service.getPublicAlbums(category);
      return res.status(200).json({ success: true, data: albums });
    } catch (err) { return next(err); }
  }

  public async getAlbumBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const album = await this.service.getAlbumBySlug(slug);
      return res.status(200).json({ success: true, data: album });
    } catch (err) { return next(err); }
  }

  public async getAlbumPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const photos = await this.service.getAlbumPhotos(id);
      return res.status(200).json({ success: true, data: photos });
    } catch (err) { return next(err); }
  }

  // Admin CMS Endpoints
  public async listAdminAlbums(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const category = req.query.category as string;
      const items = await this.service.listAdminAlbums(status, category);
      return res.status(200).json({ success: true, data: items });
    } catch (err) { return next(err); }
  }

  public async createAlbum(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const album = await this.service.createAlbum({ ...req.body, userId });
      return res.status(201).json({ success: true, data: album });
    } catch (err) { return next(err); }
  }

  public async addPhotosToAlbum(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { photos } = req.body;
      const userId = req.user?.userId;
      const result = await this.service.addPhotosToAlbum(id, photos, userId);
      return res.status(201).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  public async reorderAlbumPhotos(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { photoOrders } = req.body;
      const userId = req.user?.userId;
      const photos = await this.service.reorderAlbumPhotos(id, photoOrders, userId);
      return res.status(200).json({ success: true, data: photos });
    } catch (err) { return next(err); }
  }

  public async updatePhotoCaption(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { photoId } = req.params;
      const userId = req.user?.userId;
      const updated = await this.service.updatePhotoCaption(photoId, req.body, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async deletePhoto(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { photoId } = req.params;
      const userId = req.user?.userId;
      const result = await this.service.deletePhoto(photoId, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  public async updateAlbumStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.updateAlbumStatus(id, status, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async deleteAlbum(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.service.deleteAlbum(id, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }
}
