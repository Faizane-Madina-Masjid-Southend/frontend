import React, { useState, useEffect } from "react";

import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./Gallery.css";

// NOTE: We don't use this API_URL to build image sources,
// as Cloudinary returns absolute URLs. We keep it only for API calls.
const API_URL = import.meta.env.VITE_STRAPI_API_URL || "https://localhost:1337";

function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Fetch images from Strapi
  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        setLoading(true);
        // Ensure the API call is secure
        const response = await fetch(`${API_URL}/api/gallery?populate=images`);
        if (!response.ok) throw new Error("Failed to fetch gallery images.");

        const apiData = await response.json();

        // This logic handles both Strapi v4 (attributes) and v5 (flat) responses
        const images = apiData.data?.images || apiData.data?.attributes?.images;
        setGalleryImages(images.data || images || []);
      } catch (error) {
        console.error(error);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGalleryImages();
  }, []);

  // Format images for the lightbox (using full-size images)
  const slides = galleryImages.map((img) => {
    // This looks for the URL in both old and new Strapi structures
    const imageUrl = img.attributes?.url || img.url;
    return {
      src: imageUrl,
      alt: "Gallery image",
    };
  });

  // Open the lightbox at the correct image index
  const openLightbox = (imageIndex) => {
    setIndex(imageIndex);
    setOpen(true);
  };

  return (
    <div
      id="gallery"
      className={`gallery-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="gallery-wrapper">
        <h2>Gallery</h2>

        {loading && <p className="gallery-loading">Loading Gallery...</p>}

        <div className="gallery-grid">
          {galleryImages.map((img, idx) => {
            const formats = img.attributes?.formats || img.formats || {};

            const thumbnailUrl =
              formats.small?.url ||
              formats.medium?.url ||
              formats.thumbnail?.url ||
              img.attributes?.url ||
              img.url;

            return (
              <div
                key={img.id}
                className="gallery-item"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={thumbnailUrl}
                  alt="Gallery thumbnail"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
      />
    </div>
  );
}

export default Gallery;
