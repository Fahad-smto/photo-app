"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Heart, Share2, Calendar, Eye, Upload, ArrowUpRight } from "lucide-react";
import Navigation from "./components/Navigation";

interface Photo {
  _id: string;
  id: string;
  url: string;
  displayUrl: string;
  title: string;
  filename: string;
  size: number;
  views: number;
  likes: number;
  createdAt: string;
}

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/photos");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPhotos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to load photos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: true }),
      });
      if (response.ok) {
        setPhotos((prev) =>
          prev.map((p) =>
            p._id === photoId || p.id === photoId
              ? { ...p, likes: (p.likes || 0) + 1 }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error liking photo:", error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const totalLikes = photos.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalViews = photos.reduce((sum, p) => sum + (p.views || 0), 0);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4]">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">Something went wrong</h2>
          <p className="text-sm text-[#888] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm rounded-full hover:bg-[#333] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f9f7f4;
          color: #1a1a1a;
          margin: 0;
        }

        .serif { font-family: 'Cormorant Garamond', serif; }

        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 64px;
          background: rgba(249,247,244,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8e4df;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem;
          font-weight: 500;
          color: #1a1a1a;
          text-decoration: none;
          letter-spacing: 0.01em;
        }

        .nav-logo svg { opacity: 0.7; }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          font-size: 0.8rem;
          font-weight: 400;
          color: #666;
          text-decoration: none;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .nav-link:hover { color: #1a1a1a; }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1.1rem;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #f9f7f4;
          background: #1a1a1a;
          border: none;
          border-radius: 100px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }

        .upload-btn:hover {
          background: #333;
          transform: translateY(-1px);
        }

        /* HERO */
        .hero {
          padding-top: 64px;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 40%, #ede9e3 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 1.5rem;
          padding: 0.4rem 1rem;
          background: white;
          border: 1px solid #e0dbd4;
          border-radius: 100px;
        }

        .hero-eyebrow span {
          width: 5px;
          height: 5px;
          background: #b5a898;
          border-radius: 50%;
          display: inline-block;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 10vw, 7.5rem);
          font-weight: 300;
          line-height: 1.0;
          color: #1a1a1a;
          margin: 0 0 0.3rem;
          letter-spacing: -0.01em;
        }

        .hero-title em {
          font-style: italic;
          color: #7a6e64;
        }

        .hero-sub {
          font-size: 0.95rem;
          color: #888;
          font-weight: 300;
          max-width: 380px;
          line-height: 1.7;
          margin: 1.5rem auto 2.5rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .hero-link {
          font-size: 0.82rem;
          color: #888;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }

        .hero-link:hover {
          color: #1a1a1a;
          border-color: #1a1a1a;
        }

        /* DIVIDER */
        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #e0dbd4;
        }

        .divider-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #aaa;
          white-space: nowrap;
        }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #e0dbd4;
          border: 1px solid #e0dbd4;
          border-radius: 16px;
          overflow: hidden;
          max-width: 800px;
          margin: 4rem auto;
        }

        @media (max-width: 640px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
        }

        .stat {
          background: #f9f7f4;
          padding: 2rem 1.5rem;
          text-align: center;
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          background: #f0ece6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
        }

        .stat-icon svg { color: #7a6e64; }

        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 400;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .stat-label {
          font-size: 0.72rem;
          color: #aaa;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 400;
        }

        /* GALLERY SECTION */
        .section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 6rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 300;
          color: #1a1a1a;
          line-height: 1.1;
          margin: 0;
        }

        .section-title em { font-style: italic; color: #7a6e64; }

        .section-meta {
          font-size: 0.78rem;
          color: #aaa;
          letter-spacing: 0.05em;
        }

        /* PHOTO GRID */
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .photo-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 600px) {
          .photo-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .photo-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e8e4df;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .photo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }

        .photo-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #f0ece6;
          overflow: hidden;
        }

        .photo-img-wrap img {
          transition: transform 0.4s ease;
        }

        .photo-card:hover .photo-img-wrap img {
          transform: scale(1.04);
        }

        .photo-info {
          padding: 0.9rem 1rem 1rem;
        }

        .photo-title {
          font-size: 0.87rem;
          font-weight: 500;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.5rem;
        }

        .photo-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          color: #aaa;
        }

        .photo-meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .photo-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #f0ece6;
        }

        .like-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #bbb;
          font-size: 0.75rem;
          padding: 0;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .like-btn:hover { color: #c0392b; }
        .like-btn:hover svg { fill: #c0392b; }

        .view-link {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.72rem;
          color: #aaa;
          text-decoration: none;
          transition: color 0.2s;
        }

        .view-link:hover { color: #1a1a1a; }

        .photo-size {
          font-size: 0.68rem;
          color: #ccc;
          margin-top: 0.4rem;
        }

        /* EMPTY STATE */
        .empty {
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border-radius: 20px;
          border: 1px dashed #d8d3cc;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          background: #f0ece6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .empty h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
        }

        .empty p {
          font-size: 0.87rem;
          color: #aaa;
          margin: 0 0 2rem;
        }

        /* LOADING */
        .loading {
          text-align: center;
          padding: 5rem 2rem;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 2px solid #e0dbd4;
          border-top-color: #7a6e64;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading p {
          font-size: 0.82rem;
          color: #aaa;
        }

        /* CTA FOOTER */
        .cta-footer {
          background: #1a1a1a;
          padding: 5rem 2rem;
          text-align: center;
          margin-top: 0;
        }

        .cta-footer h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 300;
          color: #f9f7f4;
          margin: 0 0 0.75rem;
          line-height: 1.1;
        }

        .cta-footer h2 em {
          font-style: italic;
          color: #b5a898;
        }

        .cta-footer p {
          font-size: 0.9rem;
          color: #666;
          margin: 0 0 2.5rem;
        }

        .upload-btn-light {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 2rem;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #1a1a1a;
          background: #f9f7f4;
          border: none;
          border-radius: 100px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }

        .upload-btn-light:hover {
          background: #e0dbd4;
          transform: translateY(-1px);
        }
      `}</style>

      <div>
        {/* NAV */}
        <Navigation></Navigation>

        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow">
            <span></span>
            Free Photo Hosting
          </div>
          <h1 className="hero-title">
            Share <em>beautiful</em><br />moments
          </h1>
          <p className="hero-sub">
            Upload your photos to the cloud and share them with the world — instantly, for free.
          </p>
          <div className="hero-actions">
            <Link href="/upload" className="upload-btn" style={{ padding: "0.75rem 2rem", fontSize: "0.82rem" }}>
              <Upload size={14} />
              Upload a photo
            </Link>
            <a href="#gallery" className="hero-link">Browse gallery</a>
          </div>
        </section>

        {/* STATS */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
          <div className="divider" style={{ padding: 0 }}>
            <div className="divider-line"></div>
            <span className="divider-label">Community</span>
            <div className="divider-line"></div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-icon"><Camera size={16} /></div>
              <div className="stat-num">{photos.length}</div>
              <div className="stat-label">Photos</div>
            </div>
            <div className="stat">
              <div className="stat-icon"><Heart size={16} /></div>
              <div className="stat-num">{totalLikes}</div>
              <div className="stat-label">Likes</div>
            </div>
            <div className="stat">
              <div className="stat-icon"><Eye size={16} /></div>
              <div className="stat-num">{totalViews}</div>
              <div className="stat-label">Views</div>
            </div>
            <div className="stat">
              <div className="stat-icon"><Share2 size={16} /></div>
              <div className="stat-num">∞</div>
              <div className="stat-label">Free Storage</div>
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <section className="section" id="gallery">
          <div className="section-header">
            <h2 className="section-title">
              Recent <em>uploads</em>
            </h2>
            {photos.length > 0 && (
              <span className="section-meta">{photos.length} photos</span>
            )}
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading photos…</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                <Camera size={28} color="#b5a898" />
              </div>
              <h3>No photos yet</h3>
              <p>Be the first to share a moment with the community.</p>
              <Link href="/upload" className="upload-btn">
                <Upload size={13} />
                Upload your first photo
              </Link>
            </div>
          ) : (
            <div className="photo-grid">
              {photos.map((photo) => (
                <div key={photo._id || photo.id} className="photo-card">
                  <div className="photo-img-wrap">
                    <Image
                      src={photo.displayUrl || photo.url}
                      alt={photo.title || "Photo"}
                      fill
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x400?text=Not+Found";
                      }}
                    />
                  </div>
                  <div className="photo-info">
                    <div className="photo-title">{photo.title || "Untitled"}</div>
                    <div className="photo-meta">
                      <span className="photo-meta-item">
                        <Calendar size={10} />
                        {formatDate(photo.createdAt)}
                      </span>
                      <span className="photo-meta-item">
                        <Eye size={10} />
                        {photo.views || 0}
                      </span>
                    </div>
                    <div className="photo-footer">
                      <button
                        className="like-btn"
                        onClick={() => handleLike(photo._id || photo.id)}
                      >
                        <Heart size={14} />
                        {photo.likes || 0}
                      </button>
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-link"
                      >
                        View <ArrowUpRight size={11} />
                      </a>
                    </div>
                    <div className="photo-size">{formatFileSize(photo.size)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA FOOTER */}
        <footer className="cta-footer">
          <h2>
            Ready to <em>share</em><br />your story?
          </h2>
          <p>Join the community. Start uploading for free today.</p>
          <Link href="/upload" className="upload-btn-light">
            <Upload size={14} />
            Upload now — it&apos;s free
          </Link>
        </footer>
      </div>
    </>
  );
}