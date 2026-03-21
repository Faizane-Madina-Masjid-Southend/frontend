import React, { useState, useEffect, useCallback } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "./Gallery.css";

// NOTE: We don't use this API_URL to build image sources,
// as Cloudinary returns absolute URLs. We keep it only for API calls.
const API_URL = import.meta.env.VITE_STRAPI_API_URL || "https://localhost:1337";

const MAX_VISIBLE = 8;

// ---------------------------------------------------------------------------
// Helper: extract the best URL from a Strapi media object (v4 or v5)
// ---------------------------------------------------------------------------
function getThumbnailUrl(img) {
  const formats = img?.attributes?.formats || img?.formats || {};
  return (
    formats.small?.url ||
    formats.medium?.url ||
    formats.thumbnail?.url ||
    img?.attributes?.url ||
    img?.url ||
    null
  );
}

function getFullUrl(img) {
  return img?.attributes?.url || img?.url || null;
}

function getCaption(img) {
  return img?.attributes?.caption || img?.caption || null;
}

// ---------------------------------------------------------------------------
// GalleryModal – full-screen overlay showing ALL thumbnails
// ---------------------------------------------------------------------------
function GalleryModal({ images, onClose, onThumbnailClick }) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="gallery-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="View all gallery images"
    >
      {/* Stop clicks on the inner panel from closing the modal */}
      <div
        className="gallery-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gallery-modal-header">
          <h3>All Photos ({images.length})</h3>
          <button
            className="gallery-modal-close"
            onClick={onClose}
            aria-label="Close gallery modal"
          >
            &times;
          </button>
        </div>

        <div className="gallery-modal-grid">
          {images.map((img, idx) => {
            const thumb = getThumbnailUrl(img);
            if (!thumb) return null;
            return (
              <div
                key={img.id ?? idx}
                className="gallery-modal-item"
                onClick={() => onThumbnailClick(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onThumbnailClick(idx)}
                aria-label={`Open image ${idx + 1}`}
              >
                <img src={thumb} alt={`Gallery image ${idx + 1}`} loading="lazy" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gallery – main component
// ---------------------------------------------------------------------------
function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Fetch gallery images (with full media fields including caption)
  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        setLoading(true);
        // Use populate[images][populate]=* to get caption and all format fields
        const response = await fetch(
          `${API_URL}/api/gallery?populate[images][populate]=*`
        );
        if (!response.ok) throw new Error("Failed to fetch gallery images.");

        const apiData = await response.json();

        // Handles both Strapi v4 (attributes) and v5 (flat) responses
        const images =
          apiData.data?.images || apiData.data?.attributes?.images;
        setGalleryImages(images?.data || images || []);
      } catch (error) {
        console.error(error);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGalleryImages();
  }, []);

  // Build slides for lightbox (full-size URL + caption)
  const slides = galleryImages.map((img) => ({
    src: getFullUrl(img),
    description: getCaption(img) || undefined,
  }));

  const openLightbox = useCallback((index) => {
    setModalOpen(false);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const openLightboxFromModal = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const visibleImages = galleryImages.slice(0, MAX_VISIBLE);
  const hasMore = galleryImages.length > MAX_VISIBLE;

  return (
    <div
      id="gallery"
      className={`gallery-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="gallery-wrapper">
        <h2>Gallery</h2>

        {loading && <p className="gallery-loading">Loading Gallery...</p>}

        {/* ---- Main 8-image grid ---- */}
        <div className="gallery-grid">
          {visibleImages.map((img, idx) => {
            const thumb = getThumbnailUrl(img);
            if (!thumb) return null;
            return (
              <div
                key={img.id}
                className="gallery-item"
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
                aria-label={`Open gallery image ${idx + 1}`}
              >
                <img src={thumb} alt="Gallery thumbnail" loading="lazy" />
              </div>
            );
          })}
          {/* ---- "View All" card (Only inside the grid for mobile/desktop parity) ---- */}
          {hasMore && (
            <div
              className="view-all-item"
              onClick={() => setModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
              aria-label="View all photos"
            >
              <div className="view-all-overlay">
                <span>View All</span>
                <span className="count">({galleryImages.length})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- View All Modal ---- */}
      {modalOpen && (
        <GalleryModal
          images={galleryImages}
          onClose={() => setModalOpen(false)}
          onThumbnailClick={openLightboxFromModal}
        />
      )}

      {/* ---- Lightbox with Captions plugin ---- */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
        plugins={[Captions]}
        captions={{ showToggle: false, descriptionTextAlign: "center" }}
      />
    </div>
  );
}

export default Gallery;
