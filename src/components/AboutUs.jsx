import React from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import "./AboutUs.css";
import aboutImage from "../assets/dawat-e-islami uk.webp";

function AboutUs() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      id="about-us"
      className={`about-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="about-wrapper">
        <h2>About Us</h2>

        <div className="about-content-grid">
          <div className="about-text-content">
            <p className="about-text">
              Welcome to Faizane Madina Masjid Southend. We are a proud part of{" "}
              <strong>Dawat-e-Islami</strong>, a global, non-political Islamic
              organisation working for the propagation of the Quran and Sunnah.
            </p>

            <p className="about-text">
              As a significant part of this mission,{" "}
              <strong>
                Faizane Madina Masjid Southend was the fourth Dawat-e-Islami
                mosque established in the United Kingdom.
              </strong>
            </p>

            <p className="about-text">
              Today, we are honoured to serve the local community of
              Southend-on-Sea with{" "}
              <strong>
                daily prayers, educational classes, and weekly spiritual
                gatherings.
              </strong>
            </p>
          </div>

          <div className="about-image-wrapper">
            <img
              src={aboutImage}
              alt="Dawat-e-Islami UK Logo"
              className="about-image"
            />
            <a
              href="https://dawateislami.co.uk/about-us/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-about"
            >
              Learn More <span className="sr-only">about Dawat-e-Islami</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
