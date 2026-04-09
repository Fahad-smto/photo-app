"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Home, Upload } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">PhotoGallery</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md ${
                pathname === "/" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home className="inline-block h-5 w-5 mr-1" />
              Home
            </Link>
            <Link
              href="/upload"
              className={`px-3 py-2 rounded-md ${
                pathname === "/upload" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Upload className="inline-block h-5 w-5 mr-1" />
              Upload
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}