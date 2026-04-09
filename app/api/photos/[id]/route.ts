import { NextRequest, NextResponse } from 'next/server';
import { photoService } from '@/services/photoService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photo = await photoService.toggleLike(params.id);
    if (photo) {
      return NextResponse.json({ success: true, likes: photo.likes });
    } else {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: 'Failed to update like' },
      { status: 500 }
    );
  }
}