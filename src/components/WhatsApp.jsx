import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import whatsappGraphic from "../assets/whatsapp.webp";
import "./WhatsApp.css";

// 1. IMPORT THE HOOK
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const TEXT = {
  imageAlt: "Stay Connected on WhatsApp",
  title: "Stay Connected",
  description: "Join our WhatsApp group to stay up to date with the latest announcements and events.",
  button: "Join Now"
};

function WhatsApp() {
  const WHATSAPP_GROUP_LINK =
    "https://chat.whatsapp.com/JSjCIBk2jkr9rnlaHONDO1?mode=wwt";

  // 2. CALL THE HOOK
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2 }); // Trigger when 20% is visible

  return (
    // 3. APPLY THE REF AND CLASSNAME
    <div
      className={`whatsapp-join-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
    >
      {/* Column 1: The Image */}
      <div className="whatsapp-image-container">
        <img src={whatsappGraphic} alt={TEXT.imageAlt} />
      </div>

      {/* Column 2: The Content */}
      <div className="whatsapp-content">
        <h3>{TEXT.title}</h3>
        <p>{TEXT.description}</p>
        <a
          href={WHATSAPP_GROUP_LINK}
          className="whatsapp-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp />
          <span>{TEXT.button}</span>
        </a>
      </div>
    </div>
  );
}

export default WhatsApp;
