"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Download, Calendar } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  title: string;
  createdAt: string;
}

interface ImageCardProps {
  photo: Photo;
}

// Stable hash function to generate consistent random-looking numbers
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export default function ImageCard({ photo }: ImageCardProps) {
  const [liked, setLiked] = useState(false);
  // Generate stable likes count based on photo id
  const [likesCount, setLikesCount] = useState(() => {
    const hash = stableHash(photo.id);
    return (hash % 100) + 10; // Random-looking but stable number between 10-109
  });

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = photo.title || 'photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={photo.url}
          alt={photo.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{photo.title}</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(photo.createdAt)}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            <span className="text-sm">{likesCount}</span>
          </button>
          <button 
            onClick={handleDownload}
            className="text-gray-500 hover:text-blue-500 transition-colors"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}