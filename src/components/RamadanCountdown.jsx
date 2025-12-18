import React, { useState, useEffect, useRef } from "react";
import "./RamadanCountdown.css";

const RamadanCountdown = () => {
  const ramadanDate = new Date("February 18, 2026 17:20:00").getTime();

  // Animation State
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 1. Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = ramadanDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ramadanDate]);

  // 2. Scroll Animation Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`ramadan-container ${isVisible ? "is-visible" : ""}`}
    >
      <div className="circle-small"></div>

      <div className="ramadan-overlay">
        <div className="ramadan-content">
          <div className="ramadan-header">
            <span className="sub-title">Prepare Your Heart</span>
            <h2>Ramadan Begins In</h2>
            <p className="disclaimer">*Subject to moon sighting</p>
          </div>

          <div className="timer-grid">
            <div className="timer-box">
              <span className="number">{timeLeft.days}</span>
              <span className="label">Days</span>
            </div>
            <div className="timer-box">
              <span className="number">{timeLeft.hours}</span>
              <span className="label">Hours</span>
            </div>
            <div className="timer-box">
              <span className="number">{timeLeft.minutes}</span>
              <span className="label">Mins</span>
            </div>
            <div className="timer-box">
              <span className="number">{timeLeft.seconds}</span>
              <span className="label">Secs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamadanCountdown;
