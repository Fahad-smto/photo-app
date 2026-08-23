import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Photo from '@/model/Photo';

export async function GET() {
  try {
    console.log("1. API called - fetching photos");
    
    // MongoDB এ কানেক্ট করুন
    await connectToDatabase();
    console.log("2. MongoDB connected");
    
    console.log("3. Photos found:", photos.length);
    
    return NextResponse.json(photos);
  } catch (error: any) {
    console.error("Error in /api/photos:", error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch photos',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}