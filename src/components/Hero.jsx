import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <img
        src="banner.webp"
        srcSet="banner-small.webp 600w, banner-medium.webp 850w, banner.webp 1260w"
        sizes="(max-width: 600px) 100vw, (max-width: 900px) 100vw, 100vw"
        alt="Faizane Madina Masjid Southend"
        className="hero-bg"
        fetchPriority="high"
        decoding="async"
        width="1260"
        height="559"
      />

      <div className="hero-content">
        <span className="hero-subtitle">Welcome to</span>
        <h1>Faizane Madina Masjid Southend</h1>
      </div>
    </section>
  );
}

export default Hero;
