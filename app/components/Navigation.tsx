"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Home, Upload } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          background: rgba(249, 247, 244, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 0.5px solid #e0dbd4;
          font-family: 'DM Sans', sans-serif;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 400;
          color: #1a1a1a;
          text-decoration: none;
          letter-spacing: 0.01em;
        }

        .nav-logo svg {
          opacity: 0.65;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 100px;
          color: #888;
          border: 0.5px solid transparent;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }

        .nav-link:hover {
          color: #1a1a1a;
          background: #f0ece6;
        }

        .nav-link.active {
          color: #f9f7f4;
          background: #1a1a1a;
          border-color: #1a1a1a;
        }

        .nav-link svg {
          flex-shrink: 0;
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">
          <Camera size={17} strokeWidth={1.5} />
          Framely
        </Link>

        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link${pathname === "/" ? " active" : ""}`}
          >
            <Home size={12} strokeWidth={2} />
            Home
          </Link>
          <Link
            href="/upload"
            className={`nav-link${pathname === "/upload" ? " active" : ""}`}
          >
            <Upload size={12} strokeWidth={2} />
            Upload
          </Link>
        </div>
      </nav>
    </>
  );
}