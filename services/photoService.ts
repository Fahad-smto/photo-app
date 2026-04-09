import { imgbbService } from '@/lib/imgbb';
import { Photo, UploadResult } from '@/lib/types';
import { photoModel } from '@/model/Photo';

export class PhotoService {
  async uploadPhoto(file: File): Promise<UploadResult> {
    try {
      // Validate file
      if (!file) {
        return { success: false, error: 'No file provided' };
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed' };
      }

      // Check file size (max 16MB for ImgBB free tier)
      const maxSize = 16 * 1024 * 1024; // 16MB
      if (file.size > maxSize) {
        return { success: false, error: 'File too large. Maximum size is 16MB' };
      }

      // Upload to ImgBB
      const photo = await imgbbService.uploadImage(file, file.name);
      
      // Save to database (in-memory for now)
      photoModel.save(photo);
      
      return { success: true, photo };
    } catch (error) {
      console.error('Upload service error:', error);
      return { success: false, error: 'Failed to upload photo' };
    }
  }

  async getAllPhotos(): Promise<Photo[]> {
    return photoModel.findAll();
  }

  async getPhotoById(id: string): Promise<Photo | null> {
    const photo = photoModel.findById(id);
    if (photo) {
      photoModel.incrementViews(id);
      return photo;
    }
    return null;
  }

  async deletePhoto(id: string): Promise<boolean> {
    const photo = photoModel.findById(id);
    if (photo) {
      // Delete from ImgBB
      await imgbbService.deleteImage(photo.delete_url);
      // Delete from database
      return photoModel.delete(id);
    }
    return false;
  }

  async toggleLike(id: string): Promise<Photo | null> {
    const photo = photoModel.findById(id);
    if (photo) {
      // In a real app, you'd track user-specific likes
      // For now, just toggle
      const updatedPhoto = photoModel.updateLikes(id, true);
      return updatedPhoto || null;
    }
    return null;
  }
}

export const photoService = new PhotoService();