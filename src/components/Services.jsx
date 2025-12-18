// src/components/Services.jsx

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  FaMosque,
  FaCalendarDay,
  FaBookOpen,
  FaUsers,
  FaHandsHelping,
} from "react-icons/fa";
import servicesImage from "../assets/mosque_inside.webp";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import "./Services.css";

const getIconForService = (title) => {
  switch (title) {
    case "Daily Prayers":
      return <FaMosque />;
    case "Jummah":
      return <FaCalendarDay />;
    case "Madrassa":
      return <FaBookOpen />;
    case "Weekly Ijtimah":
      return <FaUsers />;
    case "Private Gatherings":
      return <FaHandsHelping />;
    default:
      return <FaMosque />;
  }
};

const getSortableTime = (timeString) => {
  if (!timeString) return 9999;
  if (timeString.toLowerCase().startsWith("after")) return 9999;
  const timePart = timeString.split("-")[0].trim();
  const [hours, minutes] = timePart.replace(":", ".").split(".");
  if (!isNaN(hours) && !isNaN(minutes)) {
    return parseInt(hours, 10) * 100 + parseInt(minutes, 10);
  }
  return 9998;
};

function Services() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [serviceDetails, setServiceDetails] = useState([]);
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [heroRef, isHeroVisible] = useIntersectionObserver({ threshold: 0.2 });
  const [calendarAnimRef, isCalendarVisible] = useIntersectionObserver({
    threshold: 0.1,
  });
  const calendarScrollRef = useRef(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const API_URL =
          import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337";

        const [servicesRes, eventsRes] = await Promise.all([
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/weekly-events`),
        ]);

        if (!servicesRes.ok)
          throw new Error(`Failed to fetch services: ${servicesRes.status}`);
        if (!eventsRes.ok)
          throw new Error(`Failed to fetch weekly events: ${eventsRes.status}`);

        const servicesData = await servicesRes.json();
        const eventsData = await eventsRes.json();

        setServiceDetails(servicesData.data || []);
        setWeeklyEvents(eventsData.data || []);
      } catch (error) {
        console.error("Failed to fetch data from Strapi:", error);
        setServiceDetails([]);
        setWeeklyEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const calendarElement = calendarScrollRef.current;
    const handleScroll = () => {
      if (calendarElement) {
        const scrollEnd =
          calendarElement.scrollWidth - calendarElement.clientWidth;
        if (calendarElement.scrollLeft >= scrollEnd - 1) {
          setIsScrolledToEnd(true);
        } else {
          setIsScrolledToEnd(false);
        }
      }
    };
    if (calendarElement) {
      calendarElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (calendarElement) {
        calendarElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading]);

  if (loading) {
    return (
      <div
        id="services"
        className="services-section"
        style={{ minHeight: "600px" }}
      >
        <div className="services-header-wrapper">
          <h2
            style={{ color: "white", textAlign: "center", paddingTop: "5rem" }}
          >
            Loading Services...
          </h2>
        </div>
      </div>
    );
  }

  const serviceOrder = [
    "Daily Prayers",
    "Jummah",
    "Madrassa",
    "Weekly Ijtimah",
    "Private Gatherings",
  ];

  return (
    <div id="services" className="services-section">
      <div
        className={`services-hero-container ${
          isHeroVisible ? "is-visible" : ""
        }`}
        ref={heroRef}
      >
        <h2>Our Services</h2>
        <img
          src={servicesImage}
          alt="Mosque service"
          className="services-image"
        />
        <div className="services-slider-container">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            autoplay={{
              delay: 9000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            className="services-swiper"
          >
            {serviceDetails
              .sort(
                (a, b) =>
                  serviceOrder.indexOf(a.title) - serviceOrder.indexOf(b.title)
              )
              .map((service) => (
                <SwiperSlide key={service.id}>
                  <div className="service-item">
                    <span className="service-icon">
                      {getIconForService(service.title)}
                    </span>
                    <div className="service-text">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>

      <div
        className={`calendar-wrapper ${isCalendarVisible ? "is-visible" : ""}`}
        ref={calendarAnimRef}
      >
        <div className="weekly-events-header">
          <h2>Our Weekly Events</h2>
        </div>

        <div
          ref={(node) => {
            calendarScrollRef.current = node;
          }}
          className={`weekly-calendar ${
            isScrolledToEnd ? "scrolled-to-end" : ""
          }`}
        >
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day">
              <h3>{day}</h3>
              <div className="events-list">
                {weeklyEvents
                  .filter((event) => event.day === day)
                  .sort(
                    (a, b) => getSortableTime(a.time) - getSortableTime(b.time)
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className="event-card"
                      data-category={event.category}
                    >
                      <h4>{event.title}</h4>
                      <p>{event.time}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
