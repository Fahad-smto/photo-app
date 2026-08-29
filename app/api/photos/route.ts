import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Photo from '@/model/Photo';

  try {
    console.log("1. API called - fetching photos");
    
    // MongoDB এ কানেক্ট করুন
    await connectToDatabase();
    console.log("2. MongoDB connected");
    
    // ফটোগুলো খুঁজে বের করুন
    const photos = await Photo.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    
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