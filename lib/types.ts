export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    size: number;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export interface Photo {
  id: string;
  url: string;
  display_url: string;
  delete_url: string;
  title: string;
  filename: string;
  size: number;
  uploadedAt: string;
  views: number;
  likes: number;
}

export interface UploadResult {
  success: boolean;
  photo?: Photo;
  error?: string;
}