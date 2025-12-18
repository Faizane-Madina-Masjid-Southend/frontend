import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import PrayerTimes from "./components/PrayerTimes";
import Services from "./components/Services";
import Donate from "./components/Donate";
import Gallery from "./components/Gallery";
import "./App.css";
import Announcements from "./components/Announcements";
import AboutUs from "./components/AboutUs";
import RamadanCountdown from "./components/RamadanCountdown";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <section id="home" className="section">
          <Hero />
        </section>

        <section id="prayer-times" className="section prayer-section-wrapper">
          <PrayerTimes />
        </section>
        <RamadanCountdown />

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
      </main>
      <section id="footer" className="section">
        <Footer />
      </section>
    </div>
  );
}

export default App;
