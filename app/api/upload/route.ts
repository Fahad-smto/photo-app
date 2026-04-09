import { NextRequest, NextResponse } from 'next/server';
import { photoService } from '@/services/photoService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const files = formData.getAll('files') as File[];

    // Handle single file upload
    if (file) {
      const result = await photoService.uploadPhoto(file);
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          photo: result.photo 
        });
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }
    }
    
    // Handle multiple files upload
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => photoService.uploadPhoto(file));
      const results = await Promise.all(uploadPromises);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      return NextResponse.json({
        success: true,
        uploaded: successful.map(s => s.photo),
        failed: failed.map(f => ({ error: f.error }))
      });
    }
    
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}