"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Calendar, Eye } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  displayUrl: string;
  title: string;
  createdAt: string;
  likes: number;
  views: number;
}

interface ImageCardProps {
  photo: Photo;
}

export default function ImageCard({ photo }: ImageCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(photo.likes || 0);

  const handleLike = async () => {
    const newLiked = !liked;
    const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;
    
    setLiked(newLiked);
    setLikesCount(newLikesCount);
    
    // Update like in database
    try {
      await fetch(`/api/photos/${photo.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: newLiked }),
      });
    } catch (error) {
      console.error('Error updating like:', error);
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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={photo.displayUrl || photo.url}
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
            <span>{formatDate(photo.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{photo.views || 0}</span>
          </div>
        </div>
        
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 mt-3 transition-colors ${
            liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm">{likesCount}</span>
        </button>
      </div>
    </div>
  );
}