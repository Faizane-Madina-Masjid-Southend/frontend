import React from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import "./AboutUs.css";
import aboutImage from "../assets/dawat-e-islami uk.webp";

const TEXT = {
  title: "About Us",
  orgName: "Dawat-e-Islami",
  welcome: "Welcome to Faizane Madina Masjid Southend. We are a proud part of ",
  propagation: ", a global, non-political Islamic organisation working for the propagation of the Quran and Sunnah.",
  mission: "As a significant part of this mission, ",
  mosqueInfo: "Faizane Madina Masjid Southend was the fourth Dawat-e-Islami mosque established in the United Kingdom.",
  serve: "Today, we are honoured to serve the local community of Southend-on-Sea with ",
  activities: "daily prayers, educational classes, and weekly spiritual gatherings.",
  imageAlt: "Dawat-e-Islami UK Logo",
  learnMore: "Learn More",
  srAbout: "about Dawat-e-Islami"
};

function AboutUs() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      id="about-us"
      className={`about-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="about-wrapper">
        <h2>{TEXT.title}</h2>

        <div className="about-content-grid">
          <div className="about-text-content">
            <p className="about-text">
              {TEXT.welcome}
              <strong>{TEXT.orgName}</strong>
              {TEXT.propagation}
            </p>

            <p className="about-text">
              {TEXT.mission}
              <strong>
                {TEXT.mosqueInfo}
              </strong>
            </p>

            <p className="about-text">
              {TEXT.serve}
              <strong>
                {TEXT.activities}
              </strong>
            </p>
          </div>

          <div className="about-image-wrapper">
            <img
              src={aboutImage}
              alt={TEXT.imageAlt}
              className="about-image"
            />
            <a
              href="https://dawateislami.co.uk/about-us/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-about"
            >
              {TEXT.learnMore} <span className="sr-only">{TEXT.srAbout}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
