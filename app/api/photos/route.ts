import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Photo from '@/model/Photo';

export async function GET() {
  try {
    await connectToDatabase();
    const photos = await Photo.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json([], { status: 500 });
  }
}