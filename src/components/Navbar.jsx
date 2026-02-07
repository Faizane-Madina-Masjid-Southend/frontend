import React, { useState } from "react";
import fullLogo from "../assets/website-logo.webp";
import { FaAngleDown } from "react-icons/fa";
import "./Navbar.css";

const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/JSjCIBk2jkr9rnlaHONDO1?mode=wwt";

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
              alt="Faizan-e-Madina Southend Logo"
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
          <span className="sr-only">Menu</span>
        </button>

        {/* LINKS SECTION */}
        <div className="nav-links-container" data-visible={isNavVisible}>
          <ul id="primary-navigation" className="nav-links">
            <li>
              <a href="#home" onClick={closeAllMenus}>
                Home
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
                About <FaAngleDown className="caret-icon" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#prayer-times" onClick={closeAllMenus}>
                    Prayer Timetable
                  </a>
                </li>
                <li>
                  <a href="#about-us" onClick={closeAllMenus}>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={closeAllMenus}>
                    Services
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
                Announcements <FaAngleDown className="caret-icon" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#announcements" onClick={closeAllMenus}>
                    Latest News
                  </a>
                </li>
                <li>
                  <a
                    href={WHATSAPP_GROUP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeAllMenus}
                  >
                    Join WhatsApp Group
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <a href="#donate" onClick={closeAllMenus}>
                Donate
              </a>
            </li>
            <li>
              <a href="#gallery" onClick={closeAllMenus}>
                Gallery
              </a>
            </li>
            <li>
              <a href="#footer" onClick={closeAllMenus}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
