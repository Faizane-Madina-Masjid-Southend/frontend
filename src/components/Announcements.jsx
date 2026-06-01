import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useMediaQuery } from "../hooks/useMediaQuery";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import AnnouncementImageGrid from "./AnnouncementImageGrid";
import "./Announcements.css";
import WhatsApp from "./WhatsApp";

const API_URL = import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337";

const convertBlocksToMarkdown = (blocks) => {
  if (!blocks) return "";
  return blocks
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n\n");
};

function getFullUrl(img) {
  return img?.attributes?.url || img?.url || null;
}
function getCaption(img) {
  return img?.attributes?.caption || img?.caption || undefined;
}

const TEXT = {
  title: "Announcements",
  noDate: "No Date",
  previous: "Previous",
  pagePrefix: "Page",
  pageOf: "of",
  next: "Next",
  noAnnouncements: "There are no new announcements at this time."
};

function Announcements() {
  // All announcements fetched once
  const [allAnnouncements, setAllAnnouncements] = useState([]);

  // Desired page (user's intent) — may be clamped before use
  const [currentPage, setCurrentPage] = useState(1);

  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Responsive page size: 1 on mobile, 3 on desktop
  const isMobile = useMediaQuery("(max-width: 767px)");
  const pageSize  = isMobile ? 1 : 3;

  // Derived pagination — no effects needed for page clamping.
  // If the user is on page 5 (mobile) and switches to desktop the total page
  // count shrinks, so Math.min automatically corrects the page for this render.
  const totalPages  = Math.max(1, Math.ceil(allAnnouncements.length / pageSize));
  const safePage    = Math.min(currentPage, totalPages);         // always valid
  const startIndex  = (safePage - 1) * pageSize;
  const visible     = allAnnouncements.slice(startIndex, startIndex + pageSize);

  // Lightbox state
  const [lightboxOpen,   setLightboxOpen]   = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState([]);
  const [lightboxIndex,  setLightboxIndex]  = useState(0);

  const openLightbox = useCallback((images, startIndex) => {
    setLightboxSlides(
      images.map((img) => ({ src: getFullUrl(img), description: getCaption(img) }))
    );
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  }, []);

  // Single fetch — runs once on mount
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        // Large page ceiling so we get everything in one request.
        // For a masjid site this will never hit the limit.
        const url =
          `${API_URL}/api/announcements` +
          `?sort=publishedAt:desc` +
          `&populate=*` +
          `&pagination[pageSize]=100`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch announcements.");
        const data = await res.json();
        setAllAnnouncements(data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    }
    fetchAnnouncements();
  }, []); // ← empty deps: fetch once, paginate client-side

  const dateMonthDayOptions = { month: "short", day: "numeric" };
  const dateYearOptions     = { year: "numeric" };

  return (
    <div
      id="announcements"
      className={`announcements-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="announcements-content-wrapper">
        <h2>{TEXT.title}</h2>

        {allAnnouncements.length > 0 ? (
          <div className="announcements-container">
            {/* key includes pageSize so animation re-fires on breakpoint change */}
            <div className="announcements-list" key={`${safePage}-${pageSize}`}>
              {visible.map((announcement) => {
                const publishedDate = announcement.publishedAt
                  ? new Date(announcement.publishedAt)
                  : null;

                return (
                  <div key={announcement.id} className="announcement-card">
                    <div className="announcement-date">
                      {publishedDate ? (
                        <>
                          <span className="date-month-day">
                            {publishedDate.toLocaleDateString("en-GB", dateMonthDayOptions)}
                          </span>
                          <span className="date-year">
                            {publishedDate.toLocaleDateString("en-GB", dateYearOptions)}
                          </span>
                        </>
                      ) : (
                        <span>{TEXT.noDate}</span>
                      )}
                    </div>

                    <div className="announcement-main">
                      <h3>{announcement.title}</h3>
                      <div className="announcement-content">
                        <ReactMarkdown>
                          {convertBlocksToMarkdown(announcement.content)}
                        </ReactMarkdown>
                      </div>

                      {(() => {
                        const imgs =
                          announcement.images?.data || announcement.images || [];
                        if (!imgs.length) return null;
                        return (
                          <AnnouncementImageGrid
                            images={imgs}
                            onImageClick={(idx) => openLightbox(imgs, idx)}
                          />
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination controls */}
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={safePage === 1}
              >
                <FaArrowLeft />
                <span>{TEXT.previous}</span>
              </button>

              <span className="pagination-status">
                {TEXT.pagePrefix} {safePage} {TEXT.pageOf} {totalPages}
              </span>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={safePage === totalPages}
              >
                <span>{TEXT.next}</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        ) : (
          <p className="no-announcements-message">
            {TEXT.noAnnouncements}
          </p>
        )}

        <WhatsApp />
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        plugins={[Captions]}
        captions={{ showToggle: false, descriptionTextAlign: "center" }}
      />
    </div>
  );
}

export default Announcements;
