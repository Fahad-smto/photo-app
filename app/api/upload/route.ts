import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Photo from '@/model/Photo';

export async function POST(request: NextRequest) {
  console.log("1. API route hit"); // Debug log
  
  try {
    // Check if ImgBB API key exists
    if (!process.env.IMGBB_API_KEY) {
      console.error("IMGBB_API_KEY is missing");
      return NextResponse.json({ 
        error: 'Server configuration error: ImgBB API key missing' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    console.log("2. FormData received");
    
    const file = formData.get('file') as File;
    console.log("3. File:", file?.name, file?.size, file?.type);
    
    if (!file) {
      console.error("No file provided");
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed' 
      }, { status: 400 });
    }

    // Validate file size (16MB max for ImgBB free tier)
    if (file.size > 16 * 1024 * 1024) {
      console.error("File too large:", file.size);
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 16MB' 
      }, { status: 400 });
    }

    // Convert file to base64
    console.log("4. Converting to base64...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    console.log("5. Base64 conversion complete, length:", base64Image.length);

    // Upload to ImgBB
    console.log("6. Uploading to ImgBB...");
    const imgBBResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: process.env.IMGBB_API_KEY,
        image: base64Image,
        name: file.name,
      }),
    });

    const imgBBData = await imgBBResponse.json();
    console.log("7. ImgBB response:", imgBBData.success ? "Success" : "Failed");
    
    if (!imgBBData.success) {
      console.error("ImgBB error:", imgBBData);
      return NextResponse.json({ 
        error: imgBBData.error?.message || 'Failed to upload to ImgBB' 
      }, { status: 500 });
    }

    // Connect to MongoDB and save photo
    console.log("8. Connecting to MongoDB...");
    await connectToDatabase();
    console.log("9. MongoDB connected");

    const photo = await Photo.create({
      imgbbId: imgBBData.data.id,
      url: imgBBData.data.url,
      displayUrl: imgBBData.data.display_url,
      deleteUrl: imgBBData.data.delete_url,
      title: imgBBData.data.title || file.name,
      filename: file.name,
      size: file.size,
    });
    console.log("10. Photo saved to database:", photo._id);

    return NextResponse.json({
      success: true,
      photo: {
        id: photo._id,
        url: photo.url,
        displayUrl: photo.displayUrl,
        title: photo.title,
        createdAt: photo.createdAt,
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 });
  }
}