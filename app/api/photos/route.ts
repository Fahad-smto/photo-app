import { NextRequest, NextResponse } from 'next/server';
import { photoService } from '@/services/photoService';

export async function GET(request: NextRequest) {
  try {
    const photos = await photoService.getAllPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Get photos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Photo ID required' },
        { status: 400 }
      );
    }
    
    const deleted = await photoService.deletePhoto(id);
    if (deleted) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}