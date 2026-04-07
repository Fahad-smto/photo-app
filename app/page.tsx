"use client";

import { useEffect, useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import { Camera, Heart, Share2 } from "lucide-react";
import Link from "next/link";

interface Photo {
  id: string;
  url: string;
  title: string;
  createdAt: string;
}

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos");
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Share Your <span className="text-blue-600">Beautiful Moments</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Upload, share, and discover amazing photos from our community
        </p>
        <Link
          href="/upload"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Camera className="h-5 w-5" />
          <span>Start Uploading</span>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <Camera className="h-10 w-10 text-blue-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">1,234+</h3>
          <p className="text-gray-600">Photos Uploaded</p>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <Heart className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">5,678+</h3>
          <p className="text-gray-600">Likes Received</p>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <Share2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">9,012+</h3>
          <p className="text-gray-600">Shares</p>
        </div>
      </div>

      {/* Recent Photos Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Photos</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </div>
    </div>
  );
}