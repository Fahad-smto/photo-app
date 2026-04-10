import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Photo from '@/model/Photo';
 

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert to base64 for ImgBB
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Upload to ImgBB
    const imgBBResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: process.env.IMGBB_API_KEY!,
        image: base64Image,
        name: file.name,
      }),
    });

    const imgBBData = await imgBBResponse.json();

    if (!imgBBData.success) {
      return NextResponse.json({ error: 'ImgBB upload failed' }, { status: 500 });
    }

    // Save to MongoDB
    const photo = await Photo.create({
      imgbbId: imgBBData.data.id,
      url: imgBBData.data.url,
      displayUrl: imgBBData.data.display_url,
      deleteUrl: imgBBData.data.delete_url,
      title: imgBBData.data.title || file.name,
      filename: file.name,
      size: file.size,
    });

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
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}