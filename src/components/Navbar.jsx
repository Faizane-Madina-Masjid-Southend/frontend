import React, { useState } from "react";
import fullLogo from "../assets/website-logo.webp";
import { FaAngleDown } from "react-icons/fa";
import "./Navbar.css";

const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/JSjCIBk2jkr9rnlaHONDO1?mode=wwt";

const TEXT = {
  logoAlt: "Faizan-e-Madina Southend Logo",
  menu: "Menu",
  home: "Home",
  aboutToggle: "About",
  prayerTimetable: "Prayer Timetable",
  aboutUs: "About Us",
  services: "Services",
  announcementsToggle: "Announcements",
  latestNews: "Latest News",
  joinWhatsAppGroup: "Join WhatsApp Group",
  donate: "Donate",
  gallery: "Gallery",
  contact: "Contact"
};

function Navbar() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const closeAllMenus = () => {
    setIsNavVisible(false);
    setActiveDropdown(null);
  };

  // --- 1. MOUSE HANDLERS (Desktop Hover) ---
  const handleMouseEnter = (menuName) => {
    if (window.innerWidth > 768) {
      setActiveDropdown(menuName);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setActiveDropdown(null);
    }
  };

  // --- 2. CLICK HANDLER (Mobile Toggle) ---
  const handleParentClick = (e, menuName) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === menuName ? null : menuName);
    }
  };

  return (
    <nav className="navbar">
      <div className="content-wrapper">
        {/* LOGO SECTION */}
        <div className="navbar-header">
          <a href="#home" className="navbar-brand-link" onClick={closeAllMenus}>
            <img
              src={fullLogo}
              alt={TEXT.logoAlt}
              className="navbar-brand-image"
            />
          </a>
        </div>

        {/* MOBILE TOGGLE (Hidden on Desktop) */}
        <button
          className="mobile-nav-toggle"
          aria-controls="primary-navigation"
          aria-expanded={isNavVisible}
          onClick={() => {
            setIsNavVisible(!isNavVisible);
            setActiveDropdown(null);
          }}
        >
          <span className="sr-only">{TEXT.menu}</span>
        </button>

        {/* LINKS SECTION */}
        <div className="nav-links-container" data-visible={isNavVisible}>
          <ul id="primary-navigation" className="nav-links">
            <li>
              <a href="#home" onClick={closeAllMenus}>
                {TEXT.home}
              </a>
            </li>

            {/* DROPDOWN 1: ABOUT */}
            <li
              className={
                activeDropdown === "about" ? "dropdown open" : "dropdown"
              }
              onMouseEnter={() => handleMouseEnter("about")}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#about"
                className="dropdown-toggle"
                onClick={(e) => handleParentClick(e, "about")}
              >
                {TEXT.aboutToggle} <FaAngleDown className="caret-icon" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#prayer-times" onClick={closeAllMenus}>
                    {TEXT.prayerTimetable}
                  </a>
                </li>
                <li>
                  <a href="#about-us" onClick={closeAllMenus}>
                    {TEXT.aboutUs}
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={closeAllMenus}>
                    {TEXT.services}
                  </a>
                </li>
              </ul>
            </li>

            {/* DROPDOWN 2: ANNOUNCEMENTS */}
            <li
              className={
                activeDropdown === "announcements"
                  ? "dropdown open"
                  : "dropdown"
              }
              onMouseEnter={() => handleMouseEnter("announcements")}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#announcements"
                className="dropdown-toggle"
                onClick={(e) => handleParentClick(e, "announcements")}
              >
                {TEXT.announcementsToggle} <FaAngleDown className="caret-icon" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#announcements" onClick={closeAllMenus}>
                    {TEXT.latestNews}
                  </a>
                </li>
                <li>
                  <a
                    href={WHATSAPP_GROUP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeAllMenus}
                  >
                    {TEXT.joinWhatsAppGroup}
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <a href="#donate" onClick={closeAllMenus}>
                {TEXT.donate}
              </a>
            </li>
            <li>
              <a href="#gallery" onClick={closeAllMenus}>
                {TEXT.gallery}
              </a>
            </li>
            <li>
              <a href="#footer" onClick={closeAllMenus}>
                {TEXT.contact}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
