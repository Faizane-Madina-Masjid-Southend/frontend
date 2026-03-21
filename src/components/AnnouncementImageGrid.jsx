import React from "react";
import "./AnnouncementImageGrid.css";

/**
 * Renders a Twitter-style image grid for 1–4 images.
 * For > 4 images, only the first 4 are shown in the grid.
 * The 4th slot shows a "+N more" overlay, but clicking any
 * thumbnail opens the lightbox for the FULL image array.
 *
 * Props:
 *   images    – array of Strapi media objects (from `populate=images`)
 *   onImageClick(index) – callback to open the lightbox at that index
 */
function AnnouncementImageGrid({ images, onImageClick }) {
  if (!images || images.length === 0) return null;

  // We display at most 4 thumbnails in the grid
  const displayImages = images.slice(0, 4);
  const extraCount = images.length - 4; // positive only when > 4

  const getUrl = (img) => {
    // Supports both Strapi v4 (attributes) and v5 (flat) response shapes
    const formats = img?.attributes?.formats || img?.formats || {};
    return (
      formats.medium?.url ||
      formats.small?.url ||
      formats.thumbnail?.url ||
      img?.attributes?.url ||
      img?.url ||
      null
    );
  };

  return (
    <div
      className={`announcement-image-grid count-${Math.min(
        displayImages.length,
        4
      )}`}
    >
      {displayImages.map((img, idx) => {
        const url = getUrl(img);
        if (!url) return null;

        const isLastSlot = idx === 3 && extraCount > 0;

        return (
          <div
            key={img.id ?? idx}
            className="announcement-img-cell"
            onClick={() => onImageClick(idx)}
            role="button"
            aria-label={`View image ${idx + 1}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onImageClick(idx)}
          >
            <img src={url} alt={img?.attributes?.alternativeText || img?.alternativeText || `Announcement image ${idx + 1}`} loading="lazy" />

            {/* "+N more" overlay on the 4th slot when there are extras */}
            {isLastSlot && (
              <div className="announcement-img-more-overlay">
                <span>+{extraCount}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AnnouncementImageGrid;
