import { Photo } from "@/lib/types";

 

// In-memory storage (replace with database in production)
class PhotoModel {
  private photos: Map<string, Photo> = new Map();

  save(photo: Photo): Photo {
    this.photos.set(photo.id, photo);
    return photo;
  }

  findById(id: string): Photo | undefined {
    return this.photos.get(id);
  }

  findAll(): Photo[] {
    return Array.from(this.photos.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  delete(id: string): boolean {
    return this.photos.delete(id);
  }

  updateLikes(id: string, increment: boolean): Photo | undefined {
    const photo = this.photos.get(id);
    if (photo) {
      photo.likes += increment ? 1 : -1;
      this.photos.set(id, photo);
      return photo;
    }
    return undefined;
  }

  incrementViews(id: string): void {
    const photo = this.photos.get(id);
    if (photo) {
      photo.views += 1;
      this.photos.set(id, photo);
    }
  }
}

export const photoModel = new PhotoModel();