"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
      setError(null);
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 16 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setUploading(true);
    setError(null);

    let successCount = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          successCount++;
          const existingPhotos = JSON.parse(localStorage.getItem("photos") || "[]");
          const newPhoto = {
            id: data.photo?.id || Date.now().toString(),
            url: data.photo?.url,
            display_url: data.photo?.display_url,
            title: data.photo?.title || file.name,
            createdAt: new Date().toISOString(),
            likes: 0,
            views: 0,
          };
          localStorage.setItem("photos", JSON.stringify([newPhoto, ...existingPhotos]));
        } else {
          throw new Error(data.error || "Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);

    if (successCount === files.length) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } else if (successCount > 0) {
      setError(`Uploaded ${successCount} out of ${files.length} files`);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .upload-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f9f7f4;
        }

        .upload-wrap {
          max-width: 680px;
          margin: 0 auto;
          padding: 3.5rem 2rem 6rem;
        }

        .upload-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #aaa;
          letter-spacing: .08em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .upload-eyebrow-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ccc;
          display: inline-block;
        }

        .upload-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 6vw, 3.5rem);
          font-weight: 300;
          line-height: 1.05;
          color: #1a1a1a;
          margin: 0 0 .4rem;
        }

        .upload-title em {
          font-style: italic;
          color: #7a6e64;
        }

        .upload-sub {
          font-size: 13px;
          color: #aaa;
          font-weight: 300;
          margin: 0 0 2.5rem;
        }

        /* ERROR */
        .error-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 0.5px solid #e0dbd4;
          border-left: 2px solid #999;
          border-radius: 8px;
          padding: .65rem 1rem;
          margin-bottom: 1.5rem;
          font-size: 12px;
          color: #666;
        }

        /* DROPZONE */
        .dropzone {
          border: 0.5px dashed #ccc;
          border-radius: 16px;
          background: #fff;
          padding: 3.5rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }

        .dropzone:hover {
          border-color: #999;
          background: #faf8f5;
        }

        .dropzone.active {
          border-color: #7a6e64;
          background: #f5f1ec;
        }

        .dz-icon {
          width: 52px;
          height: 52px;
          background: #f0ece6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .dz-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 300;
          color: #1a1a1a;
          margin: 0 0 .35rem;
        }

        .dz-active-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 300;
          font-style: italic;
          color: #7a6e64;
          margin: 0 0 .35rem;
        }

        .dz-sub {
          font-size: 12px;
          color: #aaa;
          margin: 0 0 1.25rem;
        }

        .dz-formats {
          display: flex;
          justify-content: center;
          gap: .6rem;
        }

        .fmt {
          font-size: 10px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #aaa;
          background: #f5f1ec;
          border: 0.5px solid #e0dbd4;
          border-radius: 100px;
          padding: 3px 10px;
        }

        /* DIVIDER */
        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0 1.25rem;
        }

        .div-line {
          flex: 1;
          height: 0.5px;
          background: #e0dbd4;
        }

        .div-label {
          font-size: 11px;
          color: #aaa;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        /* FILE GRID */
        .file-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .file-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 300;
          color: #1a1a1a;
          margin: 0;
        }

        .clear-btn {
          font-size: 11px;
          color: #aaa;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: .03em;
          padding: 0;
          transition: color .2s;
        }

        .clear-btn:hover { color: #1a1a1a; }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        @media (min-width: 480px) {
          .file-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (min-width: 640px) {
          .file-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .file-card {
          background: #fff;
          border-radius: 12px;
          border: 0.5px solid #e8e4df;
          overflow: hidden;
        }

        .file-thumb {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #f0ece6;
          overflow: hidden;
        }

        .remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          background: #fff;
          border: 0.5px solid #e0dbd4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity .2s;
        }

        .file-card:hover .remove-btn { opacity: 1; }

        .file-meta {
          padding: 8px 10px 10px;
        }

        .file-name {
          font-size: 11px;
          font-weight: 500;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }

        .file-size {
          font-size: 10px;
          color: #bbb;
        }

        /* UPLOAD ACTION BAR */
        .upload-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 0.5px solid #e0dbd4;
        }

        .upload-count {
          font-size: 12px;
          color: #aaa;
        }

        .upload-count strong {
          color: #1a1a1a;
          font-weight: 500;
        }

        .btn-upload {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .04em;
          text-transform: uppercase;
          color: #f9f7f4;
          background: #1a1a1a;
          border: none;
          border-radius: 100px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background .2s;
        }

        .btn-upload:hover:not(:disabled) { background: #333; }
        .btn-upload:disabled { opacity: .45; cursor: not-allowed; }

        .spinner {
          width: 13px;
          height: 13px;
          border: 1.5px solid rgba(249,247,244,.3);
          border-top-color: #f9f7f4;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* SUCCESS */
        .success-box {
          border: 0.5px solid #e0dbd4;
          border-radius: 16px;
          background: #fff;
          padding: 4rem 2rem;
          text-align: center;
        }

        .success-icon {
          width: 56px;
          height: 56px;
          background: #f0ece6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 300;
          color: #1a1a1a;
          margin: 0 0 .4rem;
        }

        .success-sub {
          font-size: 13px;
          color: #aaa;
          margin: 0;
        }
      `}</style>

      <div className="upload-page">
        <div className="upload-wrap">

          <div className="upload-eyebrow">
            <span className="upload-eyebrow-dot"></span>
            Free upload · Max 16 MB
          </div>
          <h1 className="upload-title">
            Upload your <em>photos</em>
          </h1>
          <p className="upload-sub">
            Drag & drop your images to upload to ImgBB
          </p>

          {success ? (
            <div className="success-box">
              <div className="success-icon">
                <CheckCircle size={24} color="#7a6e64" strokeWidth={1.5} />
              </div>
              <h2 className="success-title">Upload complete</h2>
              <p className="success-sub">
                Your photos have been uploaded to ImgBB. Redirecting…
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="error-bar">
                  <AlertCircle size={14} strokeWidth={1.5} />
                  {error}
                </div>
              )}

              {/* DROPZONE */}
              <div
                {...getRootProps()}
                className={`dropzone${isDragActive ? " active" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="dz-icon">
                  <Upload size={20} color="#7a6e64" strokeWidth={1.5} />
                </div>
                {isDragActive ? (
                  <p className="dz-active-title">Drop your photos here…</p>
                ) : (
                  <>
                    <p className="dz-title">Drag & drop your photos here</p>
                    <p className="dz-sub">or click to select files (Max 16MB per file)</p>
                    <div className="dz-formats">
                      <span className="fmt">JPEG</span>
                      <span className="fmt">PNG</span>
                      <span className="fmt">GIF</span>
                      <span className="fmt">WebP</span>
                    </div>
                  </>
                )}
              </div>

              {/* FILE PREVIEW */}
              {files.length > 0 && (
                <>
                  <div className="divider">
                    <div className="div-line"></div>
                    <span className="div-label">Selected files</span>
                    <div className="div-line"></div>
                  </div>

                  <div className="file-header">
                    <h3 className="file-heading">{files.length} {files.length === 1 ? "file" : "files"} ready</h3>
                    <button className="clear-btn" onClick={() => setFiles([])}>
                      Clear all
                    </button>
                  </div>

                  <div className="file-grid">
                    {files.map((file, index) => (
                      <div key={index} className="file-card">
                        <div className="file-thumb">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          <button
                            className="remove-btn"
                            onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                          >
                            <X size={9} strokeWidth={2.5} />
                          </button>
                        </div>
                        <div className="file-meta">
                          <div className="file-name">{file.name}</div>
                          <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="upload-bar">
                    <span className="upload-count">
                      <strong>{files.length}</strong> {files.length === 1 ? "photo" : "photos"} ·{" "}
                      {(files.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1)} MB total
                    </span>
                    <button
                      className="btn-upload"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <div className="spinner"></div>
                          Uploading…
                        </>
                      ) : (
                        <>
                          <Upload size={12} strokeWidth={2.5} />
                          Upload {files.length} {files.length === 1 ? "photo" : "photos"}
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}