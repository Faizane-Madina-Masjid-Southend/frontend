import React from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaMobileAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  // --- ANTI-SPAM VARIABLES ---
  const emailUser = "faizanemadinasouthend";
  const emailDomain = "gmail.com";

  const landlineArea = "01702";
  const landlineNum = "346392";

  const mobilePrefix = "07427";
  const mobileNum = "665750";

  // --- MAP LINK ---
  // Using the exact link requested
  const googleMapsUrl = "https://maps.app.goo.gl/pCwWinV9rmrPUWkh7";
  const addressText = "53-55 Milton Road, Westcliff-on-Sea, SS0 7JP";

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            {/* 1. Address Link (Clickable) */}
            <li>
              <FaMapMarkerAlt />
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                {addressText}
              </a>
            </li>

            {/* 2. Landline Obfuscation */}
            <li>
              <FaPhone />
              <a href={`tel:${landlineArea}${landlineNum}`}>
                {landlineArea} {landlineNum} (Telephone)
              </a>
            </li>

            {/* 3. Mobile Obfuscation */}
            <li>
              <FaMobileAlt />
              <a href={`tel:${mobilePrefix}${mobileNum}`}>
                {mobilePrefix} {mobileNum} (Mobile)
              </a>
            </li>

            {/* 4. Email Obfuscation */}
            <li>
              <FaEnvelope />
              <a href={`mailto:${emailUser}@${emailDomain}`}>
                {emailUser}@{emailDomain}
              </a>
            </li>

            {/* 5. WhatsApp Link */}
            <li>
              <FaWhatsapp />
              <a
                href="https://chat.whatsapp.com/JSjCIBk2jkr9rnlaHONDO1?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join our WhatsApp Group
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        © {currentYear} Faizane Madina Masjid Southend (Dawat-e-Islami). All
        Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
