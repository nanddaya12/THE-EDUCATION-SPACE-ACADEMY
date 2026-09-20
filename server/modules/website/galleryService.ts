import { GalleryRepository } from './galleryRepository.js';

export class GalleryService {
  private repo = new GalleryRepository();

  public async getPublicAlbums(category?: string) {
    return await this.repo.getPublicAlbums(category);
  }

  public async getAlbumBySlug(slug: string) {
    return await this.repo.getAlbumBySlug(slug);
  }

  public async getAlbumPhotos(albumId: string) {
    return await this.repo.getAlbumPhotos(albumId);
  }

  public async listAdminAlbums(status?: string, category?: string) {
    return await this.repo.listAdminAlbums(status, category);
  }

  public async createAlbum(data: any) {
    return await this.repo.createAlbum(data);
  }

  public async addPhotosToAlbum(albumId: string, photos: any[], userId?: string) {
    return await this.repo.addPhotosToAlbum(albumId, photos, userId);
  }

  public async reorderAlbumPhotos(albumId: string, photoOrders: any[], userId?: string) {
    return await this.repo.reorderAlbumPhotos(albumId, photoOrders, userId);
  }

  public async updatePhotoCaption(photoId: string, data: any, userId?: string) {
    return await this.repo.updatePhotoCaption(photoId, data, userId);
  }

  public async deletePhoto(photoId: string, userId?: string) {
    return await this.repo.deletePhoto(photoId, userId);
  }

  public async updateAlbumStatus(id: string, status: any, userId?: string) {
    return await this.repo.updateAlbumStatus(id, status, userId);
  }

  public async deleteAlbum(id: string, userId?: string) {
    return await this.repo.deleteAlbum(id, userId);
  }
}
