import React, { useState, useEffect } from "react";
import TodayPrayerTimes from "./TodayPrayerTimes";
import AboutUs from "./AboutUs";
import "./PrayerTimes.css";

function PrayerTimes() {
  const [timetable, setTimetable] = useState(null);
  const [jummahTimes, setJummahTimes] = useState({
    j1: "12:30 PM",
    j2: "1:30 PM",
  });
  const [loading, setLoading] = useState(true);

  // We removed the 'error' state because we don't want to block the UI
  // with a big error message anymore.

  useEffect(() => {
    async function fetchData() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonthName = now.toLocaleDateString("en-GB", {
        month: "long",
      });
      const API_URL =
        import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337";

      setLoading(true);

      // --- 1. Fetch Timetable (Isolated) ---
      // We use a separate try/catch here so if it fails, it doesn't stop the Jummah fetch
      try {
        const timetableUrl = `${API_URL}/api/timetables?filters[year][$eq]=${currentYear}&filters[month][$eq]=${currentMonthName}&populate=timetableImage`;
        const timetableRes = await fetch(timetableUrl);

        if (timetableRes.ok) {
          const timetableJson = await timetableRes.json();
          const currentTimetable = timetableJson?.data?.[0];

          if (currentTimetable) {
            setTimetable(currentTimetable);
          } else {
            console.warn("Timetable not found for this month.");
            setTimetable(null); // Explicitly set null so child shows placeholder
          }
        }
      } catch (e) {
        console.error("Timetable fetch failed:", e);
        setTimetable(null);
      }

      // --- 2. Fetch Weekly Events / Jummah (Isolated) ---
      try {
        const eventsUrl = `${API_URL}/api/weekly-events`;
        const eventsRes = await fetch(eventsUrl);
        if (eventsRes.ok) {
          const eventsJson = await eventsRes.json();
          if (eventsJson.data) {
            const findTime = (num) => {
              const event = eventsJson.data.find((e) => {
                const title = (
                  e.Title ||
                  e.attributes?.Title ||
                  ""
                ).toLowerCase();
                return title.includes("jummah") && title.includes(num);
              });
              return event?.Time || event?.attributes?.Time;
            };
            setJummahTimes({
              j1: findTime("1") || "12:30 PM",
              j2: findTime("2") || "1:30 PM",
            });
          }
        }
      } catch (eventError) {
        console.warn("Jummah times could not be loaded, using defaults.");
      }

      // We are done loading regardless of success/failure
      setLoading(false);
    }

    fetchData();
  }, []);

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#555" }}>
        Loading...
      </div>
    );
  }

  // If timetable is null, prayerData will be undefined.
  // TodayPrayerTimes handles 'undefined' by showing its own error card.
  const prayerData = timetable?.prayerData;
  const timetableFileUrl = timetable?.timetableImage?.url || "#";

  return (
    <div className="prayer-section-wrapper" id="prayer-times">
      <div className="prayer-content-grid">
        <div className="left-column">
          {/* This component will now render its placeholder message if prayerData is missing */}
          <TodayPrayerTimes prayerData={prayerData} />
        </div>

        <div className="right-column">
          <div className="about-us-wrapper">
            <AboutUs />
          </div>

          <div className="jummah-info-card">
            <div className="jummah-details">
              <h4>Jummah Salah</h4>
              <div className="jummah-times">
                <div className="j-time-row">
                  <span className="j-label">1st Jamaat:</span>
                  <span className="j-time">{jummahTimes.j1}</span>
                </div>
                <div className="j-time-row">
                  <span className="j-label">2nd Jamaat:</span>
                  <span className="j-time">{jummahTimes.j2}</span>
                </div>
              </div>
            </div>

            {/* Only show button if we actually have a valid file link */}
            <a
              href={timetableFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn timetable-btn"
              style={{
                display: timetableFileUrl === "#" ? "none" : "inline-block",
              }}
            >
              View Monthly Timetable
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrayerTimes;
