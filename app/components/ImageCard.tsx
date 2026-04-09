"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Download, Calendar, Eye } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  display_url: string;
  title: string;
  filename: string;
  size: number;
  uploadedAt: string;
  views: number;
  likes: number;
}

interface ImageCardProps {
  photo: Photo;
}

export default function ImageCard({ photo }: ImageCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(photo.likes);

  const handleLike = async () => {
    const newLikesCount = liked ? likesCount - 1 : likesCount + 1;
    setLikesCount(newLikesCount);
    setLiked(!liked);
    
    try {
      await fetch(`/api/photos/${photo.id}/like`, {
        method: 'POST',
      });
    } catch (error) {
      // Revert on error
      setLikesCount(likesCount);
      setLiked(liked);
      console.error('Failed to update likes:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={photo.display_url || photo.url}
          alt={photo.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{photo.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(photo.uploadedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{photo.views}</span>
          </div>
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
          
          <a
            href={photo.url}
            download
            className="text-gray-500 hover:text-blue-500 transition-colors"
          >
            <Download className="h-5 w-5" />
          </a>
        </div>
        
        <p className="text-xs text-gray-400 mt-2">
          {formatFileSize(photo.size)}
        </p>
      </div>
    </div>
  );
}