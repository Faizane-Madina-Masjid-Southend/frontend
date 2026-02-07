import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
// Import Top-of-Page components normally to prevent Layout Shifts (CLS)
import PrayerTimes from "./components/PrayerTimes";
import RamadanCountdown from "./components/RamadanCountdown";
import "./App.css";

// Lazy Load "Below the Fold" content to save bandwidth (FCP)
const Services = lazy(() => import("./components/Services"));
const Announcements = lazy(() => import("./components/Announcements"));
const Donate = lazy(() => import("./components/Donate"));
const Gallery = lazy(() => import("./components/Gallery"));
const Footer = lazy(() => import("./components/Footer"));

// A placeholder for the bottom sections
const SectionLoader = () => (
  <div style={{ padding: "4rem 0", textAlign: "center", color: "#047857" }}>
    <div className="loader">Loading...</div>
  </div>
);

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <section id="home" className="section">
          <Hero />
        </section>

        {/* STABLE ZONE: Loaded instantly, no layout shifts */}
        <section id="prayer-times" className="section prayer-section-wrapper">
          <PrayerTimes />
        </section>

        <RamadanCountdown />

        {/* LAZY ZONE: Loaded in background */}
        <Suspense fallback={<SectionLoader />}>
          <section id="services" className="section">
            <Services />
          </section>

          <section id="announcements" className="section">
            <Announcements />
          </section>

          <section id="donate" className="section">
            <Donate />
          </section>

          <section id="gallery" className="section">
            <Gallery />
          </section>
        </Suspense>
      </main>

      <section id="footer" className="section">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </section>
    </div>
  );
}

export default App;
