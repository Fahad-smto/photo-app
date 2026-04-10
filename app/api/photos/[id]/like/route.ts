import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Photo from '@/model/Photo';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const { liked } = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid photo ID' }, { status: 400 });
    }
    
    const update = liked ? { $inc: { likes: 1 } } : { $inc: { likes: -1 } };
    const photo = await Photo.findByIdAndUpdate(id, update, { new: true });
    
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, likes: photo.likes });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}