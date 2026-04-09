import axios from 'axios';
import FormData from 'form-data';
import { ImgBBResponse, Photo } from './types';

export class ImgBBService {
  private apiKey: string;
  private apiUrl = 'https://api.imgbb.com/1/upload';

  constructor() {
    this.apiKey = process.env.IMGBB_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('IMGBB_API_KEY is not defined in environment variables');
    }
  }

  async uploadImage(file: File | Buffer, filename?: string): Promise<Photo> {
    try {
      const formData = new FormData();
      
      // Convert File to buffer if needed
      let imageData: Buffer | string;
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        imageData = Buffer.from(bytes);
      } else {
        imageData = file;
      }
      
      // Convert to base64
      const base64Image = imageData.toString('base64');
      
      formData.append('key', this.apiKey);
      formData.append('image', base64Image);
      if (filename) {
        formData.append('name', filename);
      }

      const response = await axios.post<ImgBBResponse>(this.apiUrl, formData, {
        headers: formData.getHeaders(),
      });

      if (response.data.success) {
        const imgData = response.data.data;
        return {
          id: imgData.id,
          url: imgData.url,
          display_url: imgData.display_url,
          delete_url: imgData.delete_url,
          title: imgData.title || filename || 'Untitled',
          filename: imgData.image.filename,
          size: imgData.size,
          uploadedAt: new Date().toISOString(),
          views: 0,
          likes: 0,
        };
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw new Error('Failed to upload image to ImgBB');
    }
  }

  async deleteImage(deleteUrl: string): Promise<boolean> {
    try {
      await axios.get(deleteUrl);
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }
}

export const imgbbService = new ImgBBService();