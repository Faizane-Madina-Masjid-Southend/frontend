import React from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaMobileAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import "./Footer.css";

const TEXT = {
  title: "Contact Us",
  telLabel: " (Telephone)",
  mobileLabel: " (Mobile)",
  whatsappLink: "Join our WhatsApp Group",
  copyrightPrefix: "© ",
  copyrightSuffix: " Faizane Madina Masjid Southend (Dawat-e-Islami). All Rights Reserved.",
  devCredit: "Designed & Developed by ",
  devName: "YQ Web Studio"
};

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
          <h4>{TEXT.title}</h4>
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
                {landlineArea} {landlineNum}{TEXT.telLabel}
              </a>
            </li>

            {/* 3. Mobile Obfuscation */}
            <li>
              <FaMobileAlt />
              <a href={`tel:${mobilePrefix}${mobileNum}`}>
                {mobilePrefix} {mobileNum}{TEXT.mobileLabel}
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
                {TEXT.whatsappLink}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <p>
          {TEXT.copyrightPrefix}{currentYear}{TEXT.copyrightSuffix}
        </p>
        <p className="developer-credit">
          {TEXT.devCredit}
          <a
            href="https://yqwebstudio.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {TEXT.devName}
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
