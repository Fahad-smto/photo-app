import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log("API route called"); // Debug log
  
  try {
    const formData = await request.formData();
    console.log("FormData received"); // Debug log
    
    // Try to get file with different possible keys
    let file = formData.get('file') as File;
    
    // If not found, try 'image' or 'photo'
    if (!file) {
      file = formData.get('image') as File;
    }
    if (!file) {
      file = formData.get('photo') as File;
    }
    
    console.log("File:", file?.name, file?.size); // Debug log
    
    if (!file) {
      console.error("No file found in request. Keys:", Array.from(formData.keys()));
      return NextResponse.json(
        { error: 'No file provided. Please upload a file with key "file"' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 16MB' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    console.log("Uploading to ImgBB..."); // Debug log

    // Upload to ImgBB
    const imgBBResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: process.env.IMGBB_API_KEY || '',
        image: base64Image,
        name: file.name,
      }),
    });

    const imgBBData = await imgBBResponse.json();
    console.log("ImgBB response:", imgBBData.success ? "Success" : "Failed");

    if (!imgBBData.success) {
      console.error("ImgBB error:", imgBBData);
      return NextResponse.json(
        { error: imgBBData.error?.message || 'Failed to upload to ImgBB' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      photo: {
        id: imgBBData.data.id,
        url: imgBBData.data.url,
        display_url: imgBBData.data.display_url,
        delete_url: imgBBData.data.delete_url,
        title: imgBBData.data.title || file.name,
        size: imgBBData.data.size,
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}