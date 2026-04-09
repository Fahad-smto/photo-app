"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Home, Upload, Info, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">PhotoUpload</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-md
                    transition-all duration-200 group
                    ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  
                  {/* Active Underline */}
                  <span className={`
                    absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full
                    transition-transform duration-200
                    ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `} />
                </Link>
              );
            })}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    relative flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Active indicator for mobile */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}